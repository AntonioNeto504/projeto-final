import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  FormControl,
  MenuItem,
  Select,
  Autocomplete,
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";
import { medicamentoApi } from "../api/medicamentoApi";
import { anvisaApi } from "../api/anvisaApi";

export default function EditarMedicamentoPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>(null);
  const [listaAnvisa, setListaAnvisa] = useState<any[]>([]);

  // 🔹 Carrega lista ANVISA
  useEffect(() => {
    anvisaApi.listar().then(setListaAnvisa);
  }, []);

  // 🔹 Carregar medicamento
  useEffect(() => {
    medicamentoApi
      .buscarPorId(Number(id))
      .then((data) => {
        const nomeLimpo = data.nome?.replace(/"/g, "").trim();

        setForm({
          id: data.id,
          nome: nomeLimpo,
          anvisaId: data.anvisaId,  // ← usa o ID da api
          tarja: data.tarja ?? "SEM_TARJA",

          horarios: (data.horarios ?? []).map((h: any) => ({
            id: h.id,
            horario: h.horario,
          })),

          // campos exigidos no update
          tipoDosagem: "mg",
          doseDiaria: 1,
          quantidadeCartela: 1,
          totalFrasco: null,
          contatosEmergenciaIds: [],
        });

        setLoading(false);
      })
      .catch(() => {
        alert("Erro ao carregar medicamento.");
        navigate("/medicamentos/lista");
      });
  }, [id]);

  const atualizar = async () => {
    try {
      const payload = {
        tipoDosagem: form.tipoDosagem,
        doseDiaria: form.doseDiaria,
        quantidadeCartela: form.quantidadeCartela,
        totalFrasco: form.totalFrasco,
        tarja: form.tarja,
        anvisaId: form.anvisaId,
        contatosEmergenciaIds: form.contatosEmergenciaIds,
        horarios: form.horarios.map((h: any) => ({ horario: h.horario })),
      };

      await medicamentoApi.atualizar(form.id, payload);
      alert("Medicamento atualizado com sucesso!");
      navigate("/medicamentos/lista");
    } catch (err) {
      alert("Erro ao atualizar medicamento.");
    }
  };

  if (loading || !form) {
    return (
      <Typography sx={{ textAlign: "center", py: 5, fontSize: 20 }}>
        Carregando...
      </Typography>
    );
  }

  const medicamentoSelecionado =
    listaAnvisa.find((m) => m.id === form.anvisaId) || null;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 4, px: 2 }}>
      <Card sx={{ width: "100%", maxWidth: 750, borderRadius: 2, boxShadow: 4 }}>
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <Typography sx={{ fontSize: 26, fontWeight: 700, mb: 2 }}>
            Editar Medicamento
          </Typography>

          <Stack spacing={3}>
            {/* 🔹 AUTOCOMPLETE – NOME VINDO DA ANVISA */}
            <Autocomplete
              options={listaAnvisa}
              value={medicamentoSelecionado}
              getOptionLabel={(opt: any) => opt.nomeProduto}
              onChange={(_, selected) => {
                if (selected) {
                  setForm({
                    ...form,
                    nome: selected.nomeProduto,
                    anvisaId: selected.id,
                  });
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="Medicamento (ANVISA)" fullWidth />
              )}
            />

            {/* TARJA */}
            <FormControl fullWidth>
              <Select
                value={form.tarja}
                onChange={(e) => setForm({ ...form, tarja: e.target.value })}
              >
                <MenuItem value="SEM_TARJA">Comum</MenuItem>
                <MenuItem value="AMARELA">Amarela</MenuItem>
                <MenuItem value="VERMELHA">Vermelha</MenuItem>
                <MenuItem value="PRETA">Preta</MenuItem>
              </Select>
            </FormControl>

            <Divider />

            <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
              Horários
            </Typography>

            {form.horarios?.map((h: any, idx: number) => (
              <TextField
                key={idx}
                type="time"
                label={`Horário ${idx + 1}`}
                value={h.horario}
                onChange={(e) => {
                  const updated = [...form.horarios];
                  updated[idx].horario = e.target.value;
                  setForm({ ...form, horarios: updated });
                }}
                fullWidth
              />
            ))}

            <Divider />

            {/* BOTÕES */}
            <Stack direction="row" justifyContent="space-between">
              <Button variant="outlined" onClick={() => navigate("/medicamentos/lista")}>
                Cancelar
              </Button>

              <Button variant="contained" onClick={atualizar}>
                Salvar alterações
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
