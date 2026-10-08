package Corretor.Dantas.API.dto;

import Corretor.Dantas.API.entity.PropertyImage;

public record PropertyImageResponse(
        Long id,
        String url,
        boolean cover
) {

    public static PropertyImageResponse from(PropertyImage image) {
        return new PropertyImageResponse(
                image.getId(),
                "/uploads/" + image.getFileName(),
                image.isCover()
        );
    }
}