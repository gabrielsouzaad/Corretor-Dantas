package Corretor.Dantas.API.service;

import Corretor.Dantas.API.dto.UserRequest;
import Corretor.Dantas.API.entity.User;
import Corretor.Dantas.API.exception.EmailAlreadyExistsException;
import Corretor.Dantas.API.exception.ResourceNotFoundException;
import Corretor.Dantas.API.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public User create(UserRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(
                    "E-mail já cadastrado"
            );
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .build();

        return userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Usuário não encontrado")
                );
    }
}