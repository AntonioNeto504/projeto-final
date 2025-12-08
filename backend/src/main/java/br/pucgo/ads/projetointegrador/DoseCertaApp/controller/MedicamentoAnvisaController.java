package br.pucgo.ads.projetointegrador.DoseCertaApp.controller;




import br.pucgo.ads.projetointegrador.DoseCertaApp.model.MedicamentoAnvisa;
import br.pucgo.ads.projetointegrador.DoseCertaApp.service.MedicamentoAnvisaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/medicamentos/anvisa")
public class MedicamentoAnvisaController {

    private final MedicamentoAnvisaService service;

    public MedicamentoAnvisaController(MedicamentoAnvisaService service) {
        this.service = service;
    }

    // ===================== IMPORTAÇÃO =====================

    @PostMapping("/import")
    public ResponseEntity<String> importarCsv(@RequestParam("file") MultipartFile file) {
        int ignorados = service.importarCsv(file);
        return ResponseEntity.ok("Importação concluída! Registros ignorados (duplicados): " + ignorados);
    }

    // ====================== BUSCAS ========================

    @GetMapping("/{id}")
    public ResponseEntity<MedicamentoAnvisa> buscarPorId(@PathVariable Long id) {
        MedicamentoAnvisa medicamento = service.buscarPorId(id);
        return medicamento != null
                ? ResponseEntity.ok(medicamento)
                : ResponseEntity.notFound().build();
    }

    @GetMapping
    public List<MedicamentoAnvisa> buscar(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String registro,
            @RequestParam(required = false) String principio
    ) {
        if (nome != null) {
            return service.buscarPorNome(nome);
        }

        if (registro != null) {
            MedicamentoAnvisa m = service.buscarPorNumeroRegistro(registro);
            return m != null ? List.of(m) : List.of();
        }

        if (principio != null) {
            return service.buscarPorPrincipioAtivo(principio);
        }

        // Se nenhum filtro for informado: retorna tudo
        return service.listarTodos();
    }
}
