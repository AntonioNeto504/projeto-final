import React from "react";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
  Button,
} from "@mui/material";

interface Contato {
  id: number;
  nome: string;
  telefone: string;
  relacao?: string;
}

interface Props {
  contatos: Contato[];
  contatosSelecionados: number[];
  onChange: (ids: number[]) => void;
}

export default function ContatoSelector({
  contatos,
  contatosSelecionados,
  onChange,
}: Props) {
  return (
    <Box>
      <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 1 }}>
        Contatos de Emergência
      </Typography>

      <FormControl fullWidth size="small">
        <Select
          multiple
          value={contatosSelecionados}
          onChange={(e) => onChange(e.target.value as number[])}
          renderValue={(selected) => {
            if (!selected.length) return "Nenhum contato selecionado";

            if (selected.length === 1) {
              const c = contatos.find((x) => x.id === selected[0]);
              return c ? `${c.nome} — ${c.telefone}` : selected[0];
            }

            return `${selected.length} contatos selecionados`;
          }}
        >
          {contatos.map((c) => (
            <MenuItem key={c.id} value={c.id} sx={{ fontSize: 16 }}>
              <input
                type="checkbox"
                checked={contatosSelecionados.includes(c.id)}
                readOnly
                style={{ marginRight: 8 }}
              />
              {c.nome} — {c.telefone}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
