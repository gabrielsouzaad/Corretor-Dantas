package Corretor.Dantas.API.auth;

import Corretor.Dantas.API.dto.LoginRequest;
import Corretor.Dantas.API.dto.LoginResponse;
import Corretor.Dantas.API.entity.User;
import Corretor.Dantas.API.exception.InvalidCredentialsException;
import Corretor.Dantas.API.repository.UserRepository;
import Corretor.Dantas.API.util.EmailUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private static final String INVALID_MESSAGE = "E-mail ou senha inválidos";

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final LoginAttemptService loginAttemptService;
    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    // Hash usado quando o e-mail não existe, para o tempo de resposta
    // ser o mesmo nos dois casos (evita descobrir e-mails cadastrados).
    private final String dummyHash;

    public AuthService(
            UserRepository userRepository,
            JwtService jwtService,
            LoginAttemptService loginAttemptService) {

        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.loginAttemptService = loginAttemptService;
        this.dummyHash = passwordEncoder.encode("senha-ficticia-para-igualar-o-tempo");
    }

    public LoginResponse login(LoginRequest request, String clientIp) {

        String email = EmailUtils.normalize(request.email());

        loginAttemptService.checkAllowed(clientIp, email);

        Optional<User> user = userRepository.findByEmail(email);

        String hash = user.map(User::getPassword).orElse(dummyHash);

        boolean passwordMatches =
                passwordEncoder.matches(request.password(), hash);

        if (user.isEmpty() || !passwordMatches) {
            loginAttemptService.recordFailure(clientIp, email);
            throw new InvalidCredentialsException(INVALID_MESSAGE);
        }

        loginAttemptService.reset(clientIp, email);

        return new LoginResponse(jwtService.generateToken(user.get()));
    }
}