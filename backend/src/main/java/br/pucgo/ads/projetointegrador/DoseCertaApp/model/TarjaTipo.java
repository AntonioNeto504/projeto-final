package br.pucgo.ads.projetointegrador.DoseCertaApp.model;

public enum TarjaTipo {
    SEM_TARJA,
    AMARELA,
    VERMELHA,
    PRETA;

    @Override
    public String toString() {
        return name(); // retorna exatamente o nome do enum
    }
}
