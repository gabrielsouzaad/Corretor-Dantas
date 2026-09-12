package Corretor.Dantas.API.auth;

import Corretor.Dantas.API.dto.LoginRequest;
import Corretor.Dantas.API.dto.LoginResponse;
import Corretor.Dantas.API.entity.User;
import Corretor.Dantas.API.exception.InvalidCredentialsException;
import Corretor.Dantas.API.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() ->
                        new InvalidCredentialsException(
                                "E-mail ou senha inválidos"
                        )
                );

        boolean passwordMatches = passwordEncoder.matches(
                request.password(),
                user.getPassword()
        );

        if (!passwordMatches) {
            throw new InvalidCredentialsException(
                    "E-mail ou senha inválidos"
            );
        }

        String token = jwtService.generateToken(user);

        return new LoginResponse(token);
    }
}