// src/features/medicamentos/pages/ListaMedicamentosPage.tsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
  Chip,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/History";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { useNavigate } from "react-router-dom";
import { medicamentoApi, type MedicamentoDTO } from "../api/medicamentoApi";
import { getUsuarioId } from "@/features/medicamentos/utils/session";

export default function ListaMedicamentosPage() {
  const navigate = useNavigate();
  const [lista, setLista] = useState<MedicamentoDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const usuarioId = getUsuarioId();

  const carregar = async () => {
    if (!usuarioId) return;

    setLoading(true);
    try {
      const dados = await medicamentoApi.listarPorUsuario(usuarioId);
      setLista(dados);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const onTomar = async (horarioId: number) => {
    if (!confirm("Confirmar que tomou este medicamento agora?")) return;

    try {
      await medicamentoApi.registrarTomada(horarioId);
      await carregar(); // recarrega lista com tomadoHoje atualizado
    } catch {
      alert("Erro ao registrar tomada.");
    }
  };

  return (
    <Box sx={{ py: 4, px: 2, display: "flex", justifyContent: "center" }}>
      <Card sx={{ width: "100%", maxWidth: 900, borderRadius: 3 }}>
        <CardContent>
          {/* HEADER */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" sx={{ fontSize: 24, fontWeight: 700, color: "primary.main" }}>
              Medicamentos em Uso
            </Typography>

            <Stack direction="row" spacing={1}>
              <Button variant="contained" startIcon={<HomeIcon />} onClick={() => navigate("/home")}>
                Home
              </Button>

              <Button variant="outlined" startIcon={<HistoryIcon />} onClick={() => navigate("/medicamentos/historico")}>
                Histórico
              </Button>

              <Button variant="contained" color="success" startIcon={<AddIcon />}
                onClick={() => navigate("/medicamentos/cadastro")}>
                Cadastrar
              </Button>
            </Stack>
          </Stack>

          {/* LISTAGEM */}
          {lista.length === 0 ? (
            <Typography sx={{ textAlign: "center", fontSize: 18, color: "text.secondary", py: 5 }}>
              Nenhum medicamento ativo para hoje ✨
            </Typography>
          ) : (
            <Stack spacing={3}>
              {lista.map((m) => (
                <Box key={m.id} sx={{ p: 2, borderRadius: 2 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography sx={{ fontSize: 20, fontWeight: 700 }}>{m.nome}</Typography>
                    <Chip label={m.tarja} color="primary" size="small" />
                  </Stack>

                  <Divider sx={{ my: 1 }} />

                  {/* LISTA DE HORÁRIOS */}
                  <Stack spacing={1}>
                    {m.horarios.map((h) => (
                      <Stack key={h.id} direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1 }}>
                        <Typography sx={{ fontSize: 18 }}>⏰ {h.horario}</Typography>

                        {h.tomadoHoje ? (
                          <Chip
                            label="Tomado"
                            color="success"
                            icon={<CheckCircleOutlineIcon />}
                            sx={{ px: 2 }}
                          />
                        ) : (
                          <Button
                            variant="outlined"
                            startIcon={<CheckCircleOutlineIcon />}
                            onClick={() => onTomar(h.id)}
                          >
                            Tomar
                          </Button>
                        )}
                      </Stack>
                    ))}
                  </Stack>

                  <Divider sx={{ mt: 2 }} />
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
