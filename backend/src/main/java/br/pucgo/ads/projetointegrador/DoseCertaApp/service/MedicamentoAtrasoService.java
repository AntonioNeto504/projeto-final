package br.pucgo.ads.projetointegrador.DoseCertaApp.service;

import br.pucgo.ads.projetointegrador.DoseCertaApp.model.Medicamento;
import br.pucgo.ads.projetointegrador.DoseCertaApp.model.MedicamentoHorario;
import br.pucgo.ads.projetointegrador.DoseCertaApp.repository.MedicamentoHorarioRepository;
import br.pucgo.ads.projetointegrador.DoseCertaApp.sms.SmsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class MedicamentoAtrasoService {

    private static final Logger logger = LoggerFactory.getLogger(MedicamentoAtrasoService.class);

    private final MedicamentoHorarioRepository horarioRepo;
    private final SmsService smsService;

    public MedicamentoAtrasoService(
            MedicamentoHorarioRepository horarioRepo,
            SmsService smsService
    ) {
        this.horarioRepo = horarioRepo;
        this.smsService = smsService;
    }

    // 🔥 ESSENCIAL PARA EVITAR ERRO DE LAZY LOADING
    @Transactional
    public void verificarAtrasos() {

        LocalDateTime agora = LocalDateTime.now();
        var horarios = horarioRepo.findAllAbertos();

        logger.debug("⏱️ Verificando atrasos… {} horários encontrados", horarios.size());
        DateTimeFormatter horaFmt = DateTimeFormatter.ofPattern("HH:mm");

        for (MedicamentoHorario h : horarios) {
            try {

                var med = h.getMedicamento();
                if (med == null) {
                    logger.warn("⚠️ Horário id={} sem medicamento — ignorando", h.getId());
                    continue;
                }

                LocalDateTime horaPrevista = h.getHorarioComoDataHora();

                // Se ainda não passou da hora → não envia
                if (!agora.isAfter(horaPrevista)) {
                    continue;
                }

                // Carrega contatos de emergência (AGORA funciona por causa do @Transactional)
                var contatos = med.getContatosEmergencia();

                if (contatos == null || contatos.isEmpty()) {
                    logger.debug("ℹ️ Medicamento id={} não possui contatos de emergência — pulando", med.getId());
                    continue;
                }

                String nomeUsuario = med.getUsuario() != null ? med.getUsuario().getName() : "Usuário";
                String nomeMedicamento = med.getMedicamentoAnvisa() != null
                        ? med.getMedicamentoAnvisa().getNomeProduto()
                        : "medicamento";

                String horarioPrevisto = horaPrevista.format(horaFmt);

                String mensagem = String.format(
                        "⚠️ ALERTA: O usuário %s não tomou o medicamento %s às %s. Por favor verificar.",
                        nomeUsuario, nomeMedicamento, horarioPrevisto
                );

                boolean algumEnviado = false;

                for (var contato : contatos) {

                    String numeroBruto = contato.getTelefone();
                    if (numeroBruto == null || numeroBruto.trim().isEmpty()) {
                        logger.warn("Contato id={} sem telefone válido — ignorando", contato.getId());
                        continue;
                    }

                    // tratamento seguro
                    String digits = numeroBruto.replaceAll("\\D", "");
                    String telefoneFinal = digits.startsWith("55")
                            ? "+" + digits
                            : "+55" + digits;

                    try {
                        logger.info("📨 Enviando SMS → {} (contato id={}, horarioId={})",
                                telefoneFinal, contato.getId(), h.getId());

                        String sid = smsService.sendSms(telefoneFinal, mensagem);
                        logger.info("✅ SMS enviado com sucesso (sid={})", sid);

                        algumEnviado = true;

                    } catch (Exception ex) {
                        logger.error("❌ Erro ao enviar SMS para contato id={} ({}) — {}",
                                contato.getId(), numeroBruto, ex.getMessage());
                    }
                }

                if (algumEnviado) {
                    h.setNotificado(true);
                    horarioRepo.save(h);
                    logger.debug("✔️ Horário id={} marcado como notificado", h.getId());
                }

            } catch (Exception e) {
                logger.error("❌ Erro ao processar horario id={}: {}", h.getId(), e.getMessage(), e);
            }
        }
    }
}
