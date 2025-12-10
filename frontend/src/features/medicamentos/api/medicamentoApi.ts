import http from "@/lib/http";

export interface MedicamentoHorarioDTO {
  id: number;
  horario: string;
  tomado: boolean;
  tomadoHoje?: boolean;
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
    const response = await http.get(
      `/api/medicamentos/usuario/${usuarioId}/detalhes`
    );
    return response.data;
  },

  async listarHistorico(usuarioId: number) {
    const resp = await http.get(`/api/registro-tomada/usuario/${usuarioId}`);
    return resp.data;
  },

  async registrarTomada(horarioId: number) {
    return http.post(`/api/registro-tomada?horarioId=${horarioId}`);
  },

  async buscarPorId(id: number) {
    const resp = await http.get(`/api/medicamentos/${id}`);
    return resp.data;
  },

  async atualizar(id: number, payload: any) {
    const resp = await http.put(`/api/medicamentos/${id}`, payload);
    return resp.data;
  },

  async excluir(id: number) {
    return http.delete(`/api/medicamentos/${id}`);
  },

  async criar(payload: any, anvisaId: number) {
    const { data } = await http.post(
      `/api/medicamentos?anvisaId=${anvisaId}`,
      payload
    );
    return data;
  },

  // 🧹 APAGAR TODO HISTÓRICO DO USUÁRIO
  async limparHistorico(usuarioId: number) {
    return http.delete(`/api/registro-tomada/usuario/${usuarioId}`);
  },
};
