// src/features/medicamentos/components/MedicationNotifier.tsx
import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogTitle, DialogContent, Button, Typography, Stack } from "@mui/material";

interface HorarioDTO {
  id: number;
  horario: string; // "18:00"
  proximaExecucao?: string | null; // ISO string
  tomadoHoje: boolean;
}

interface MedicamentoDTO {
  id: number;
  nome: string;
  horarios: HorarioDTO[];
}

interface Props {
  medicamentos?: MedicamentoDTO[];
}


export default function MedicationNotifier({ medicamentos }: Props) {
  const [alerta, setAlerta] = useState<{
    nome: string;
    horario: string;
  } | null>(null);

  const notificadas = useRef<Set<number>>(new Set());

  // Verifica se uma data é hoje
  const isToday = (iso?: string | null) => {
    if (!iso) return false;
    const d = new Date(iso);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  };

  useEffect(() => {
    const verificar = () => {
      const agora = new Date().getTime();

      medicamentos.forEach((med) => {
        med.horarios.forEach((h) => {
          if (!isToday(h.proximaExecucao)) return;
          if (h.tomadoHoje) return; // já tomado, não notifica
          if (!h.proximaExecucao) return;

          const horarioExec = new Date(h.proximaExecucao).getTime();
          const diffMin = Math.round((horarioExec - agora) / 60000);

          // Faltam 5 minutos → exibir notificação
          if (diffMin <= 5 && diffMin >= 0) {
            if (!notificadas.current.has(h.id)) {
              notificadas.current.add(h.id);
              setAlerta({
                nome: med.nome,
                horario: h.horario,
              });
            }
          }
        });
      });
    };

    verificar();
    const interval = setInterval(verificar, 30000); // Verifica a cada 30 segundos
    return () => clearInterval(interval);
  }, [medicamentos]);

  return (
    <Dialog open={!!alerta} onClose={() => setAlerta(null)}>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 20 }}>
        ⚠️ Atenção — Medicamento Próximo
      </DialogTitle>

      <DialogContent>
        {alerta && (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography sx={{ fontSize: 18 }}>
              Está quase na hora de tomar:
            </Typography>

            <Typography sx={{ fontWeight: "bold", fontSize: 20 }}>
              💊 {alerta.nome}
            </Typography>

            <Typography sx={{ fontSize: 16 }}>
              Horário previsto: <strong>{alerta.horario}</strong>
            </Typography>
          </Stack>
        )}
      </DialogContent>

      <Stack direction="row" justifyContent="flex-end" sx={{ p: 2 }}>
        <Button variant="contained" onClick={() => setAlerta(null)}>
          Entendido
        </Button>
      </Stack>
    </Dialog>
  );
}
