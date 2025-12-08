// src/features/Medicamentos/components/HistoricoMedicamentos.tsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  List,
  ListItem
} from '@mui/material';
import { Link } from 'react-router-dom';
import type { Medicamento } from '../types/medicamento';

interface HistoricoMedicamentosProps {
  historico: Medicamento[];
}

const HistoricoMedicamentos: React.FC<HistoricoMedicamentosProps> = ({ historico }) => {
  // Transformar checkins em eventos legíveis
  const eventos = historico
    .flatMap((med) =>
      (med.checkins || [])
        .filter((iso) => !!iso) // evita valores vazios
        .map((iso) => {
          const date = new Date(iso);
          return {
            id: `${med.id}-${iso}`,
            nome: med.nome,
            iso,
            horario: date.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            }),
            data: date.toLocaleDateString()
          };
        })
    )
    .sort((a, b) => (a.iso < b.iso ? 1 : -1)); // mais recente primeiro

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: 'auto',
        my: 5,
        p: 3,
        backgroundColor: 'background.paper',
        borderRadius: 3,
        boxShadow: 3
      }}
    >
      {/* Cabeçalho */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" color="primary" fontWeight={700}>
          Histórico de Medicamentos
        </Typography>

        <Button component={Link} to="/medicamentos/lista" variant="outlined">
          📋 Lista
        </Button>
      </Stack>

      {/* Caso não haja eventos */}
      {eventos.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            p: 6,
            border: '2px dashed #90caf9',
            borderRadius: '16px',
            backgroundColor: '#e3f2fd',
            color: 'primary.main'
          }}
        >
          <Typography variant="h4" mb={1}>
            💊
          </Typography>
          <Typography variant="h6" mb={1}>
            Nenhuma ação registrada
          </Typography>
          <Typography variant="body2" color="text.secondary">
            O histórico aparecerá aqui quando você marcar "Tomar agora".
          </Typography>
        </Box>
      ) : (
        <List>
          {eventos.map((ev) => (
            <ListItem key={ev.id} sx={{ px: 0, mb: 2 }}>
              <Card sx={{ width: '100%', borderRadius: 2, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" color="primary" fontWeight={700}>
                    {ev.nome}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Data: <strong>{ev.data}</strong> • Horário: <strong>{ev.horario}</strong>
                  </Typography>
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
