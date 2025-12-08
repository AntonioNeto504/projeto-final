package br.pucgo.ads.projetointegrador.DoseCertaApp.service;

import br.pucgo.ads.projetointegrador.DoseCertaApp.model.ContatoEmergencia;
import br.pucgo.ads.projetointegrador.DoseCertaApp.model.Medicamento;
import br.pucgo.ads.projetointegrador.DoseCertaApp.model.MedicamentoAnvisa;
import br.pucgo.ads.projetointegrador.DoseCertaApp.model.TarjaTipo;
import br.pucgo.ads.projetointegrador.DoseCertaApp.repository.ContatoEmergenciaRepository;
import br.pucgo.ads.projetointegrador.DoseCertaApp.repository.MedicamentoAnvisaRepository;
import br.pucgo.ads.projetointegrador.DoseCertaApp.repository.MedicamentoRepository;
import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import br.pucgo.ads.projetointegrador.plataforma.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class MedicamentoService {

    private final MedicamentoRepository medicamentoRepository;
    private final UserRepository usuarioRepository;
    private final ContatoEmergenciaRepository contatoRepository;
    private final MedicamentoAnvisaRepository anvisaRepository;

    public MedicamentoService(MedicamentoRepository medicamentoRepository,
                              UserRepository usuarioRepository,
                              ContatoEmergenciaRepository contatoRepository,
                              MedicamentoAnvisaRepository anvisaRepository) {
        this.medicamentoRepository = medicamentoRepository;
        this.usuarioRepository = usuarioRepository;
        this.contatoRepository = contatoRepository;
        this.anvisaRepository = anvisaRepository;
    }

    // ===================== LISTAGEM =====================
    public List<Medicamento> listarTodos() {
        return medicamentoRepository.findAll();
    }

    public List<Medicamento> listarPorUsuario(Long usuarioId) {
        validarUsuario(usuarioId);
        return medicamentoRepository.findByUsuarioId(usuarioId);
    }

    public Medicamento buscarPorId(Long id) {
        return medicamentoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Medicamento não encontrado!"));
    }

    // ===================== CADASTRO =====================
    @Transactional
    public Medicamento salvar(Medicamento medicamento, Long usuarioId, Long contatoId, Long anvisaId) {

        User usuario = validarUsuario(usuarioId);

        // ANVISA obrigatório
        MedicamentoAnvisa anvisa = anvisaRepository.findById(anvisaId)
                .orElseThrow(() -> new EntityNotFoundException("Medicamento ANVISA não encontrado!"));
        medicamento.setMedicamentoAnvisa(anvisa);

        // Verifica duplicidade para o mesmo usuário + mesmo medicamento ANVISA
        boolean existe = medicamentoRepository.existsByUsuarioIdAndMedicamentoAnvisaIdAndContatarEmergenciaFalse(
                usuarioId, anvisaId
        );
        if (existe) {
            throw new IllegalArgumentException("Este medicamento já está cadastrado para este usuário.");
        }

        // Associa usuário
        medicamento.setUsuario(usuario);

        // Contato de emergência (opcional)
        if (contatoId != null) {
            ContatoEmergencia contato = contatoRepository.findById(contatoId)
                    .orElseThrow(() -> new EntityNotFoundException("Contato de emergência não encontrado!"));
            medicamento.(contato);
        }

        // Regra de tarja preta
        if (medicamento.getTarja() == TarjaTipo.PRETA) {
            medicamento.setContatarEmergencia(true);
        }

        // Datas do tratamento
        int dias = medicamento.calcularDias();
        if (dias < 1) {
            throw new IllegalArgumentException("O tratamento deve durar pelo menos 1 dia.");
        }

        medicamento.setDataInicio(LocalDate.now());
        medicamento.setDataFim(LocalDate.now().plusDays(dias - 1));

        // Liga horários ao medicamento
        if (medicamento.getHorarios() != null) {
            medicamento.getHorarios().forEach(h -> h.setMedicamento(medicamento));
        }

        return medicamentoRepository.save(medicamento);
    }

    // ===================== ATUALIZAÇÃO =====================
    @Transactional
    public Medicamento atualizar(Long id, Medicamento atualizado, Long contatoId, Long anvisaId) {

        Medicamento existente = buscarPorId(id);

        // Atualiza campos simples
        existente.setTipoDosagem(atualizado.getTipoDosagem());
        existente.setDoseDiaria(atualizado.getDoseDiaria());
        existente.setQuantidadeCartela(atualizado.getQuantidadeCartela());
        existente.setTotalFrasco(atualizado.getTotalFrasco());
        existente.setTarja(atualizado.getTarja());

        // Atualiza medicamento ANVISA
        if (anvisaId != null) {
            MedicamentoAnvisa anvisa = anvisaRepository.findById(anvisaId)
                    .orElseThrow(() -> new EntityNotFoundException("Medicamento ANVISA não encontrado!"));
            existente.setMedicamentoAnvisa(anvisa);
        }

        // Atualiza contato de emergência
        if (contatoId != null) {
            ContatoEmergencia contato = contatoRepository.findById(contatoId)
                    .orElseThrow(() -> new EntityNotFoundException("Contato não encontrado!"));
            existente.setContatoEmergencia(contato);
            existente.setContatarEmergencia(true);
        } else if (existente.getTarja() == TarjaTipo.PRETA) {
            existente.setContatarEmergencia(true);
        } else {
            existente.setContatarEmergencia(false);
        }

        // Recalcula datas
        int dias = existente.calcularDias();
        existente.setDataInicio(LocalDate.now());
        existente.setDataFim(LocalDate.now().plusDays(dias - 1));

        // Atualiza horários
        if (atualizado.getHorarios() != null) {
            existente.getHorarios().clear();
            atualizado.getHorarios().forEach(h -> {
                h.setMedicamento(existente);
                existente.getHorarios().add(h);
            });
        }

        return medicamentoRepository.save(existente);
    }

    // ===================== EXCLUSÃO =====================
    @Transactional
    public void excluir(Long id) {
        if (!medicamentoRepository.existsById(id)) {
            throw new EntityNotFoundException("Medicamento não encontrado!");
        }
        medicamentoRepository.deleteById(id);
    }

    // ===================== UTIL =====================
    private User validarUsuario(Long usuarioId) {
        return usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado!"));
    }
}
