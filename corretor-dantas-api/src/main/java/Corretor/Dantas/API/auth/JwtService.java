package Corretor.Dantas.API.auth;

import Corretor.Dantas.API.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;

    @Value("${jwt.expiration}")
    private long expiration;

    public JwtService(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    public String generateToken(User user) {

        Instant now = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()

                // O usuário autenticado será identificado pelo e-mail
                .subject(user.getEmail())

                .claim("userId", user.getId())

                .claim("email", user.getEmail())

                .claim("role", user.getRole().name())

                .issuedAt(now)

                .expiresAt(
                        now.plusMillis(expiration)
                )

                .build();

        return jwtEncoder
                .encode(
                        JwtEncoderParameters.from(claims)
                )
                .getTokenValue();
    }
}