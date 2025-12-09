// src/pages/IncialPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Container,
} from '@mui/material';
import MedicationIcon from '@mui/icons-material/Medication';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HistoryIcon from '@mui/icons-material/History';

const IncialPage: React.FC = () => {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)',
        py: 4,
      }}
    >
      <Card
        sx={{
          backgroundColor: 'transparent',
          border: '2px solid rgba(0,0,0,0.08)',
          borderRadius: '22px',
          textAlign: 'center',
          padding: { xs: '30px 20px', sm: '50px 40px' },
          maxWidth: 560,
          width: '100%',
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2rem' },
              mb: 2,
              lineHeight: 1.3,
              fontWeight: 'bold',
            }}
          >
            DoseCerta 💊
          </Typography>

          <Typography
            variant="h4"
            component="h1"
            sx={{ fontSize: { xs: '1rem', sm: '1.5rem' }, mb: 2, lineHeight: 1.3 }}
          >
            Organize seus medicamentos com precisão e segurança
          </Typography>

          <Stack spacing={2} alignItems="center" >
            <Button
              component={Link}
              to="/medicamentos/cadastro"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<MedicationIcon />}
              sx={{ fontSize: { xs: 18, sm: 18 }, fontWeight: 700, borderRadius: 1, py: 1.5, px: 3 }}
            >
              Cadastrar Novo Medicamento
            </Button>

            <Button
              component={Link}
              to="/medicamentos/lista"
              variant="outlined"
              color="primary"
              size="large"
              startIcon={<ListAltIcon />}
              sx={{ fontSize: { xs: 16, sm: 16 }, fontWeight: 700, borderRadius: 1, py: 1.5, px: 3 }}
            >
              Ver Lista de Medicamentos
            </Button>

            <Button
              component={Link}
              to="/medicamentos/historico"
              variant="outlined"
              color="primary"
              size="large"
              startIcon={<HistoryIcon />}
              sx={{ fontSize: { xs: 16, sm: 16 }, fontWeight: 700, borderRadius: 1, py: 1.5, px: 3 }}
            >
              Histórico de Medicamentos
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default IncialPage;
