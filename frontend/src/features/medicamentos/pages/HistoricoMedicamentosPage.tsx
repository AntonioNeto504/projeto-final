// src/features/medicamentos/pages/HistoricoMedicamentosPage.tsx
import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, List, ListItem, ListItemText, Divider, Button, Stack } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { loadHistorico } from '../service/medicamentoService';
import { useNavigate } from 'react-router-dom';

const HIST_KEY = 'medmod:historico';

export default function HistoricoMedicamentosPage() {
  const navigate = useNavigate();
  const [hist, setHist] = useState<any[]>([]);

  useEffect(() => {
    const initial = loadHistorico();
    setHist(initial || []);
  }, []);

  // persiste no localStorage (tenta a chave padrão; se o serviço usar outra, manterá ao menos a UI atualizada)
  const persistHistorico = (list: any[]) => {
    try {
      localStorage.setItem(HIST_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  };

  const handleDeleteEntry = (id: string) => {
    if (!confirm('Deseja realmente apagar este registro do histórico?')) return;
    const newList = hist.filter((h) => h.id !== id);
    setHist(newList);
    persistHistorico(newList);
  };

  const handleClearAll = () => {
    if (!confirm('Deseja realmente apagar TODO o histórico de tomadas? Esta ação não pode ser desfeita.')) return;
    setHist([]);
    persistHistorico([]);
  };

  return (
    <Box sx={{ py: 4, px: 2, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ width: '100%', maxWidth: 980 }}>
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: 'primary.main' }}>
              Histórico
            </Typography>

            {/* Botões de navegação e ação (inclusive apagar todo o histórico) */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
              <Button
                variant="contained"
                startIcon={<HomeIcon />}
                onClick={() => navigate('/home')}
                sx={{ fontSize: 16, px: 2, minHeight: 48 }}
              >
                Página Inicial
              </Button>

              <Button
                variant="outlined"
                startIcon={<ListIcon />}
                onClick={() => navigate('/medicamentos/lista')}
                sx={{ fontSize: 16, px: 2, minHeight: 48 }}
              >
                Lista
              </Button>

              <Button
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
                onClick={() => navigate('/medicamentos/cadastro')}
                sx={{ fontSize: 16, px: 2, minHeight: 48 }}
              >
                Cadastrar
              </Button>

              {/* Botão para apagar todo o histórico (segue mesmo padrão visual) */}
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleClearAll}
                sx={{ fontSize: 16, px: 2, minHeight: 48 }}
              >
                Apagar Histórico
              </Button>
            </Stack>
          </Stack>

          {hist.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography sx={{ fontSize: 20, mb: 2 }}>Ainda não há registros</Typography>
              <Typography sx={{ fontSize: 16, color: 'text.secondary', mb: 3 }}>
                Quando você marcar um medicamento como tomado, o registro aparecerá aqui.
              </Typography>

              <Stack direction="row" spacing={2} justifyContent="center">
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/medicamentos/cadastro')} sx={{ fontSize: 16, px: 3 }}>
                  Cadastrar Medicamento
                </Button>

                <Button variant="outlined" startIcon={<ListIcon />} onClick={() => navigate('/medicamentos/lista')} sx={{ fontSize: 16, px: 3 }}>
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
