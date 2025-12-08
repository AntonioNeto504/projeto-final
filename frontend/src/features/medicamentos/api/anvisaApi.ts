import http from '@/lib/http';

export interface MedicamentoAnvisaDto {
  id: number;
  nomeProduto: string;
}

export const anvisaApi = {
  listar: async (): Promise<MedicamentoAnvisaDto[]> => {
    const { data } = await http.get<MedicamentoAnvisaDto[]>('/medicamentos/anvisa');
    return Array.isArray(data) ? data : [];
  },
};
