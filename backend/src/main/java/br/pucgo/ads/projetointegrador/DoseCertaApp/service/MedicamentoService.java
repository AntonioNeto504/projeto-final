package br.pucgo.ads.projetointegrador.DoseCertaApp.service;

import br.pucgo.ads.projetointegrador.DoseCertaApp.dto.MedicamentoResponseDTO;
import br.pucgo.ads.projetointegrador.DoseCertaApp.model.ContatoEmergencia;
import br.pucgo.ads.projetointegrador.DoseCertaApp.model.Medicamento;
import br.pucgo.ads.projetointegrador.DoseCertaApp.model.MedicamentoAnvisa;
import br.pucgo.ads.projetointegrador.DoseCertaApp.model.MedicamentoHorario;
import br.pucgo.ads.projetointegrador.DoseCertaApp.model.RegistroTomada;
import br.pucgo.ads.projetointegrador.DoseCertaApp.model.TarjaTipo;
import br.pucgo.ads.projetointegrador.DoseCertaApp.repository.ContatoEmergenciaRepository;
import br.pucgo.ads.projetointegrador.DoseCertaApp.repository.MedicamentoAnvisaRepository;
import br.pucgo.ads.projetointegrador.DoseCertaApp.repository.MedicamentoHorarioRepository;
import br.pucgo.ads.projetointegrador.DoseCertaApp.repository.MedicamentoRepository;
import br.pucgo.ads.projetointegrador.DoseCertaApp.repository.RegistroTomadaRepository;
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
    private final MedicamentoHorarioRepository horarioRepository;
    private final RegistroTomadaRepository registroRepository;

    private final UserRepository userRepository;
    private final ContatoEmergenciaRepository contatoRepository;
    private final MedicamentoAnvisaRepository anvisaRepository;

    public MedicamentoService(MedicamentoRepository medicamentoRepository,
                              MedicamentoHorarioRepository horarioRepository,
                              RegistroTomadaRepository registroRepository,
                              UserRepository userRepository,
                              ContatoEmergenciaRepository contatoRepository,
                              MedicamentoAnvisaRepository anvisaRepository) {

        this.medicamentoRepository = medicamentoRepository;
        this.horarioRepository = horarioRepository;
        this.registroRepository = registroRepository;

        this.userRepository = userRepository;
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

    // ===================== DETALHAMENTO COM HORÁRIOS + REGISTRO =====================
    public MedicamentoResponseDTO detalharMedicamento(Long medicamentoId) {

        Medicamento medicamento = medicamentoRepository.findById(medicamentoId)
                .orElseThrow(() -> new EntityNotFoundException("Medicamento não encontrado!"));

        List<MedicamentoHorario> horarios =
                horarioRepository.findByMedicamentoIdOrderByHorarioAsc(medicamentoId);

        List<RegistroTomada> registrosDoDia =
                registroRepository.findByMedicamentoIdAndDataPrevista(
                        medicamentoId,
                        LocalDate.now()
                );

        return new MedicamentoResponseDTO(medicamento, horarios, registrosDoDia);
    }

    // ===================== CADASTRAR =====================
    @Transactional
    public Medicamento salvar(Medicamento medicamento, Long usuarioId, Long contatoId, Long anvisaId) {

        User usuario = validarUsuario(usuarioId);

        if (anvisaId == null) {
            throw new IllegalArgumentException("É necessário informar o anvisaId");
        }

        MedicamentoAnvisa anvisa = anvisaRepository.findById(anvisaId)
                .orElseThrow(() -> new EntityNotFoundException("Medicamento ANVISA não encontrado!"));
        medicamento.setMedicamentoAnvisa(anvisa);

        boolean existe = medicamentoRepository.existsByUsuarioIdAndMedicamentoAnvisaIdAndContatarEmergenciaFalse(
                usuarioId, anvisaId
        );
        if (existe) {
            throw new IllegalArgumentException("Já existe um medicamento deste tipo em uso.");
        }

        medicamento.setUsuario(usuario);

        if (contatoId != null) {
            contatoRepository.findById(contatoId)
                    .orElseThrow(() -> new EntityNotFoundException("Contato de emergência não encontrado!"));
        }

        if (medicamento.getTarja() == TarjaTipo.PRETA) {
            medicamento.setContatarEmergencia(true);
        }

        int dias = medicamento.calcularDias();
        medicamento.setDataInicio(LocalDate.now());
        medicamento.setDataFim(LocalDate.now().plusDays(dias - 1));

        if (medicamento.getHorarios() != null) {
            medicamento.getHorarios().forEach(h -> h.setMedicamento(medicamento));
        }

        return medicamentoRepository.save(medicamento);
    }

    // ===================== ATUALIZAR =====================
    @Transactional
    public Medicamento atualizar(Long id, Medicamento atualizado, Long contatoId, Long anvisaId) {

        Medicamento existente = medicamentoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Medicamento não encontrado!"));

        existente.setTipoDosagem(atualizado.getTipoDosagem());
        existente.setDoseDiaria(atualizado.getDoseDiaria());
        existente.setQuantidadeCartela(atualizado.getQuantidadeCartela());
        existente.setTotalFrasco(atualizado.getTotalFrasco());
        existente.setTarja(atualizado.getTarja());

        if (anvisaId != null) {
            MedicamentoAnvisa anvisa = anvisaRepository.findById(anvisaId)
                    .orElseThrow(() -> new EntityNotFoundException("Medicamento ANVISA não encontrado!"));
            existente.setMedicamentoAnvisa(anvisa);
        }

        if (existente.getTarja() == TarjaTipo.PRETA) {
            existente.setContatarEmergencia(true);
        } else if (contatoId != null) {
            contatoRepository.findById(contatoId)
                    .orElseThrow(() -> new EntityNotFoundException("Contato não encontrado!"));
            existente.setContatarEmergencia(true);
        } else {
            existente.setContatarEmergencia(false);
        }

        int dias = existente.calcularDias();
        existente.setDataInicio(LocalDate.now());
        existente.setDataFim(LocalDate.now().plusDays(dias - 1));

        if (atualizado.getHorarios() != null) {
            existente.getHorarios().clear();
            atualizado.getHorarios().forEach(h -> {
                h.setMedicamento(existente);
                existente.getHorarios().add(h);
            });
        }

        return medicamentoRepository.save(existente);
    }

    // ===================== EXCLUIR =====================
    @Transactional
    public void excluir(Long id) {
        if (!medicamentoRepository.existsById(id)) {
            throw new EntityNotFoundException("Medicamento não encontrado!");
        }
        medicamentoRepository.deleteById(id);
    }

    // ===================== UTL =====================
    private User validarUsuario(Long usuarioId) {
        return userRepository.findById(usuarioId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado!"));
    }
}
