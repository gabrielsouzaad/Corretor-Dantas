package Corretor.Dantas.API.service;

import Corretor.Dantas.API.entity.User;
import Corretor.Dantas.API.exception.ResourceNotFoundException;
import Corretor.Dantas.API.repository.UserRepository;
import Corretor.Dantas.API.util.EmailUtils;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(EmailUtils.normalize(email))
                .orElseThrow(() ->
                        new ResourceNotFoundException("Usuário não encontrado")
                );
    }
}