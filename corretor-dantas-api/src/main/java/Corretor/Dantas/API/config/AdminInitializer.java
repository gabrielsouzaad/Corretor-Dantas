package Corretor.Dantas.API.config;

import Corretor.Dantas.API.entity.Role;
import Corretor.Dantas.API.entity.User;
import Corretor.Dantas.API.repository.UserRepository;
import Corretor.Dantas.API.util.EmailUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements ApplicationRunner {

    private static final Logger log =
            LoggerFactory.getLogger(AdminInitializer.class);

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    @Value("${app.admin.name:Administrador}")
    private String adminName;

    @Value("${app.admin.email:}")
    private String adminEmail;

    @Value("${app.admin.password:}")
    private String adminPassword;

    public AdminInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(ApplicationArguments args) {

        String email = EmailUtils.normalize(adminEmail);

        if (email == null || email.isBlank() || adminPassword.isBlank()) {
            log.warn("ADMIN_EMAIL/ADMIN_PASSWORD não definidos: nenhum administrador será criado.");
            return;
        }

        if (adminPassword.length() < 8) {
            log.warn("ADMIN_PASSWORD deve ter ao menos 8 caracteres: administrador não criado.");
            return;
        }

        userRepository.findByEmail(email).ifPresentOrElse(
                existing -> {
                    if (existing.getRole() != Role.ADMIN) {
                        existing.setRole(Role.ADMIN);
                        userRepository.save(existing);
                        log.info("Usuário {} promovido a ADMIN.", email);
                    }
                },
                () -> {
                    userRepository.save(
                            User.builder()
                                    .name(adminName)
                                    .email(email)
                                    .password(passwordEncoder.encode(adminPassword))
                                    .role(Role.ADMIN)
                                    .build()
                    );
                    log.info("Administrador {} criado.", email);
                }
        );
    }
}