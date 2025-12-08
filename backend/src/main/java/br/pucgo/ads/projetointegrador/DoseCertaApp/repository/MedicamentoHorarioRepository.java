package br.pucgo.ads.projetointegrador.DoseCertaApp.repository;


import br.pucgo.ads.projetointegrador.DoseCertaApp.model.MedicamentoHorario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicamentoHorarioRepository extends JpaRepository<MedicamentoHorario, Long> {

    // Lista os horários de um medicamento específico em ordem crescente pelo campo "horario"
    List<MedicamentoHorario> findByMedicamentoIdOrderByHorarioAsc(Long medicamentoId);

}
