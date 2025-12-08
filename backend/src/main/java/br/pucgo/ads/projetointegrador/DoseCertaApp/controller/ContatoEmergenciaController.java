package br.pucgo.ads.projetointegrador.DoseCertaApp.controller;

import br.pucgo.ads.projetointegrador.DoseCertaApp.model.ContatoEmergencia;
import br.pucgo.ads.projetointegrador.DoseCertaApp.service.ContatoEmergenciaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/contatos-emergencia")
public class ContatoEmergenciaController {

    private final ContatoEmergenciaService service;

    public ContatoEmergenciaController(ContatoEmergenciaService service) {
        this.service = service;
    }

    @GetMapping("/{usuarioId}")
    public List<ContatoEmergencia> listarPorUsuario(@PathVariable Long usuarioId) {
        return service.listarPorUsuario(usuarioId);
    }

    @PostMapping
    public ResponseEntity<ContatoEmergencia> criar(@RequestBody ContatoRequest request) {
        ContatoEmergencia salvo = service.criar(request.getUsuarioId(), request.getNome(), request.getTelefone(), request.getRelacao());
        return ResponseEntity.ok(salvo);
    }

    public static class ContatoRequest {
        private Long usuarioId;
        private String nome;
        private String telefone;
        private String relacao;

        public Long getUsuarioId() { return usuarioId; }
        public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }
        public String getTelefone() { return telefone; }
        public void setTelefone(String telefone) { this.telefone = telefone; }
        public String getRelacao() { return relacao; }
        public void setRelacao(String relacao) { this.relacao = relacao; }
    }
}