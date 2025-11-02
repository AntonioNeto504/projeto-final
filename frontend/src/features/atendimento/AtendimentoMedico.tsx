import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
  InputAdornment,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

// 🔹 Lista mock de médicos (vinda do Admin)
const MEDICOS_MOCK = [
  { id: 11, nome: 'Dra. Ana Pereira' },
  { id: 12, nome: 'Dr. Bruno Lima' },
  { id: 13, nome: 'Dr. Carlos Mendes' },
  { id: 14, nome: 'Dra. Fernanda Silva' },
];

export default function AtendimentoMedico() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    paciente: '',
    data: '',
    medico: '',
    sintomas: '',
    diagnostico: '',
    prescricao: '',
  });

  // 🔍 Controle do modal de busca de médicos
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const handleSelectMedico = (nome: string) => {
    setForm({ ...form, medico: nome });
    setOpenDialog(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Dados do atendimento:', form);

    enqueueSnackbar('Atendimento salvo com sucesso!', {
      variant: 'success',
      autoHideDuration: 3000,
    });

    setForm({
      paciente: '',
      data: '',
      medico: '',
      sintomas: '',
      diagnostico: '',
      prescricao: '',
    });
  };

  // 🔎 Médicos filtrados
  const filteredMedicos = MEDICOS_MOCK.filter((m) =>
    m.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: '#f9fafc',
        }}
      >
        {/* 🔙 Botão Voltar */}
        <Box display="flex" alignItems="center" mb={2}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/home')}
            sx={{
              textTransform: 'none',
              color: 'primary.main',
              fontWeight: 600,
              mb: 1,
            }}
          >
            Voltar
          </Button>
        </Box>

        <Typography variant="h5" fontWeight="bold" mb={3} color="primary">
          Atendimento Médico
        </Typography>

        <Typography variant="body1" mb={3}>
          Registre as informações do atendimento realizado com o paciente.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Paciente */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Nome do Paciente"
                name="paciente"
                value={form.paciente}
                onChange={(e) =>
                  setForm({ ...form, paciente: e.target.value })
                }
              />
            </Grid>

            {/* Data */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Data da Consulta"
                name="data"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={form.data}
                onChange={(e) => setForm({ ...form, data: e.target.value })}
              />
            </Grid>

            {/* 🔍 Médico Responsável */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Médico Responsável"
                value={form.medico}
                placeholder="Selecione ou procure o médico"
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setOpenDialog(true)}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Sintomas */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Sintomas"
                name="sintomas"
                value={form.sintomas}
                onChange={(e) =>
                  setForm({ ...form, sintomas: e.target.value })
                }
              />
            </Grid>

            {/* Diagnóstico */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Diagnóstico"
                name="diagnostico"
                value={form.diagnostico}
                onChange={(e) =>
                  setForm({ ...form, diagnostico: e.target.value })
                }
              />
            </Grid>

            {/* Prescrição */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Prescrição / Observações"
                name="prescricao"
                value={form.prescricao}
                onChange={(e) =>
                  setForm({ ...form, prescricao: e.target.value })
                }
              />
            </Grid>

            {/* Botão salvar */}
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ borderRadius: 2 }}
              >
                Salvar Atendimento
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* 🔍 Modal de seleção de médico */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>Selecionar Médico</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Digite o nome do médico..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 2 }}
          />
          <List>
            {filteredMedicos.map((m) => (
              <ListItemButton key={m.id} onClick={() => handleSelectMedico(m.nome)}>
                <ListItemText primary={m.nome} />
              </ListItemButton>
            ))}
            {filteredMedicos.length === 0 && (
              <Typography color="text.secondary" align="center" py={2}>
                Nenhum médico encontrado.
              </Typography>
            )}
          </List>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
