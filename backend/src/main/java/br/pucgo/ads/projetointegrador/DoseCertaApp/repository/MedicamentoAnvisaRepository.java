package br.pucgo.ads.projetointegrador.DoseCertaApp.repository;


import br.pucgo.ads.projetointegrador.DoseCertaApp.model.MedicamentoAnvisa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicamentoAnvisaRepository extends JpaRepository<MedicamentoAnvisa, Long> {

    List<MedicamentoAnvisa> findByNomeProdutoContainingIgnoreCase(String nome);

    List<MedicamentoAnvisa> findByPrincipioAtivoContainingIgnoreCase(String principio);

    List<MedicamentoAnvisa> findByNumeroRegistroProduto(String numeroRegistroProduto);

    boolean existsByNumeroRegistroProduto(String numeroRegistroProduto);
}
