package Corretor.Dantas.API.auth;

import Corretor.Dantas.API.dto.LoginRequest;
import Corretor.Dantas.API.dto.LoginResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {

        LoginResponse response =
                authService.login(request, httpRequest.getRemoteAddr());

        return ResponseEntity.ok(response);
    }
}