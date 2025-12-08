package br.pucgo.ads.projetointegrador.DoseCertaApp.dto;

import br.pucgo.ads.projetointegrador.DoseCertaApp.model.TarjaTipo;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class MedicamentoCreateDTO {

    @NotNull
    private Long usuarioId;

    private String nome;
    private String dosagemTipo;
    private Double dosagemValor;
    private Integer quantidadePorDose;

    private LocalDate dataInicio;
    private LocalDate dataFim;

    private TarjaTipo tarja;          // <<--- ALTERADO
    private Boolean urgencia;
    private Boolean avisarContato;
    private Long contatoEmergenciaId;

    private List<HorarioDTO> horarios;

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDosagemTipo() { return dosagemTipo; }
    public void setDosagemTipo(String dosagemTipo) { this.dosagemTipo = dosagemTipo; }

    public Double getDosagemValor() { return dosagemValor; }
    public void setDosagemValor(Double dosagemValor) { this.dosagemValor = dosagemValor; }

    public Integer getQuantidadePorDose() { return quantidadePorDose; }
    public void setQuantidadePorDose(Integer quantidadePorDose) { this.quantidadePorDose = quantidadePorDose; }

    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }

    public LocalDate getDataFim() { return dataFim; }
    public void setDataFim(LocalDate dataFim) { this.dataFim = dataFim; }

    public TarjaTipo getTarja() { return tarja; }             // <<--- NOVO
    public void setTarja(TarjaTipo tarja) { this.tarja = tarja; }

    public Boolean getUrgencia() { return urgencia; }
    public void setUrgencia(Boolean urgencia) { this.urgencia = urgencia; }

    public Boolean getAvisarContato() { return avisarContato; }
    public void setAvisarContato(Boolean avisarContato) { this.avisarContato = avisarContato; }

    public Long getContatoEmergenciaId() { return contatoEmergenciaId; }
    public void setContatoEmergenciaId(Long contatoEmergenciaId) { this.contatoEmergenciaId = contatoEmergenciaId; }

    public List<HorarioDTO> getHorarios() { return horarios; }
    public void setHorarios(List<HorarioDTO> horarios) { this.horarios = horarios; }
}
