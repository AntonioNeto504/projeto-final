package br.pucgo.ads.projetointegrador.DoseCertaApp.dto;

import br.pucgo.ads.projetointegrador.DoseCertaApp.model.MedicamentoHorario;
import br.pucgo.ads.projetointegrador.DoseCertaApp.model.RegistroTomada;

public class MedicamentoHorarioDTO {

    private Long id;
    private String horario;
    private Boolean tomadoHoje;
    private RegistroTomadaDTO registroTomada;

    public MedicamentoHorarioDTO(MedicamentoHorario horarioEntity, RegistroTomada registro) {
        this.id = horarioEntity.getId();
        this.horario = horarioEntity.getHorario();
        this.tomadoHoje = horarioEntity.getTomadoHoje(); // CORRETO
        this.registroTomada = registro != null ? new RegistroTomadaDTO(registro) : null;
    }

    public Long getId() { return id; }
    public String getHorario() { return horario; }
    public Boolean getTomadoHoje() { return tomadoHoje; }
    public RegistroTomadaDTO getRegistroTomada() { return registroTomada; }
}
