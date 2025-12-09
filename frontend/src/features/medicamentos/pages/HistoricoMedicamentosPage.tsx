// src/features/medicamentos/pages/HistoricoMedicamentosPage.tsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
  Button,
  Chip,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import ListIcon from "@mui/icons-material/List";

import { useNavigate } from "react-router-dom";
import { medicamentoApi } from "../api/medicamentoApi";
import { getUsuarioId } from "@/features/medicamentos/utils/session";

interface HistoricoItem {
  id: number;
  medicamentoNome: string;
  horarioPrevisto: string;
  horarioRealTomado: string;
  dataPrevista: string;
}

export default function HistoricoMedicamentosPage() {
  const navigate = useNavigate();
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);

  const usuarioId = getUsuarioId();

  const carregar = async () => {
    if (!usuarioId) return;

    // Agora busca o histórico REAL da tabela registros_tomada
    const registros = await medicamentoApi.listarHistorico(usuarioId);

    const eventos = registros
  .filter((r) => r.horarioRealTomado) // já vem só os tomados do backend
  .map((r) => ({
    id: r.id,
    medicamentoNome: r.medicamentoNome,
    horarioPrevisto: r.horarioPrevisto,
    horarioRealTomado: r.horarioRealTomado,
    dataPrevista: r.dataPrevista,
  }))
  .sort((a, b) => {
    const dt1 = new Date(`${a.dataPrevista}T${a.horarioRealTomado}`);
    const dt2 = new Date(`${b.dataPrevista}T${b.horarioRealTomado}`);
    return dt2.getTime() - dt1.getTime();
  });


    setHistorico(eventos);
  };

  useEffect(() => {
    carregar();
  }, []);

  return (
    <Box sx={{ py: 4, px: 2, display: "flex", justifyContent: "center" }}>
      <Card sx={{ width: "100%", maxWidth: 900, borderRadius: 3 }}>
        <CardContent>
          {/* HEADER */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography
              variant="h5"
              sx={{
                fontSize: 24,
                fontWeight: 700,
                color: "primary.main",
              }}
            >
              Histórico de Tomadas
            </Typography>

            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={<HomeIcon />}
                onClick={() => navigate('/home')}
                sx={{ fontSize: 16, padding: "8px 12px", fontWeight: "normal" }}
                onClick={() => navigate("/home")}
              >
                Home
              </Button>

              <Button
                variant="outlined"
                startIcon={<ListIcon />}
                onClick={() => navigate("/medicamentos/lista")}
                onClick={() => navigate('/medicamentos/lista')}
                sx={{ fontSize: 16, padding: "8px 12px", fontWeight: "normal" }}
              >
                Lista
              </Button>

              <Button
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
                onClick={() => navigate('/medicamentos/cadastro')}
                sx={{ fontSize: 16, padding: "8px 12px", fontWeight: "normal" }}
              >
                Cadastrar
              </Button>

              {/* Botão para apagar todo o histórico (segue mesmo padrão visual) */}
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleClearAll}
                sx={{ fontSize: 16, padding: "8px 12px", fontWeight: "normal" }}
              >
                Apagar Histórico
              </Button>
            </Stack>
          </Stack>

          {/* LISTAGEM */}
          {historico.length === 0 ? (
            <Typography
              sx={{
                textAlign: "center",
                fontSize: 18,
                color: "text.secondary",
                py: 5,
              }}
            >
              Nenhum medicamento tomado registrado ✨
            </Typography>
          ) : (
            <Stack spacing={3}>
              {historico.map((h) => {

                return (
                  <Box key={h.id} sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
                        {h.medicamentoNome}
                      </Typography>

                      <Chip label="Tomado" color="success" />
                    </Stack>

                    <Divider sx={{ my: 1 }} />

                    <Typography sx={{ fontSize: 16 }}>
                      ⏰ Horário previsto: <strong>{h.horarioPrevisto}</strong>
                    </Typography>

                    <Typography sx={{ fontSize: 16, color: "text.secondary" }}>
                      ✔ Tomado em:{" "}
                      <strong>
                        {h.dataPrevista} às {h.horarioRealTomado}
                      </strong>
                    </Typography>
                  </Box>
                );
              })}
            </Stack>
          {hist.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography sx={{ fontSize: 20, mb: 2 }}>Ainda não há registros</Typography>
              <Typography sx={{ fontSize: 16, color: 'text.secondary', mb: 3 }}>
                Quando você marcar um medicamento como tomado, o registro aparecerá aqui.
              </Typography>

              <Stack direction="row" spacing={2} justifyContent="center">
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/medicamentos/cadastro')} sx={{ fontSize: 16, padding: "8px 12px", fontWeight: "normal" }}
                >
                  Cadastrar Medicamento
                </Button>

                <Button variant="outlined" startIcon={<ListIcon />} onClick={() => navigate('/medicamentos/lista')} sx={{ fontSize: 16, padding: "8px 12px", fontWeight: "normal" }}
                >
                  Ver Lista
                </Button>
              </Stack>
            </Box>
          ) : (
            <List>
              {hist.map((h) => (
                <React.Fragment key={h.id}>
                  <ListItem sx={{ py: 2 }}>
                    {/* Conteúdo principal */}
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <ListItemText
                          primary={<Typography sx={{ fontSize: 18, fontWeight: 700 }}>{h.nome}</Typography>}
                          secondary={
                            <Typography sx={{ fontSize: 16, color: 'text.secondary' }}>
                              Tomado: <strong>{h.amountTaken}{h.tipo === 'liquido' ? ' ml' : ' unidade(s)'}</strong>
                              {typeof h.horarioIndex === 'number' ? ` — Horário ${h.horarioIndex + 1}` : ''}
                              {' — '}
                              {new Date(h.takenAt).toLocaleString()}
                            </Typography>
                          }
                        />
                      </Box>

                      {/* Botão de apagar por item (segue padrão dos outros botões) */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteEntry(h.id)}
                          sx={{ fontSize: 16, px: 2, minHeight: 48 }}
                        >
                          Apagar
                        </Button>
                      </Box>
                    </Box>
                  </ListItem>

                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
