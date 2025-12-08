package br.pucgo.ads.projetointegrador.DoseCertaApp.dto;



import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;

public class HorarioDTO {
    @NotBlank
    // format "HH:mm"
    private String hora;

    public HorarioDTO() {}
    public HorarioDTO(String hora) { this.hora = hora; }

    public String getHora() { return hora; }
    public void setHora(String hora) { this.hora = hora; }
}
