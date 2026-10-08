package Corretor.Dantas.API.service;

import Corretor.Dantas.API.entity.Property;
import Corretor.Dantas.API.entity.PropertyImage;
import Corretor.Dantas.API.exception.InvalidFileException;
import Corretor.Dantas.API.exception.ResourceNotFoundException;
import Corretor.Dantas.API.repository.PropertyImageRepository;
import Corretor.Dantas.API.repository.PropertyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class PropertyImageService {

    public static final int MAX_IMAGES_PER_PROPERTY = 10;

    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository imageRepository;
    private final FileStorageService fileStorageService;

    public PropertyImageService(
            PropertyRepository propertyRepository,
            PropertyImageRepository imageRepository,
            FileStorageService fileStorageService
    ) {
        this.propertyRepository = propertyRepository;
        this.imageRepository = imageRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public List<PropertyImage> add(Long propertyId, List<MultipartFile> files) {

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Imóvel não encontrado")
                );

        List<MultipartFile> valid = files == null
                ? List.of()
                : files.stream().filter(file -> !file.isEmpty()).toList();

        if (valid.isEmpty()) {
            throw new InvalidFileException("Envie ao menos uma imagem");
        }

        long existing = imageRepository.countByPropertyId(propertyId);

        if (existing + valid.size() > MAX_IMAGES_PER_PROPERTY) {
            throw new InvalidFileException(
                    "Cada imóvel pode ter no máximo "
                            + MAX_IMAGES_PER_PROPERTY + " imagens"
            );
        }

        valid.forEach(fileStorageService::validate);

        boolean hasCover =
                imageRepository.existsByPropertyIdAndCoverTrue(propertyId);

        List<String> stored = new ArrayList<>();

        try {
            for (MultipartFile file : valid) {
                String fileName = fileStorageService.store(file);
                stored.add(fileName);

                imageRepository.save(
                        PropertyImage.builder()
                                .fileName(fileName)
                                .cover(!hasCover)
                                .property(property)
                                .build()
                );

                hasCover = true;
            }

            imageRepository.flush();

        } catch (RuntimeException e) {
            stored.forEach(fileStorageService::delete);
            throw e;
        }

        return imageRepository.findByPropertyIdOrderByCoverDescIdAsc(propertyId);
    }

    @Transactional
    public List<PropertyImage> setCover(Long propertyId, Long imageId) {

        findImage(propertyId, imageId);

        imageRepository.findByPropertyIdOrderByCoverDescIdAsc(propertyId)
                .forEach(image ->
                        image.setCover(image.getId().equals(imageId))
                );

        return imageRepository.findByPropertyIdOrderByCoverDescIdAsc(propertyId);
    }

    @Transactional
    public List<PropertyImage> remove(Long propertyId, Long imageId) {

        PropertyImage image = findImage(propertyId, imageId);

        boolean wasCover = image.isCover();
        String fileName = image.getFileName();

        imageRepository.delete(image);
        imageRepository.flush();

        if (wasCover) {
            imageRepository.findByPropertyIdOrderByCoverDescIdAsc(propertyId)
                    .stream()
                    .findFirst()
                    .ifPresent(next -> next.setCover(true));
        }

        deleteFileAfterCommit(fileName);

        return imageRepository.findByPropertyIdOrderByCoverDescIdAsc(propertyId);
    }

    private PropertyImage findImage(Long propertyId, Long imageId) {
        return imageRepository.findByIdAndPropertyId(imageId, propertyId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Imagem não encontrada")
                );
    }

    private void deleteFileAfterCommit(String fileName) {
        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {
                    @Override
                    public void afterCommit() {
                        fileStorageService.delete(fileName);
                    }
                }
        );
    }
}