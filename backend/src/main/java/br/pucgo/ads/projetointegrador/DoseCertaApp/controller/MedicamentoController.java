package br.pucgo.ads.projetointegrador.DoseCertaApp.controller;

import br.pucgo.ads.projetointegrador.DoseCertaApp.dto.MedicamentoResponseDTO;
import br.pucgo.ads.projetointegrador.DoseCertaApp.model.Medicamento;
import br.pucgo.ads.projetointegrador.DoseCertaApp.service.MedicamentoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicamentos")
public class MedicamentoController {

    private final MedicamentoService service;

    public MedicamentoController(MedicamentoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Medicamento>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Medicamento>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(service.listarPorUsuario(usuarioId));
    }

    // NOVO ENDPOINT COM HORÁRIOS + REGISTRO DO DIA
    @GetMapping("/{id}")
    public ResponseEntity<MedicamentoResponseDTO> detalhar(@PathVariable Long id) {
        return ResponseEntity.ok(service.detalharMedicamento(id));
    }
    @GetMapping("/usuario/{usuarioId}/detalhes")
    public ResponseEntity<List<MedicamentoResponseDTO>> listarPorUsuarioDetalhado(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(service.listarPorUsuarioComDetalhes(usuarioId));
    }

    @PostMapping
    public ResponseEntity<Medicamento> criar(
            @RequestBody Medicamento medicamento,
            @RequestParam Long usuarioId,
            @RequestParam(required = false) Long contatoId,
            @RequestParam(required = false) Long anvisaId
    ) {
        return ResponseEntity.ok(service.salvar(medicamento, usuarioId, contatoId, anvisaId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medicamento> atualizar(
            @PathVariable Long id,
            @RequestBody Medicamento medicamento,
            @RequestParam(required = false) Long contatoId,
            @RequestParam(required = false) Long anvisaId
    ) {
        return ResponseEntity.ok(service.atualizar(id, medicamento, contatoId, anvisaId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
