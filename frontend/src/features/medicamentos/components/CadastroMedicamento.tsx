// src/features/medicamentos/components/CadastroMedicamento.tsx
import React, { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Stack,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import type { Medicamento, TipoMedicamento } from '../types/medicamento';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { loadContatos, createContato, updateContato, deleteContato, MAX_CONTACTS } from '../service/contatoService';
import type { Contato } from '../service/contatoService';

const STORAGE_KEY = 'medmod:medicamentos';

interface Props {
    onCadastrar?: (med: Medicamento) => void;
    onAtualizar?: (med: Medicamento) => void;
    medicamentoEditar?: Medicamento | null;
}

/* Helpers de layout */
const ResponsiveRow: React.FC<{ children: React.ReactNode; gap?: number | string; sx?: any }> = ({ children, gap = 2, sx }) => (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap, width: '100%', alignItems: 'stretch', ...sx }}>
        {children}
    </Box>
);

const Col: React.FC<{ children: React.ReactNode; flex?: number }> = ({ children, flex = 1 }) => (
    <Box sx={{ flex, minWidth: 0 }}>{children}</Box>
);

/* Estilos reutilizados */
const labelStyle = { fontSize: 18, lineHeight: 1.2 };
const selectBoxSx = {
    borderRadius: 28,
    backgroundColor: 'background.paper',
    border: '1px solid #e0e0e0',
    minHeight: 56,
    '& .MuiSelect-select': {
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        fontSize: 18,
    },
};
const selectMenuItemSx = { fontSize: 18 };

const CadastroMedicamento: React.FC<Props> = ({ onCadastrar, onAtualizar, medicamentoEditar }) => {
    const navigate = useNavigate();

    const [step, setStep] = useState<number>(1);

    const [form, setForm] = useState<Medicamento>({
        nome: '',
        tipo: 'comprimido',
        unidadePorDose: 0,
        mlPorDose: 0,
        quantidadeTotal: 0,
        vezesAoDia: 0,
        horarios: [''],
        tarja: 'comum',
    });

    // contatos
    const [contatos, setContatos] = useState<Contato[]>([]);
    const [openContatoDialog, setOpenContatoDialog] = useState(false);
    const [novoContato, setNovoContato] = useState<{ nome: string; telefone: string; relacao: string }>({
        nome: '',
        telefone: '',
        relacao: '',
    });
    const [editingContatoId, setEditingContatoId] = useState<string | null>(null);

    useEffect(() => {
        setContatos(loadContatos());
    }, []);

    useEffect(() => {
        if (medicamentoEditar) {
            setForm({
                ...medicamentoEditar,
                quantidadeTotal: medicamentoEditar.quantidadeTotal ?? 0,
                vezesAoDia: medicamentoEditar.vezesAoDia ?? 0,
                unidadePorDose: medicamentoEditar.unidadePorDose ?? 0,
                mlPorDose: medicamentoEditar.mlPorDose ?? 0,
                horarios:
                    medicamentoEditar.horarios && medicamentoEditar.horarios.length
                        ? medicamentoEditar.horarios
                        : Array(medicamentoEditar.vezesAoDia || 1).fill(''),
            } as Medicamento);
        } else {
            setForm({
                nome: '',
                tipo: 'comprimido',
                unidadePorDose: 0,
                mlPorDose: 0,
                quantidadeTotal: 0,
                vezesAoDia: 0,
                horarios: [''],
                tarja: 'comum',
            });
        }
        setStep(1);
    }, [medicamentoEditar]);

    const diasEstimados = useMemo(() => {
        const total = Number(form.quantidadeTotal ?? 0);
        const vezes = Number(form.vezesAoDia ?? 0);
        if (!total || !vezes) return 0;
        if (form.tipo === 'comprimido') {
            const perDose = Number(form.unidadePorDose ?? 0);
            if (!perDose) return 0;
            return Math.ceil(total / (perDose * vezes));
        } else {
            const perDoseMl = Number(form.mlPorDose ?? 0);
            if (!perDoseMl) return 0;
            return Math.ceil(total / (perDoseMl * vezes));
        }
    }, [form.quantidadeTotal, form.vezesAoDia, form.unidadePorDose, form.mlPorDose, form.tipo]);

    const handleVezesChange = (v: number) => {
        const vezes = Math.max(1, Math.floor(v));
        setForm((prev) => {
            const newHorarios = [...(prev.horarios || [])];
            while (newHorarios.length < vezes) newHorarios.push('');
            while (newHorarios.length > vezes) newHorarios.pop();
            return { ...prev, vezesAoDia: vezes, horarios: newHorarios } as Medicamento;
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
        const t = e.target as HTMLInputElement | { name?: string; value: any };
        const name = t.name ?? '';
        let value: any = (t as any).value;
        if (!name) return;

        // campos numéricos
        if (name === 'quantidadeTotal' || name === 'unidadePorDose' || name === 'mlPorDose') {
            if (value === '') {
                setForm((prev) => ({ ...prev, [name]: 0 } as any));
                return;
            }
            const n = Number(value);
            setForm((prev) => ({ ...prev, [name]: isNaN(n) ? 0 : n } as any));
            return;
        }

        if (name === 'vezesAoDia') {
            if (value === '') {
                setForm((prev) => ({ ...prev, vezesAoDia: 1 } as any));
                return;
            }
            const n = Number(value);
            if (isNaN(n) || n < 1) {
                handleVezesChange(1);
                return;
            }
            handleVezesChange(n);
            return;
        }

        // tipo
        if (name === 'tipo') {
            value = value as TipoMedicamento;
            if (value === 'comprimido') {
                setForm((prev) => ({ ...prev, tipo: 'comprimido', unidadePorDose: 1, mlPorDose: 0 } as any));
                return;
            } else {
                setForm((prev) => ({ ...prev, tipo: 'liquido', mlPorDose: 0, unidadePorDose: 0 } as any));
                return;
            }
        }

        // tarja: ao setar 'preta' tentamos vincular automaticamente ao primeiro contato; se não houver, abrimos diálogo
        if (name === 'tarja') {
            setForm((prev) => ({ ...prev, tarja: value } as any));
            if (value === 'preta') {
                const cts = loadContatos();
                setContatos(cts);
                if (cts.length > 0) {
                    setForm((prev) => ({ ...prev, tarja: 'preta', contatoEmergenciaId: cts[0].id } as any));
                } else {
                    setNovoContato({ nome: '', telefone: '', relacao: '' });
                    setEditingContatoId(null);
                    setOpenContatoDialog(true);
                }
            }
            return;
        }

        // contatoEmergenciaId: '' = não vincular, 'new' = abrir diálogo, id = vincular
        if (name === 'contatoEmergenciaId') {
            if (value === '') {
                setForm((prev) => {
                    const { contatoEmergenciaId, ...rest } = prev as any;
                    return rest as Medicamento;
                });
                return;
            }
            if (value === 'new') {
                if (contatos.length >= MAX_CONTACTS) {
                    alert(`Limite de ${MAX_CONTACTS} contatos atingido.`);
                    return;
                }
                setNovoContato({ nome: '', telefone: '', relacao: '' });
                setEditingContatoId(null);
                setOpenContatoDialog(true);
                return;
            }
            setForm((prev) => ({ ...prev, contatoEmergenciaId: String(value) } as any));
            return;
        }

        setForm((prev) => ({ ...prev, [name]: value } as any));
    };

    const handleHorarioChange = (index: number, value: string) => {
        setForm((prev) => {
            const h = [...(prev.horarios || [])];
            h[index] = value;
            return { ...prev, horarios: h } as Medicamento;
        });
    };

    const validateStep1 = () => {
        if (!form.nome || form.nome.trim() === '') return false;
        if (form.tipo === 'comprimido' && !(Number(form.unidadePorDose) > 0)) return false;
        if (form.tipo === 'liquido' && !(Number(form.mlPorDose) > 0)) return false;
        if (!(Number(form.quantidadeTotal) > 0)) return false;
        if (!(Number(form.vezesAoDia) >= 1)) return false;
        return true;
    };

    const validateStep2 = () => {
        if ((form.horarios || []).some((h) => !h || h.trim() === '')) return false;
        return true;
    };

    const handleSubmit = (e?: FormEvent) => {
        if (e) e.preventDefault();
        if (!validateStep1()) {
            alert('Preencha corretamente a primeira etapa.');
            setStep(1);
            return;
        }
        if (!validateStep2()) {
            alert('Preencha corretamente os horários.');
            setStep(2);
            return;
        }

        const medToSave: Medicamento = {
            ...form,
            quantidadeTotal: Number(form.quantidadeTotal ?? 0),
            vezesAoDia: Number(form.vezesAoDia ?? 1),
            horarios: form.horarios || Array(form.vezesAoDia || 1).fill(''),
        };

        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const list = raw ? (JSON.parse(raw) as Medicamento[]) : [];
            if (medToSave.id) {
                const idx = list.findIndex((m) => m.id === medToSave.id);
                if (idx >= 0) list[idx] = medToSave;
                else list.push(medToSave);
            } else {
                medToSave.id = String(Date.now());
                list.push(medToSave);
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        } catch {
            // ignore
        }

        if (medicamentoEditar?.id) onAtualizar?.(medToSave);
        else onCadastrar?.(medToSave);

        navigate('/medicamentos/lista');
    };

    const quantidadePorHorario = useMemo(() => {
        if (form.tipo === 'comprimido') return Number(form.unidadePorDose ?? 0);
        return +(Number(form.mlPorDose ?? 0)).toFixed(2);
    }, [form.tipo, form.unidadePorDose, form.mlPorDose]);

    // contatos handlers
    const abrirEdicaoContato = (contatoId: string) => {
        const c = contatos.find((x) => x.id === contatoId);
        if (!c) return;
        setNovoContato({ nome: c.nome, telefone: c.telefone, relacao: c.relacao ?? '' });
        setEditingContatoId(contatoId);
        setOpenContatoDialog(true);
    };

    const handleDeleteContact = (contatoId?: string) => {
        if (!contatoId) return;
        if (!confirm('Deseja realmente excluir esse contato de emergência?')) return;
        const ok = deleteContato(contatoId);
        if (!ok) {
            alert('Erro ao excluir contato.');
            return;
        }
        setContatos(loadContatos());
        if (form.contatoEmergenciaId === contatoId) {
            setForm((prev) => {
                const { contatoEmergenciaId, ...rest } = prev as any;
                return rest as Medicamento;
            });
        }
    };

    const handleSaveNewContact = () => {
        if (!novoContato.nome.trim() || !novoContato.telefone.trim()) {
            alert('Informe nome e telefone do contato.');
            return;
        }

        if (editingContatoId) {
            const updated = updateContato(editingContatoId, {
                nome: novoContato.nome.trim(),
                telefone: novoContato.telefone.trim(),
                relacao: novoContato.relacao.trim(),
            });
            if (!updated) {
                alert('Erro ao atualizar contato.');
                setOpenContatoDialog(false);
                setEditingContatoId(null);
                setContatos(loadContatos());
                return;
            }
            setContatos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
            setOpenContatoDialog(false);
            setEditingContatoId(null);
            return;
        }

        const created = createContato({
            nome: novoContato.nome.trim(),
            telefone: novoContato.telefone.trim(),
            relacao: novoContato.relacao.trim(),
        });

        if (!created) {
            alert(`Limite de ${MAX_CONTACTS} contatos atingido.`);
            setContatos(loadContatos());
            setOpenContatoDialog(false);
            return;
        }

        setContatos((prev) => [...prev, created]);
        setForm((prev) => ({ ...prev, contatoEmergenciaId: created.id } as any));
        setOpenContatoDialog(false);
        setEditingContatoId(null);
    };

    return (
        <Box sx={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4, px: 2 }}>
            <Card sx={{ width: '100%', maxWidth: 860, borderRadius: 3, boxShadow: 4 }}>
                <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
                    <Typography variant="h4" align="center" color="primary" fontWeight={800} gutterBottom sx={{ fontSize: { xs: 22, sm: 26 } }}>
                        {form.id ? 'Editar Medicamento' : 'Cadastro do Medicamento'}
                    </Typography>

                    <form onSubmit={handleSubmit} noValidate>
                        {step === 1 && (
                            <Stack spacing={3} sx={{ mt: 1 }}>
                                <TextField
                                    label="Nome do Medicamento"
                                    name="nome"
                                    value={form.nome}
                                    onChange={handleInputChange}
                                    required
                                    fullWidth
                                    size="small"
                                    margin="dense"
                                    InputLabelProps={{ sx: labelStyle }}
                                    InputProps={{ inputProps: { style: { fontSize: 20, padding: '14px 12px' } } }}
                                />

                                <ResponsiveRow gap={2}>
                                    <Col flex={1}>
                                        <FormControl fullWidth size="small" margin="dense">
                                            <InputLabel id="tipo-label" sx={labelStyle}>Tipo</InputLabel>
                                            <Select
                                                labelId="tipo-label"
                                                name="tipo"
                                                value={form.tipo}
                                                onChange={handleInputChange as any}
                                                sx={selectBoxSx}
                                            >
                                                <MenuItem value="comprimido" sx={selectMenuItemSx}>Comprimido</MenuItem>
                                                <MenuItem value="liquido" sx={selectMenuItemSx}>Solução (Líquido)</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Col>

                                    <Col flex={1}>
                                        {form.tipo === 'comprimido' ? (
                                            <TextField
                                                label="Unidades por dose"
                                                name="unidadePorDose"
                                                type="number"
                                                inputProps={{ min: 1 }}
                                                value={form.unidadePorDose === 0 ? '' : String(form.unidadePorDose)}
                                                onChange={handleInputChange}
                                                required
                                                fullWidth
                                                size="small"
                                                margin="dense"
                                                InputLabelProps={{ sx: labelStyle }}
                                                InputProps={{ inputProps: { style: { fontSize: 20, padding: '12px 12px' } } }}
                                            />
                                        ) : (
                                            <TextField
                                                label="ML por dose"
                                                name="mlPorDose"
                                                type="number"
                                                inputProps={{ min: 0.1, step: 0.1 }}
                                                value={form.mlPorDose === 0 ? '' : String(form.mlPorDose)}
                                                onChange={handleInputChange}
                                                required
                                                fullWidth
                                                size="small"
                                                margin="dense"
                                                InputLabelProps={{ sx: labelStyle }}
                                                InputProps={{ inputProps: { style: { fontSize: 20, padding: '12px 12px' } } }}
                                            />
                                        )}
                                    </Col>
                                </ResponsiveRow>

                                <ResponsiveRow gap={2}>
                                    <Col flex={1.4}>
                                        <TextField
                                            label={form.tipo === 'liquido' ? 'Total (ml) - quantidade total do frasco' : 'Total (comprimidos) - quantidade total'}
                                            name="quantidadeTotal"
                                            type="number"
                                            value={form.quantidadeTotal === 0 ? '' : String(form.quantidadeTotal)}
                                            onChange={handleInputChange}
                                            required
                                            fullWidth
                                            size="small"
                                            margin="dense"
                                            InputLabelProps={{ sx: labelStyle }}
                                        />
                                    </Col>

                                    <Col flex={1}>
                                        <TextField
                                            label="Vezes ao dia"
                                            name="vezesAoDia"
                                            type="number"
                                            inputProps={{ min: 1 }}
                                            value={form.vezesAoDia === 0 ? '' : String(form.vezesAoDia)}
                                            onChange={handleInputChange}
                                            required
                                            fullWidth
                                            size="small"
                                            margin="dense"
                                            InputLabelProps={{ sx: labelStyle }}
                                        />
                                    </Col>
                                </ResponsiveRow>

                                <Typography variant="body1" color="text.secondary" sx={{ mt: 1, fontSize: 18 }}>
                                    Duração estimada: <strong style={{ fontSize: 18 }}>{diasEstimados > 0 ? `${diasEstimados} dia(s)` : '—'}</strong>
                                </Typography>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: 2,
                                        mt: 1
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/medicamentos/lista')}
                                        size="large"
                                        sx={{ maxWidth: { sm: 180 }, fontSize: 18, minHeight: 52 }}
                                    >
                                        ← Voltar
                                    </Button>

                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            if (!validateStep1()) {
                                                alert('Preencha todos os campos obrigatórios da etapa 1.');
                                                return;
                                            }
                                            setStep(2);
                                        }}
                                        size="large"
                                        sx={{ maxWidth: { sm: 320 }, fontSize: 18, minHeight: 56 }}
                                    >
                                        Próxima etapa →
                                    </Button>
                                </Box>

                            </Stack>
                        )}

                        {step === 2 && (
                            <Stack spacing={3} sx={{ mt: 1 }}>
                                <Typography variant="h5" sx={{ fontSize: 20, fontWeight: 700 }}>Detalhes e Horários</Typography>

                                <Typography sx={{ fontSize: 18, color: 'text.secondary' }}>
                                    Período estimado: <strong style={{ fontSize: 18 }}>{diasEstimados > 0 ? `${diasEstimados} dia(s)` : '—'}</strong>
                                </Typography>

                                <Divider />

                                <Typography variant="subtitle1" sx={{ mt: 1, fontSize: 18 }}>Horários (preencha todos) — lista rolável</Typography>

                                <Box sx={{ maxHeight: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
                                    {Array.from({ length: form.vezesAoDia || 1 }).map((_, idx) => (
                                        <Box key={idx} sx={{ borderRadius: 2 }}>
                                            <ResponsiveRow gap={2}>
                                                <Col>
                                                    <TextField
                                                        label={`Horário ${idx + 1}`}
                                                        type="time"
                                                        value={(form.horarios && form.horarios[idx]) ?? ''}
                                                        onChange={(e) => handleHorarioChange(idx, e.target.value)}
                                                        InputLabelProps={{ shrink: true, sx: labelStyle }}
                                                        fullWidth
                                                        required
                                                        size="small"
                                                        margin="dense"
                                                    />
                                                </Col>

                                                <Col>
                                                    <Typography variant="body1" color="text.secondary" sx={{ fontSize: 18 }}>
                                                        Quantidade estimada por horário: <strong style={{ fontSize: 18 }}>{quantidadePorHorario}</strong> {form.tipo === 'liquido' ? 'ml' : 'unidades'}
                                                    </Typography>
                                                </Col>
                                            </ResponsiveRow>
                                        </Box>
                                    ))}
                                </Box>

                                <Divider />

                                <ResponsiveRow gap={2} sx={{ alignItems: 'center', mb: 2 }}>
                                    <Box sx={{ flex: 1, pr: { xs: 0, sm: 2 } }}>
                                        <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 1 }}>Tarja</Typography>

                                        <FormControl fullWidth size="small" margin="dense" sx={{ ...selectBoxSx }}>
                                            <Select
                                                labelId="tarja-label"
                                                name="tarja"
                                                value={form.tarja}
                                                onChange={handleInputChange as any}
                                                sx={{ '& .MuiSelect-select': { fontSize: 18 } }}
                                            >
                                                <MenuItem value="comum" sx={selectMenuItemSx}>Comum</MenuItem>
                                                <MenuItem value="amarela" sx={selectMenuItemSx}>Amarela</MenuItem>
                                                <MenuItem value="vermelha" sx={selectMenuItemSx}>Vermelha</MenuItem>
                                                <MenuItem value="preta" sx={selectMenuItemSx}>Preta</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>

                                    <Box sx={{ flex: 1, pl: { xs: 0, sm: 2 }, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                        <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 1, textAlign: { xs: 'left', sm: 'right' } }}>
                                            Deseja vincular contato de emergência?
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <FormControl fullWidth size="small" margin="dense" sx={{ ...selectBoxSx }}>
                                                <Select
                                                    labelId="contato-emergencia-label"
                                                    name="contatoEmergenciaId"
                                                    value={form.contatoEmergenciaId ?? ''}
                                                    onChange={handleInputChange as any}
                                                    displayEmpty
                                                    renderValue={(selected) => {
                                                        if (!selected)
                                                            return <span style={{ color: '#555', fontSize: 18 }}>Não vincular</span>;

                                                        const c = contatos.find((x) => x.id === selected);
                                                        return c ? `${c.nome} — ${c.telefone}` : String(selected);
                                                    }}
                                                    sx={{ '& .MuiSelect-select': { fontSize: 18 } }}
                                                >
                                                    <MenuItem value="">
                                                        <em style={{ fontSize: 18 }}>Não vincular</em>
                                                    </MenuItem>

                                                    {contatos.map((c) => (
                                                        <MenuItem key={c.id} value={c.id} sx={{ fontSize: 18 }}>
                                                            {c.nome} — {c.telefone} ({c.relacao ?? '—'})
                                                        </MenuItem>
                                                    ))}

                                                    <MenuItem
                                                        value="new"
                                                        sx={{ fontSize: 18 }}
                                                        disabled={contatos.length >= MAX_CONTACTS}
                                                    >
                                                        {contatos.length >= MAX_CONTACTS
                                                            ? `Limite atingido (${contatos.length}/${MAX_CONTACTS})`
                                                            : '➕ Cadastrar novo contato'}
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>

                                            {/* ============================
        SELETOR DE AÇÃO: 
        - Se não há contato selecionado: mostra "Cadastrar"
        - Se há contato selecionado: mostra ícones
       ============================ */}
                                            {(!form.contatoEmergenciaId || form.contatoEmergenciaId === '') ? (
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => {
                                                        if (contatos.length >= MAX_CONTACTS) {
                                                            alert(`Limite de ${MAX_CONTACTS} contatos atingido.`);
                                                            return;
                                                        }
                                                        setNovoContato({ nome: '', telefone: '', relacao: '' });
                                                        setEditingContatoId(null);
                                                        setOpenContatoDialog(true);
                                                    }}
                                                    sx={{
                                                        height: 40,
                                                        borderRadius: 20,
                                                        px: 3,
                                                        textTransform: 'none',
                                                        fontSize: 14,
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    Cadastrar
                                                </Button>
                                            ) : (
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <IconButton
                                                        aria-label="editar contato"
                                                        onClick={() => abrirEdicaoContato(String(form.contatoEmergenciaId))}
                                                        sx={{ borderRadius: 20 }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>

                                                    <IconButton
                                                        aria-label="excluir contato"
                                                        onClick={() => handleDeleteContact(String(form.contatoEmergenciaId))}
                                                        sx={{ borderRadius: 20 }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                    
                                    
                                </ResponsiveRow>

                                <Divider />

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                                    <Button variant="outlined" onClick={() => setStep(1)} sx={{ maxWidth: { sm: 180 }, fontSize: 18, minHeight: 52 }}>
                                        ← Voltar
                                    </Button>

                                    <Button variant="contained" onClick={() => { if (!validateStep2()) { alert('Preencha corretamente os horários.'); return; } handleSubmit(); }} sx={{ maxWidth: { sm: 320 }, fontSize: 18, minHeight: 56 }}>
                                        Concluir Cadastro
                                    </Button>
                                </Box>
                            </Stack>
                        )}
                    </form>

                </CardContent>
            </Card>

            {/* Dialog para cadastrar/editar novo contato */}
            <Dialog open={openContatoDialog} onClose={() => { setOpenContatoDialog(false); setEditingContatoId(null); }} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontSize: 20 }}>{editingContatoId ? 'Editar contato de emergência' : 'Cadastrar contato de emergência'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Nome"
                            value={novoContato.nome}
                            onChange={(e) => setNovoContato((s) => ({ ...s, nome: e.target.value }))}
                            fullWidth
                            size="small"
                            InputProps={{ style: { fontSize: 18 } }}
                        />
                        <TextField
                            label="Telefone"
                            value={novoContato.telefone}
                            onChange={(e) => setNovoContato((s) => ({ ...s, telefone: e.target.value }))}
                            fullWidth
                            size="small"
                            InputProps={{ style: { fontSize: 18 } }}
                        />
                        <TextField
                            label="Relação (ex.: Filho)"
                            value={novoContato.relacao}
                            onChange={(e) => setNovoContato((s) => ({ ...s, relacao: e.target.value }))}
                            fullWidth
                            size="small"
                            InputProps={{ style: { fontSize: 18 } }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={() => { setOpenContatoDialog(false); setEditingContatoId(null); }} variant="outlined" sx={{ fontSize: 16 }}>
                        Cancelar
                    </Button>

                    <Button variant="contained" onClick={handleSaveNewContact} sx={{ fontSize: 16 }}>
                        Salvar contato
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CadastroMedicamento;
