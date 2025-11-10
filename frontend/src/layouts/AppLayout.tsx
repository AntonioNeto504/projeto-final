// src/layouts/AppLayout.tsx
import { AppBar, Avatar, Box, Container, Modal, Toolbar, Typography, Button } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import { Outlet, Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import logo_unati_horizontal from '../assets/logo_unati_horizontal.png';

export default function AppLayout() {
  const [openProfile, setOpenProfile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // 👈 pega a rota atual

  // ⛳ só mostra o botão Home se a rota começar com /medicamentos
  const isInsideMedicamentos = location.pathname.startsWith('/medicamentos');

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
      {/* 🔷 Barra superior fixa */}
      <AppBar
        position="fixed"
        elevation={0}
        color="transparent"
        sx={{
          borderBottom: '1px solid #e5eaf2',
          backdropFilter: 'blur(8px)',
          bgcolor: 'rgba(255,255,255,0.85)',
        }}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
          {/* 🔶 Logo clicável — vai pra /home */}
          <Box
            component="button"
            onClick={() => navigate('/home')}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              margin: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box
              component="img"
              src={logo_unati_horizontal}
              alt="Logo UNATI"
              sx={{ height: 48 }}
            />
          </Box>

          {/* Espaço flexível entre logo e botões */}
          <Box sx={{ flex: 1 }} />

          {/* 🔹 exibe botão Home apenas se estiver no módulo Medicamentos */}
          {isInsideMedicamentos && (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/home')}
              sx={{ mr: 2 }}
            >
              🏠 Página Inicial
            </Button>
          )}

          {/* 🔹 Área admin (sempre visível) */}
          <Button
            variant="outlined"
            color="primary"
            component={RouterLink as any}
            to="/admin"
            sx={{ mr: 2 }}
          >
            Área do Administrador
          </Button>

          {/* 🔹 Avatar do perfil */}
          <Avatar
            sx={{
              bgcolor: deepPurple[500],
              cursor: 'pointer',
            }}
            onClick={() => setOpenProfile(true)}
          >
            M
          </Avatar>
        </Toolbar>
      </AppBar>

      {/* compensação AppBar fixa */}
      <Toolbar />

      {/* conteúdo principal */}
      <Container sx={{ py: 3 }}>
        <Outlet />
      </Container>

      {/* Modal de perfil */}
      <Modal open={openProfile} onClose={() => setOpenProfile(false)}>
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 3,
            boxShadow: 24,
            minWidth: 320,
            maxWidth: '90vw',
          }}
        >
          <Typography variant="h5" fontWeight={700} mb={2}>
            Meu Perfil
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Aqui você poderá visualizar e editar suas informações pessoais, como nome,
            e-mail e foto de perfil.
          </Typography>

          <Box
            component="button"
            onClick={() => setOpenProfile(false)}
            sx={{
              mt: 3,
              width: '100%',
              p: 1.2,
              bgcolor: 'primary.main',
              color: '#fff',
              border: 'none',
              borderRadius: 2,
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Fechar
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
