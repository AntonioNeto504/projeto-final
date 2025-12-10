package br.pucgo.ads.projetointegrador.DoseCertaApp.dto;

import br.pucgo.ads.projetointegrador.DoseCertaApp.model.TarjaTipo;
import java.util.List;

public class MedicamentoUpdateDTO {

    private String tipoDosagem;        // "mg" ou "ml"
    private Integer doseDiaria;        // quantidade por dose

    private Integer quantidadeCartela; // comprimidos (para sólido)
    private Double totalFrasco;        // ml (para líquido)

    private TarjaTipo tarja;           // PRETA / VERMELHA / AMARELA / SEM_TARJA

    private Long anvisaId;             // novo ID da ANVISA (se alterar o medicamento)

    private List<Long> contatosEmergenciaIds; // múltiplos contatos

    private List<HorarioDTO> horarios; // [{ "id":1, "horario":"08:00" }]

    // ===================
    // GETTERS E SETTERS
    // ===================

    public String getTipoDosagem() {
        return tipoDosagem;
    }

    public void setTipoDosagem(String tipoDosagem) {
        this.tipoDosagem = tipoDosagem;
    }

    public Integer getDoseDiaria() {
        return doseDiaria;
    }

    public void setDoseDiaria(Integer doseDiaria) {
        this.doseDiaria = doseDiaria;
    }

    public Integer getQuantidadeCartela() {
        return quantidadeCartela;
    }

    public void setQuantidadeCartela(Integer quantidadeCartela) {
        this.quantidadeCartela = quantidadeCartela;
    }

    public Double getTotalFrasco() {
        return totalFrasco;
    }

    public void setTotalFrasco(Double totalFrasco) {
        this.totalFrasco = totalFrasco;
    }

    public TarjaTipo getTarja() {
        return tarja;
    }

    public void setTarja(TarjaTipo tarja) {
        this.tarja = tarja;
    }

    public Long getAnvisaId() {
        return anvisaId;
    }

    public void setAnvisaId(Long anvisaId) {
        this.anvisaId = anvisaId;
    }

    public List<Long> getContatosEmergenciaIds() {
        return contatosEmergenciaIds;
    }

    public void setContatosEmergenciaIds(List<Long> contatosEmergenciaIds) {
        this.contatosEmergenciaIds = contatosEmergenciaIds;
    }

    public List<HorarioDTO> getHorarios() {
        return horarios;
    }

    public void setHorarios(List<HorarioDTO> horarios) {
        this.horarios = horarios;
    }
}
