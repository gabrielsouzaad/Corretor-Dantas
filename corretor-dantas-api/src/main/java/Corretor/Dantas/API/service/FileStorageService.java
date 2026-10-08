package Corretor.Dantas.API.service;

import Corretor.Dantas.API.exception.InvalidFileException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Logger log =
            LoggerFactory.getLogger(FileStorageService.class);

    private final Path root;

    public FileStorageService(
            @Value("${app.upload-dir:uploads}") String uploadDir
    ) {
        this.root = Path.of(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new UncheckedIOException(
                    "Não foi possível criar a pasta de uploads", e
            );
        }
    }

    public Path getRoot() {
        return root;
    }

    public void validate(MultipartFile file) {
        detectExtension(file);
    }

    public String store(MultipartFile file) {
        String fileName = UUID.randomUUID() + detectExtension(file);

        try (InputStream in = file.getInputStream()) {
            Files.copy(in, root.resolve(fileName));
        } catch (IOException e) {
            throw new UncheckedIOException("Falha ao salvar a imagem", e);
        }

        return fileName;
    }

    public void delete(String fileName) {
        try {
            Files.deleteIfExists(root.resolve(fileName).normalize());
        } catch (IOException e) {
            log.warn("Não foi possível remover o arquivo {}", fileName, e);
        }
    }

    private String detectExtension(MultipartFile file) {

        if (file.isEmpty()) {
            throw new InvalidFileException("Arquivo vazio");
        }

        byte[] h = new byte[12];
        int read;

        try (InputStream in = file.getInputStream()) {
            read = in.readNBytes(h, 0, h.length);
        } catch (IOException e) {
            throw new UncheckedIOException("Falha ao ler a imagem", e);
        }

        // JPEG: FF D8 FF
        if (read >= 3
                && (h[0] & 0xFF) == 0xFF
                && (h[1] & 0xFF) == 0xD8
                && (h[2] & 0xFF) == 0xFF) {
            return ".jpg";
        }

        // PNG: 89 'P' 'N' 'G'
        if (read >= 4
                && (h[0] & 0xFF) == 0x89
                && h[1] == 'P' && h[2] == 'N' && h[3] == 'G') {
            return ".png";
        }

        // WebP: "RIFF" .... "WEBP"
        if (read >= 12
                && h[0] == 'R' && h[1] == 'I' && h[2] == 'F' && h[3] == 'F'
                && h[8] == 'W' && h[9] == 'E' && h[10] == 'B' && h[11] == 'P') {
            return ".webp";
        }

        throw new InvalidFileException(
                "Formato inválido. Envie imagens JPG, PNG ou WebP."
        );
    }
}