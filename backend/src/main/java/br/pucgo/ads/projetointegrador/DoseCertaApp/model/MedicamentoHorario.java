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
    private String horario; // Mantemos como STRING no banco ("08:00")

    @Column(name = "tomado_hoje")
    private Boolean tomadoHoje = false;

    @Column(name = "notificado")
    private Boolean notificado = false; // 🔥 NOVO: evita repetir SMS

    @Column(name = "data_ultima_atualizacao")
    private LocalDate dataUltimaAtualizacao;

    public MedicamentoHorario() {}

    public MedicamentoHorario(Medicamento medicamento, String horario) {
        this.medicamento = medicamento;
        this.horario = horario;
        this.tomadoHoje = false;
        this.notificado = false;
        this.dataUltimaAtualizacao = LocalDate.now();
    }

    // ============================
    // GETTERS E SETTERS
    // ============================
    public Long getId() { return id; }

    public Medicamento getMedicamento() { return medicamento; }
    public void setMedicamento(Medicamento medicamento) { this.medicamento = medicamento; }

    public String getHorario() { return horario; }
    public void setHorario(String horario) { this.horario = horario; }

    public Boolean getTomadoHoje() { return tomadoHoje; }
    public void setTomadoHoje(Boolean tomadoHoje) { this.tomadoHoje = tomadoHoje; }

    public Boolean getNotificado() { return notificado; }
    public void setNotificado(Boolean notificado) { this.notificado = notificado; }

    public LocalDate getDataUltimaAtualizacao() { return dataUltimaAtualizacao; }
    public void setDataUltimaAtualizacao(LocalDate dataUltimaAtualizacao) { this.dataUltimaAtualizacao = dataUltimaAtualizacao; }

    // ============================
    // CONVERTE STRING "08:00" → LocalDateTime HOJE
    // (necessário para calcular atraso)
    // ============================
    @JsonIgnore
    public LocalDateTime getHorarioComoDataHora() {
        LocalTime hora = LocalTime.parse(this.horario); // parse seguro
        return LocalDateTime.of(LocalDate.now(), hora);
    }

    // ============================
    // RESET AUTOMÁTICO AO VIRAR DIA
    // ============================
    public void resetarSeNovoDia() {
        if (dataUltimaAtualizacao == null ||
                !dataUltimaAtualizacao.equals(LocalDate.now())) {

            this.tomadoHoje = false;
            this.notificado = false; // permite novo alerta no dia seguinte
            this.dataUltimaAtualizacao = LocalDate.now();
        }
    }

    // ============================
    // CALLBACKS
    // ============================
    @PrePersist
    public void prePersist() {
        if (dataUltimaAtualizacao == null) {
            dataUltimaAtualizacao = LocalDate.now();
        }
        if (tomadoHoje == null) tomadoHoje = false;
        if (notificado == null) notificado = false;
    }

    @PreUpdate
    public void preUpdate() {
        dataUltimaAtualizacao = LocalDate.now();
    }
}
