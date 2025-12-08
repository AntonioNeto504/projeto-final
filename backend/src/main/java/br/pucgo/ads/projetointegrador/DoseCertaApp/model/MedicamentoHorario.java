package br.pucgo.ads.projetointegrador.DoseCertaApp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "medicamento_horarios")
public class MedicamentoHorario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "medicamento_id")
    @JsonIgnore
    private Medicamento medicamento;

    private String horario; // por exemplo: "08:00"
    private Boolean tomadoHoje = false;
    private LocalDate dataUltimaAtualizacao;

    // ===== Getters e Setters =====
    public Long getId() { return id; }
    public Medicamento getMedicamento() { return medicamento; }
    public void setMedicamento(Medicamento medicamento) { this.medicamento = medicamento; }
    public String getHorario() { return horario; }
    public void setHorario(String horario) { this.horario = horario; }
    public Boolean getTomadoHoje() { return tomadoHoje; }
    public void setTomadoHoje(Boolean tomadoHoje) { this.tomadoHoje = tomadoHoje; }
    public LocalDate getDataUltimaAtualizacao() { return dataUltimaAtualizacao; }
    public void setDataUltimaAtualizacao(LocalDate dataUltimaAtualizacao) { this.dataUltimaAtualizacao = dataUltimaAtualizacao; }

    // ===== Método para resetar se for novo dia =====
    public void resetarSeNovoDia() {
        if (dataUltimaAtualizacao == null || !dataUltimaAtualizacao.equals(LocalDate.now())) {
            this.tomadoHoje = false;
            this.dataUltimaAtualizacao = LocalDate.now();
        }
    }
}
