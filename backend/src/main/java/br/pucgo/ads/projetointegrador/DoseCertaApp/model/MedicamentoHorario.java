package br.pucgo.ads.projetointegrador.DoseCertaApp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "medicamento_horarios")
public class MedicamentoHorario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "medicamento_id", nullable = false)
    @JsonIgnore
    private Medicamento medicamento;

    @Column(name = "horario", nullable = false)
    private String horario;

    @Column(name = "tomado_hoje")
    private Boolean tomadoHoje = false;

    @Column(name = "notificado")
    private Boolean notificado = false;

    @Column(name = "data_ultima_atualizacao")
    private LocalDate dataUltimaAtualizacao;

    @Column(name = "proxima_execucao")
    private LocalDateTime proximaExecucao;

    public MedicamentoHorario() {}

    public MedicamentoHorario(Medicamento medicamento, String horario) {
        this.medicamento = medicamento;
        this.horario = horario;
        this.tomadoHoje = false;
        this.notificado = false;
        this.dataUltimaAtualizacao = LocalDate.now();

        calcularProximaExecucao(); // 🔥 OBRIGATÓRIO
    }

    // ============================
    // GETTERS / SETTERS
    // ============================
    public Long getId() { return id; }

    public Medicamento getMedicamento() { return medicamento; }
    public void setMedicamento(Medicamento medicamento) { this.medicamento = medicamento; }

    public String getHorario() { return horario; }
    public void setHorario(String horario) {
        this.horario = horario;
        calcularProximaExecucao(); // 🔥 recalcula sempre que editar horário
    }

    public Boolean getTomadoHoje() { return tomadoHoje; }
    public void setTomadoHoje(Boolean tomadoHoje) { this.tomadoHoje = tomadoHoje; }

    public Boolean getNotificado() { return notificado; }
    public void setNotificado(Boolean notificado) { this.notificado = notificado; }

    public LocalDate getDataUltimaAtualizacao() { return dataUltimaAtualizacao; }
    public void setDataUltimaAtualizacao(LocalDate dataUltimaAtualizacao) { this.dataUltimaAtualizacao = dataUltimaAtualizacao; }

    public LocalDateTime getProximaExecucao() { return proximaExecucao; }
    public void setProximaExecucao(LocalDateTime proximaExecucao) { this.proximaExecucao = proximaExecucao; }

    // =========================================================
    // Converte "08:00" → LocalDateTime de hoje
    // =========================================================
    @JsonIgnore
    public LocalDateTime getHorarioComoDataHora() {
        LocalTime hora = LocalTime.parse(this.horario);
        return LocalDateTime.of(LocalDate.now(), hora);
    }

    // =========================================================
    // Cálculo correto do próximo horário
    // =========================================================
    public void calcularProximaExecucao() {
        LocalTime hora = LocalTime.parse(this.horario);
        LocalDate hoje = LocalDate.now();
        LocalDateTime horarioHoje = LocalDateTime.of(hoje, hora);

        // Se horário ainda não passou hoje → HOJE
        if (horarioHoje.isAfter(LocalDateTime.now())) {
            this.proximaExecucao = horarioHoje;
        }
        // Se já passou → AMANHÃ
        else {
            this.proximaExecucao = horarioHoje.plusDays(1);
        }
    }

    // =========================================================
    // Reset diário
    // =========================================================
    public void resetarSeNovoDia() {
        if (dataUltimaAtualizacao == null ||
                !dataUltimaAtualizacao.equals(LocalDate.now())) {

            this.tomadoHoje = false;

            // 🔥 Se mudou o dia, a notificação deve ser liberada novamente
            this.notificado = false;

            this.dataUltimaAtualizacao = LocalDate.now();
            calcularProximaExecucao(); // recalcula para o novo dia
        }
    }

    // =========================================================
    // Callbacks JPA
    // =========================================================
    @PrePersist
    public void prePersist() {
        if (dataUltimaAtualizacao == null) {
            dataUltimaAtualizacao = LocalDate.now();
        }
        if (tomadoHoje == null) tomadoHoje = false;

        calcularProximaExecucao(); // 🔥 sempre calcular antes de salvar

        // =========================================================
        // 🔥🔥 AJUSTE FUNDAMENTAL PARA NÃO ENVIAR SMS INDEVIDO 🔥🔥
        // Se a próxima execução NÃO for hoje → já marca como notificado
        // para evitar SMS no dia errado
        // =========================================================
        if (notificado == null) {
            if (proximaExecucao != null &&
                    !proximaExecucao.toLocalDate().isEqual(LocalDate.now())) {

                // Próxima execução é amanhã ou outro dia → NÃO avisar hoje
                this.notificado = true;
            } else {
                this.notificado = false;
            }
        }
    }

    @PreUpdate
    public void preUpdate() {
        dataUltimaAtualizacao = LocalDate.now();
    }
}
