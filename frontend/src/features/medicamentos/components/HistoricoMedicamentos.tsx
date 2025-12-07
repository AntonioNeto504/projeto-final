// src/features/Medicamentos/components/HistoricoMedicamentos.tsx
import React from 'react';
import { Box, Typography, Button, Card, CardContent, Stack, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import type { Medicamento } from '../types/medicamento';

interface HistoricoMedicamentosProps {
  historico: Medicamento[]; // aqui reutilizamos o mesmo array com checkins
}

const HistoricoMedicamentos: React.FC<HistoricoMedicamentosProps> = ({ historico }) => {
  // transformamos os checkins em um array de eventos
  const eventos = historico.flatMap((m) =>
    (m.checkins || []).map((iso) => ({
      id: `${m.id}-${iso}`,
      nome: m.nome,
      iso,
      horario: new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      data: new Date(iso).toLocaleDateString(),
    })),
  ).sort((a, b) => (a.iso < b.iso ? 1 : -1)); // mais recente primeiro

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', my: 5, p: 3, backgroundColor: 'background.paper', borderRadius: 3, boxShadow: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" color="primary" fontWeight={700}>Histórico de Medicamentos</Typography>
        <Stack direction="row" spacing={2}>
          <Button component={Link} to="/medicamentos/lista" variant="outlined">📋 Lista</Button>
        </Stack>
      </Stack>

      {eventos.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 6, border: '2px dashed #90caf9', borderRadius: '16px', backgroundColor: '#e3f2fd', color: 'primary.main' }}>
          <Typography variant="h4" mb={1}>💊</Typography>
          <Typography variant="h6" mb={1}>Nenhuma ação registrada</Typography>
          <Typography variant="body2" color="text.secondary">O histórico aparecerá aqui quando você marcar "Tomar agora".</Typography>
        </Box>
      ) : (
        <List>
          {eventos.map((ev) => (
            <ListItem key={ev.id} sx={{ mb: 1 }}>
              <Card sx={{ width: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" color="primary">{ev.nome}</Typography>
                  <Typography variant="body2" color="text.secondary">Data: {ev.data} • Hora: {ev.horario}</Typography>
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default HistoricoMedicamentos;
