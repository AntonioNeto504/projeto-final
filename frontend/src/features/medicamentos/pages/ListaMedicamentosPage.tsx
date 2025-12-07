// src/features/medicamentos/pages/ListaMedicamentosPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate } from 'react-router-dom';
import { loadMedicamentos, registrarTomada, loadHistorico } from '../service/medicamentoService';
import type { Medicamento } from '../service/medicamentoService';

const STORAGE_KEY = 'medmod:medicamentos';

export default function ListaMedicamentosPage() {
  const navigate = useNavigate();
  const [lista, setLista] = useState<Medicamento[]>([]);
  const [historico, setHistorico] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAll = () => {
    setLista(loadMedicamentos());
    setHistorico(loadHistorico());
  };

  useEffect(() => {
    loadAll();
    const onStorage = (ev: StorageEvent) => {
      if (ev.key === STORAGE_KEY || ev.key === 'medmod:medicamentos_history') loadAll();
    };
    window.addEventListener('storage', onStorage);
 return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isSameLocalDay = (iso: string) => {
    try {
      const d = new Date(iso);
      const now = new Date();
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
    } catch {
      return false;
    }
  };

  // mapa de tomados hoje por medId_index => Set('medId_0','medId_1',...)
  const tomadosHoje = useMemo(() => {
    const set = new Set<string>();
    for (const h of historico) {
      if (!h.medicamentoId || !h.takenAt) continue;
      if (isSameLocalDay(h.takenAt)) {
        if (typeof h.horarioIndex === 'number') {
          set.add(`${h.medicamentoId}_${h.horarioIndex}`);
        } else {
          // histórico antigo sem horarioIndex: fallback para índice 0
          set.add(`${h.medicamentoId}_0`);
        }
      }
    }
    return set;
  }, [historico]);

  // verifica se todos os horários programados para o medicamento foram tomados hoje
  const allTakenToday = (m: Medicamento) => {
    if (!m.id) return false;
    const count = m.horarios && m.horarios.length > 0 ? m.horarios.length : Math.max(1, Number(m.vezesAoDia ?? 1));
    for (let i = 0; i < count; i++) {
      if (!tomadosHoje.has(`${m.id}_${i}`)) return false;
    }
    return true;
  };

  const onTomar = (medId?: string, horarioIndex?: number) => {
    if (!medId) return;
    if (!confirm('Deseja registrar que tomou este medicamento agora?')) return;

    setLoading(true);
    try {
      const res = registrarTomada(medId, horarioIndex);
      if (!res) {
        alert('Erro ao registrar tomada (medicamento não encontrado).');
      }
    } catch (err) {
      console.error(err);
      alert('Ocorreu um erro ao registrar.');
    } finally {
      loadAll();
      setLoading(false);
    }
  };

  const handleDelete = (id?: string) => {
    if (!id) return;
    if (!confirm('Remover este medicamento?')) return;
    try {
      const meds = loadMedicamentos().filter((m) => m.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(meds));
      setLista(meds);
    } catch (err) {
      console.error(err);
    }
  };

  // renderiza botão para cada horário (ou vezesAoDia)
  const renderHorarioButtons = (m: Medicamento) => {
    const horarios =
      m.horarios && m.horarios.length > 0 ? m.horarios : Array(Math.max(1, Number(m.vezesAoDia ?? 1))).fill('');
    return (
      <Stack direction="row" spacing={1} alignItems="center">
        {horarios.map((h, idx) => {
          const key = `${m.id}_${idx}`;
          const alreadyTaken = m.id ? tomadosHoje.has(`${m.id}_${idx}`) : false;
          const label = h && h.length ? h : `Horário ${idx + 1}`;
          return (
            <Button
              key={key}
              onClick={() => onTomar(m.id, idx)}
              startIcon={<CheckCircleOutlineIcon />}
              variant={alreadyTaken ? 'contained' : 'outlined'}
              color={alreadyTaken ? 'success' : 'primary'}
              sx={{ fontSize: 14, px: 2, minHeight: 40 }}
              disabled={alreadyTaken || loading}
            >
              {alreadyTaken ? 'Tomado' : label}
            </Button>
          );
        })}
      </Stack>
    );
  };

  // lista filtrada: esconde medicamentos que já tiveram todos os horários tomados hoje
  const listaVisivel = lista.filter((m) => !allTakenToday(m));

  return (
    <Box sx={{ py: 4, px: 2, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ width: '100%', maxWidth: 980, borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" sx={{ fontSize: 24, fontWeight: 700, color: 'primary.main' }}>
              Medicamentos Cadastrados
            </Typography>

            {/* Botões de navegação — semelhantes ao Histórico (grandes e acessíveis) */}
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
                startIcon={<HistoryIcon />}
                onClick={() => navigate('/medicamentos/historico')}
                sx={{ fontSize: 16, px: 2, minHeight: 48 }}
              >
                Histórico
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
            </Stack>
          </Stack>

          {listaVisivel.length === 0 ? (
            <Box sx={{ py: 6, textAlign: 'center', bgcolor: '#e9f3ff', borderRadius: 2, border: '1px dashed #9ec9ff' }}>
              <Typography sx={{ fontSize: 20, fontWeight: 700, color: 'primary.main', mb: 1 }}>Nenhum medicamento ativo para hoje</Typography>
              <Typography sx={{ fontSize: 16, color: 'text.secondary', mb: 3 }}>
                Todos os horários programados foram cumpridos (ou não há medicamentos cadastrados).
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/medicamentos/cadastro')} sx={{ fontSize: 16, px: 3 }}>
                  Cadastrar Medicamento
                </Button>
                <Button variant="outlined" startIcon={<HistoryIcon />} onClick={() => navigate('/medicamentos/historico')} sx={{ fontSize: 16, px: 3 }}>
                  Ver Histórico
                </Button>
              </Stack>
            </Box>
          ) : (
            <List>
              {listaVisivel.map((m) => {
                const remaining = Number(m.quantidadeTotal ?? 0);
                const amountLabel = m.tipo === 'liquido' ? `${remaining} ml` : `${remaining} comprimidos`;
                return (
                  <React.Fragment key={m.id ?? Math.random()}>
                    <ListItem
                      secondaryAction={
                        <Stack direction="row" spacing={1} alignItems="center">
                          {renderHorarioButtons(m)}

                          <IconButton edge="end" aria-label="edit" onClick={() => navigate('/medicamentos/cadastro', { state: { medicamento: m } })}>
                            <EditIcon />
                          </IconButton>

                          <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(m.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      }
                      sx={{ py: 2 }}
                    >
                      <ListItemText
                        primary={<Typography sx={{ fontSize: 20, fontWeight: 700 }}>{m.nome}</Typography>}
                        secondary={
                          <Typography sx={{ fontSize: 16, color: 'text.secondary' }}>
                            {m.tipo ? `${m.tipo} • ` : ''}
                            <strong style={{ fontSize: 18 }}>{amountLabel}</strong>
                            {m.vezesAoDia ? ` • ${m.vezesAoDia}x/dia` : ''}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
