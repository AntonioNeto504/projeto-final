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
  IconButton,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/History";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { useNavigate } from "react-router-dom";
import { medicamentoApi, type MedicamentoDTO } from "../api/medicamentoApi";
import { getUsuarioId } from "@/features/medicamentos/utils/session";

// DATA FORMATADA
const dataHojeUpper = new Date()
  .toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
  .toUpperCase();

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

      const filtrados = dados.filter(
        (m) => m.horarios && m.horarios.some((h) => !h.tomadoHoje)
      );

      setLista(filtrados);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const onTomar = async (horarioId: number) => {
    if (!confirm("Confirmar a tomada?")) return;
    try {
      await medicamentoApi.registrarTomada(horarioId);
      await carregar();
    } catch {
      alert("Erro ao registrar tomada.");
    }
  };

  // CORES DA TARJA
  const tarjaColor: Record<string, string> = {
    PRETA: "#000",
    VERMELHA: "#DB0012",
    AMARELA: "#DBC100",
    SEM_TARJA: "#1565C0",
  };

  return (
    <Box sx={{ py: 4, px: 2, display: "flex", justifyContent: "center" }}>
      <Card sx={{ width: "100%", maxWidth: 860, borderRadius: 2, boxShadow: 4 }}>
        <CardContent>
          {/* HEADER */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "primary.main",
                  lineHeight: 1.2,
                }}
              >
                MEDICAMENTOS EM USO
              </Typography>

              <Typography
                sx={{
                  fontSize: 16,
                  color: "#444",
                  mt: 0.5,
                  textTransform: "capitalize",
                }}
              >
                {dataHojeUpper}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={<HomeIcon />}
                onClick={() => navigate("/home")}
                sx={{ fontSize: 16, px: 2, borderRadius: 2 }}
              >
                Home
              </Button>

              <Button
                variant="outlined"
                startIcon={<HistoryIcon />}
                onClick={() => navigate("/medicamentos/historico")}
                sx={{ fontSize: 16, px: 2, borderRadius: 2 }}
              >
                Histórico
              </Button>

              <Button
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
                onClick={() => navigate("/medicamentos/cadastro")}
                sx={{ fontSize: 16, px: 2, borderRadius: 2 }}
              >
                Cadastrar
              </Button>
            </Stack>
          </Stack>

          {/* LISTAGEM */}
          {lista.length === 0 ? (
            <Typography sx={{ textAlign: "center", py: 5, fontSize: 18 }}>
              Nenhum medicamento para hoje ✨
            </Typography>
          ) : (
            <Stack spacing={2}>
              {lista.map((m) => (
                <Box
                  key={m.id}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#f9f9f9",
                    boxShadow: 1,
                  }}
                >
                  {/* TÍTULO + TARJA + EDITAR/REMOVER */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
                      {m.nome}
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={m.tarja === "SEM_TARJA" ? "COMUM" : m.tarja}
                        size="small"
                        sx={{
                          bgcolor: tarjaColor[m.tarja],
                          color: "white",
                          fontWeight: 600,
                        }}
                      />

                      {/* EDITAR */}
                      <IconButton
                        onClick={() =>
                          navigate(`/medicamentos/editar/${m.id}`)
                        }
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>

                      {/* REMOVER */}
                      <IconButton
                        onClick={() => {
                          if (
                            confirm(
                              "Deseja realmente remover este medicamento?"
                            )
                          ) {
                            medicamentoApi.excluir(m.id)
                              .then(() => carregar())
                              .catch(() =>
                                alert("Erro ao remover medicamento.")
                              );
                          }
                        }}
                      >
                        <DeleteIcon color="error" fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Stack>

                  <Divider sx={{ my: 1 }} />

                  {/* HORÁRIOS */}
                  <Stack spacing={1}>
                    {m.horarios.map((h) => (
                      <Stack
                        key={h.id}
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography sx={{ fontSize: 18 }}>
                          ⏰ {h.horario}
                        </Typography>

                        {h.tomadoHoje ? (
                          <Chip label="Tomado" color="success" size="small" />
                        ) : (
                          <Button
                            variant="outlined"
                            startIcon={<CheckCircleOutlineIcon />}
                            onClick={() => onTomar(h.id)}
                            sx={{
                              fontSize: 14,
                              px: 2,
                              py: 0.5,
                              borderRadius: 2,
                            }}
                          >
                            Tomar
                          </Button>
                        )}
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
