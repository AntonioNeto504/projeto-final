import http from "@/lib/http";

export interface CreateMedicamentoPayload {
  totalFrasco?: number;
  quantidadeCartela?: number;
  doseDiaria: number;
  tipoDosagem: string;   // <<< AQUI ESTÁ A CORREÇÃO
  tarja: string;
  horarios: { hora: string }[];
}


export const medicamentosApi = {
  criar: async (
    usuarioId: number,
    anvisaId: number,
    payload: CreateMedicamentoPayload
  ) => {
    const { data } = await http.post(
      `/api/medicamentos?usuarioId=${usuarioId}&anvisaId=${anvisaId}`,
      payload
    );
    return data;
  },
};
