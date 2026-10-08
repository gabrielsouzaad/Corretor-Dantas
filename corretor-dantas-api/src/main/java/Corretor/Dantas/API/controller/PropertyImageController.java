package Corretor.Dantas.API.controller;

import Corretor.Dantas.API.dto.PropertyImageResponse;
import Corretor.Dantas.API.entity.PropertyImage;
import Corretor.Dantas.API.service.PropertyImageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/properties/{propertyId}/images")
public class PropertyImageController {

    private final PropertyImageService imageService;

    public PropertyImageController(PropertyImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<PropertyImageResponse>> upload(
            @PathVariable Long propertyId,
            @RequestParam("files") List<MultipartFile> files
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toResponse(imageService.add(propertyId, files)));
    }

    @PutMapping("/{imageId}/cover")
    public ResponseEntity<List<PropertyImageResponse>> setCover(
            @PathVariable Long propertyId,
            @PathVariable Long imageId
    ) {
        return ResponseEntity.ok(
                toResponse(imageService.setCover(propertyId, imageId))
        );
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<List<PropertyImageResponse>> remove(
            @PathVariable Long propertyId,
            @PathVariable Long imageId
    ) {
        return ResponseEntity.ok(
                toResponse(imageService.remove(propertyId, imageId))
        );
    }

    private List<PropertyImageResponse> toResponse(List<PropertyImage> images) {
        return images.stream().map(PropertyImageResponse::from).toList();
    }
}