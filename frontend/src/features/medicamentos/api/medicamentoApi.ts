import http from "@/lib/http";

export interface MedicamentoHorarioDTO {
  id: number;
  horario: string;
  tomado: boolean;
  tomadoEm?: string | null;
}

export interface MedicamentoDTO {
  id: number;
  nome: string;
  tarja: string;
  horarios: MedicamentoHorarioDTO[];
}

export const medicamentoApi = {
  async listarPorUsuario(usuarioId: number): Promise<MedicamentoDTO[]> {
    const response = await http.get(`/api/medicamentos/usuario/${usuarioId}/detalhes`);
    return response.data;
  },

    listarHistorico: async (usuarioId: number) => {
    const resp = await http.get(`/api/registro-tomada/usuario/${usuarioId}`);
    return resp.data;
    },



  async registrarTomada(horarioId: number): Promise<any> {
    return http.post(`/api/registro-tomada?horarioId=${horarioId}`);
  }
};
