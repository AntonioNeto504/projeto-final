package br.pucgo.ads.projetointegrador.DoseCertaApp.sms;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;

import java.util.Map;

@RestController
@RequestMapping("/sms")
public class SmsController {

    private final SmsService smsService;

    @Autowired
    public SmsController(SmsService smsService) {
        this.smsService = smsService;
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendSms(@Valid @RequestBody SendSmsRequest request) {
        try {
            String toSanitized = sanitizeNumber(request.getTo());
            String sid = smsService.sendSms(toSanitized, request.getMessage());
            return ResponseEntity.ok(Map.of("sid", sid));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private String sanitizeNumber(String to) {
        if (to == null) return to;
        String trimmed = to.trim();
        // se já tem + deixa como está
        if (trimmed.startsWith("+")) return trimmed;
        // se começou com 00 (prefixo internacional comum) substitui por +
        if (trimmed.startsWith("00")) return "+" + trimmed.substring(2);
        // se for apenas dígitos e já incluir código do país (ex: 5562985442023) adiciona +
        if (trimmed.matches("\\d{6,15}")) return "+" + trimmed;
        // caso contrário retorna original e deixe validação existente falhar
        return trimmed;
    }
}