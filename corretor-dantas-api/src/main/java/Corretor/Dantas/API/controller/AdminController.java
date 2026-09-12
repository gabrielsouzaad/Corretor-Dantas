package Corretor.Dantas.API.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @GetMapping("/teste")
    public ResponseEntity<String> teste() {

        return ResponseEntity.ok(
                "Acesso permitido. Você é ADMIN."
        );
    }
}