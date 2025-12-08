package br.pucgo.ads.projetointegrador.DoseCertaApp.service;



import br.pucgo.ads.projetointegrador.DoseCertaApp.model.ContatoEmergencia;
import br.pucgo.ads.projetointegrador.DoseCertaApp.repository.ContatoEmergenciaRepository;
import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import br.pucgo.ads.projetointegrador.plataforma.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ContatoEmergenciaService {

    private final ContatoEmergenciaRepository repository;
    private final UserRepository usuarioRepository;

    public ContatoEmergenciaService(ContatoEmergenciaRepository repository,
                                    UserRepository usuarioRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
    }

    // Lista todos os contatos de um usuário
    public List<ContatoEmergencia> listarPorUsuario(Long usuarioId) {
        return repository.findByUsuarioId(usuarioId);
    }

    // Busca contato por ID
    public ContatoEmergencia buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Contato não encontrado!"));
    }

    // Cria um novo contato
    @Transactional
    public ContatoEmergencia criar(Long usuarioId, String nome, String telefone, String relacao) {
        User usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado!"));

        // Evita duplicidade de telefone para o mesmo usuário
        boolean existeTelefone = repository.existsByUsuarioIdAndTelefone(usuarioId, telefone);
        if (existeTelefone) {
            throw new IllegalArgumentException("Já existe um contato com este telefone para o usuário.");
        }

        ContatoEmergencia contato = new ContatoEmergencia();
        contato.setUsuario(usuario);       // ✅ Referência ao usuário
        contato.setNome(nome);             // Nome do contato
        contato.setTelefone(telefone);     // Telefone
        contato.setRelacao(relacao);       // Relação (ex.: mãe, amigo)

        return repository.save(contato);
    }

    // Exclui contato
    @Transactional
    public void excluir(Long id) {
        ContatoEmergencia contato = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Contato não encontrado!"));
        repository.delete(contato);
    }

    // Atualiza contato
    @Transactional
    public ContatoEmergencia atualizar(Long id, String nome, String telefone, String relacao) {
        ContatoEmergencia contato = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Contato não encontrado!"));

        contato.setNome(nome);
        contato.setTelefone(telefone);
        contato.setRelacao(relacao);

        return repository.save(contato);
    }
}
