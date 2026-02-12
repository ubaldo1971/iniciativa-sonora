import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:3000/api';

// ─── Simple Bar Chart Component ───────────────────────────────────────
const BarChart = ({ data, title, colorFrom = '#6366f1', colorTo = '#8b5cf6' }) => {
    const max = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-white font-bold text-lg mb-4">{title}</h3>
            <div className="space-y-3">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <span className="text-gray-400 text-sm w-28 truncate text-right">{item.label}</span>
                        <div className="flex-1 bg-gray-700/50 rounded-full h-8 overflow-hidden relative">
                            <div
                                className="h-full rounded-full flex items-center justify-end pr-3 transition-all duration-1000 ease-out"
                                style={{
                                    width: `${Math.max((item.value / max) * 100, 8)}%`,
                                    background: `linear-gradient(90deg, ${colorFrom}, ${colorTo})`,
                                    animationDelay: `${i * 100}ms`
                                }}
                            >
                                <span className="text-white text-xs font-bold">{item.value}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Donut Chart Component ────────────────────────────────────────────
const DonutChart = ({ data, title }) => {
    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    const colors = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#ec4899', '#14b8a6', '#f97316'];
    let cumulative = 0;

    return (
        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-white font-bold text-lg mb-4">{title}</h3>
            <div className="flex items-center gap-6">
                <div className="relative w-40 h-40 flex-shrink-0">
                    <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
                        <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#374151" strokeWidth="5" />
                        {data.map((item, i) => {
                            const pct = (item.value / total) * 100;
                            const offset = 100 - cumulative;
                            cumulative += pct;
                            return (
                                <circle
                                    key={i}
                                    cx="21" cy="21" r="15.9"
                                    fill="transparent"
                                    stroke={colors[i % colors.length]}
                                    strokeWidth="5"
                                    strokeDasharray={`${pct} ${100 - pct}`}
                                    strokeDashoffset={offset}
                                    className="transition-all duration-1000"
                                />
                            );
                        })}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <span className="text-2xl font-bold text-white">{total}</span>
                            <span className="block text-xs text-gray-400">Total</span>
                        </div>
                    </div>
                </div>
                <div className="space-y-2 flex-1">
                    {data.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
                            <span className="text-gray-300 text-sm flex-1">{item.label}</span>
                            <span className="text-white font-bold text-sm">{item.value}</span>
                            <span className="text-gray-500 text-xs">({((item.value / total) * 100).toFixed(1)}%)</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ─── Stat Card Component ──────────────────────────────────────────────
const StatCard = ({ icon, label, value, subtext, color = 'indigo' }) => {
    const colorMap = {
        indigo: 'from-indigo-500 to-purple-600',
        green: 'from-emerald-500 to-teal-600',
        amber: 'from-amber-500 to-orange-600',
        blue: 'from-blue-500 to-cyan-600',
        rose: 'from-rose-500 to-pink-600',
    };
    return (
        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-5 border border-gray-700/50 hover:border-gray-600 transition-all group">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-400 text-sm mb-1">{label}</p>
                    <p className="text-3xl font-bold text-white">{value}</p>
                    {subtext && <p className="text-gray-500 text-xs mt-1">{subtext}</p>}
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};


// ═══════════════════════════════════════════════════════════════════════
// MAIN ADMIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════
const Admin = () => {
    const navigate = useNavigate();

    // Tab state
    const [activeTab, setActiveTab] = useState('registros');

    // Data states
    const [registros, setRegistros] = useState([]);
    const [aliados, setAliados] = useState([]);
    const [metas, setMetas] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month, year
    const [sortBy, setSortBy] = useState('newest'); // newest, oldest, name
    const [genderFilter, setGenderFilter] = useState('all');

    // Selection for mass messaging
    const [selectedContacts, setSelectedContacts] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);
    const [massMessage, setMassMessage] = useState('');
    const [showMessageModal, setShowMessageModal] = useState(false);

    // Edit & Delete states
    const [editItem, setEditItem] = useState(null); // { type: 'registro'|'aliado', data: {...} }
    const [editForm, setEditForm] = useState({});
    const [deleteItem, setDeleteItem] = useState(null); // { type: 'registro'|'aliado', id, name }
    const [actionLoading, setActionLoading] = useState(false);

    // Metas states
    const [showMetaModal, setShowMetaModal] = useState(false);
    const [editingMeta, setEditingMeta] = useState(null);
    const [metaForm, setMetaForm] = useState({ titulo: '', categoria: 'economica', meta_objetivo: '', meta_actual: '', unidad: '$', descripcion: '' });
    const [metaCategoryFilter, setMetaCategoryFilter] = useState('all');
    const [deleteMeta, setDeleteMeta] = useState(null);

    // ─── Fetch Data ───────────────────────────────────────────────────
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [regRes, aliRes, metRes] = await Promise.all([
                fetch(`${API_BASE}/registros`),
                fetch(`${API_BASE}/aliados`),
                fetch(`${API_BASE}/metas`)
            ]);
            const regData = await regRes.json();
            const aliData = await aliRes.json();
            const metData = await metRes.json();
            setRegistros(Array.isArray(regData) ? regData : []);
            setAliados(Array.isArray(aliData) ? aliData : []);
            setMetas(Array.isArray(metData) ? metData : []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // ─── Filtered & Sorted Registros ──────────────────────────────────
    const filteredRegistros = useMemo(() => {
        let data = [...registros];

        // Search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            data = data.filter(r =>
                (r.nombre || '').toLowerCase().includes(term) ||
                (r.email || '').toLowerCase().includes(term) ||
                (r.celular || '').includes(term)
            );
        }

        // Gender filter
        if (genderFilter !== 'all') {
            data = data.filter(r => (r.sexo || '').toLowerCase() === genderFilter);
        }

        // Date filter
        const now = new Date();
        if (dateFilter === 'today') {
            data = data.filter(r => {
                const d = new Date(r.fecha_registro);
                return d.toDateString() === now.toDateString();
            });
        } else if (dateFilter === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            data = data.filter(r => new Date(r.fecha_registro) >= weekAgo);
        } else if (dateFilter === 'month') {
            data = data.filter(r => {
                const d = new Date(r.fecha_registro);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            });
        } else if (dateFilter === 'year') {
            data = data.filter(r => {
                const d = new Date(r.fecha_registro);
                return d.getFullYear() === now.getFullYear();
            });
        }

        // Sort
        if (sortBy === 'newest') {
            data.sort((a, b) => new Date(b.fecha_registro) - new Date(a.fecha_registro));
        } else if (sortBy === 'oldest') {
            data.sort((a, b) => new Date(a.fecha_registro) - new Date(b.fecha_registro));
        } else if (sortBy === 'name') {
            data.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
        }

        return data;
    }, [registros, searchTerm, dateFilter, sortBy, genderFilter]);

    // ─── Statistics ───────────────────────────────────────────────────
    const stats = useMemo(() => {
        const genderCount = {};
        const ageGroups = { '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '56+': 0, 'Sin dato': 0 };
        const monthlyData = {};
        const paisCodes = {};

        registros.forEach(r => {
            // Gender
            const sex = (r.sexo || 'Sin dato').toLowerCase();
            const genderLabel = sex === 'masculino' ? 'Hombres' :
                sex === 'femenino' ? 'Mujeres' :
                    sex === 'otro' ? 'Otro' : 'Sin dato';
            genderCount[genderLabel] = (genderCount[genderLabel] || 0) + 1;

            // Age
            const age = parseInt(r.edad);
            if (!age || isNaN(age)) ageGroups['Sin dato']++;
            else if (age <= 25) ageGroups['18-25']++;
            else if (age <= 35) ageGroups['26-35']++;
            else if (age <= 45) ageGroups['36-45']++;
            else if (age <= 55) ageGroups['46-55']++;
            else ageGroups['56+']++;

            // Monthly
            const d = new Date(r.fecha_registro);
            const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const monthLabel = d.toLocaleDateString('es-MX', { month: 'short', year: '2-digit' });
            if (!monthlyData[monthKey]) monthlyData[monthKey] = { key: monthKey, label: monthLabel, value: 0 };
            monthlyData[monthKey].value++;

            // Country codes (migration indicator)
            const code = r.pais_codigo || '+52';
            const codeLabel = code === '+52' ? 'México (+52)' : `Internacional (${code})`;
            paisCodes[codeLabel] = (paisCodes[codeLabel] || 0) + 1;
        });

        // Today count
        const today = new Date();
        const todayCount = registros.filter(r => new Date(r.fecha_registro).toDateString() === today.toDateString()).length;

        // This week
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const weekCount = registros.filter(r => new Date(r.fecha_registro) >= weekAgo).length;

        return {
            total: registros.length,
            todayCount,
            weekCount,
            aliadosCount: aliados.length,
            gender: Object.entries(genderCount).map(([label, value]) => ({ label, value })),
            ageGroups: Object.entries(ageGroups).filter(([, v]) => v > 0).map(([label, value]) => ({ label, value })),
            monthly: Object.values(monthlyData).sort((a, b) => a.key.localeCompare(b.key)).slice(-12),
            origin: Object.entries(paisCodes).map(([label, value]) => ({ label, value })),
        };
    }, [registros, aliados]);

    // ─── Mass Messaging ───────────────────────────────────────────────
    const handleToggleContact = (id) => {
        const newSet = new Set(selectedContacts);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedContacts(newSet);
    };

    const handleSelectAll = (list) => {
        if (selectAll) {
            setSelectedContacts(new Set());
        } else {
            setSelectedContacts(new Set(list.map(r => r.id)));
        }
        setSelectAll(!selectAll);
    };

    const getSelectedPhones = () => {
        const allPeople = [...registros, ...aliados.map(a => ({ ...a, celular: a.telefono, nombre: a.empresa }))];
        return allPeople.filter(r => selectedContacts.has(r.id)).map(r => ({
            nombre: r.nombre || r.empresa,
            phone: r.celular || r.telefono,
            pais_codigo: r.pais_codigo || '+52'
        }));
    };

    const sendWhatsAppMessages = () => {
        const contacts = getSelectedPhones();
        if (contacts.length === 0) return;

        contacts.forEach((c, i) => {
            const phone = `${c.pais_codigo}${c.phone}`.replace(/[^0-9+]/g, '').replace('+', '');
            const msg = encodeURIComponent(massMessage.replace('{nombre}', c.nombre));
            setTimeout(() => {
                window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
            }, i * 600);
        });

        setShowMessageModal(false);
        setMassMessage('');
    };

    // ─── Export CSV ───────────────────────────────────────────────────
    const exportCSV = (data, filename) => {
        if (!data.length) return;
        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map(row => headers.map(h => `"${(row[h] || '').toString().replace(/"/g, '""')}"`).join(','))
        ].join('\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // ─── Edit & Delete Handlers ────────────────────────────────────
    const openEdit = (type, data) => {
        setEditItem({ type, data });
        setEditForm({ ...data });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const saveEdit = async () => {
        if (!editItem) return;
        setActionLoading(true);
        try {
            const endpoint = editItem.type === 'registro'
                ? `${API_BASE}/registros/${editItem.data.id}`
                : `${API_BASE}/aliados/${editItem.data.id}`;
            const res = await fetch(endpoint, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });
            if (res.ok) {
                await fetchData();
                setEditItem(null);
            }
        } catch (err) {
            console.error('Error updating:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteItem) return;
        setActionLoading(true);
        try {
            const endpoint = deleteItem.type === 'registro'
                ? `${API_BASE}/registros/${deleteItem.id}`
                : `${API_BASE}/aliados/${deleteItem.id}`;
            const res = await fetch(endpoint, { method: 'DELETE' });
            if (res.ok) {
                await fetchData();
                setDeleteItem(null);
            }
        } catch (err) {
            console.error('Error deleting:', err);
        } finally {
            setActionLoading(false);
        }
    };

    // ─── Format Date ──────────────────────────────────────────────────
    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('es-MX', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    // ─── Metas CRUD ───────────────────────────────────────────────────
    const getProgressColor = (pct) => {
        if (pct <= 0) return { bar: '#6b7280', bg: '#374151', text: '#9ca3af' };
        if (pct < 25) return { bar: '#f59e0b', bg: '#78350f', text: '#fbbf24' };
        if (pct < 50) return { bar: '#f97316', bg: '#7c2d12', text: '#fb923c' };
        if (pct < 75) return { bar: '#22c55e', bg: '#14532d', text: '#4ade80' };
        if (pct < 100) return { bar: '#10b981', bg: '#064e3b', text: '#34d399' };
        return { bar: '#06b6d4', bg: '#164e63', text: '#22d3ee' };
    };

    const openMetaModal = (meta = null) => {
        if (meta) {
            setEditingMeta(meta);
            setMetaForm({ titulo: meta.titulo, categoria: meta.categoria, meta_objetivo: meta.meta_objetivo, meta_actual: meta.meta_actual, unidad: meta.unidad, descripcion: meta.descripcion || '' });
        } else {
            setEditingMeta(null);
            setMetaForm({ titulo: '', categoria: 'economica', meta_objetivo: '', meta_actual: '', unidad: '$', descripcion: '' });
        }
        setShowMetaModal(true);
    };

    const handleMetaFormChange = (e) => {
        const { name, value } = e.target;
        setMetaForm(prev => ({ ...prev, [name]: value }));
    };

    const saveMeta = async () => {
        if (!metaForm.titulo || !metaForm.meta_objetivo) return;
        setActionLoading(true);
        try {
            const url = editingMeta ? `${API_BASE}/metas/${editingMeta.id}` : `${API_BASE}/metas`;
            const method = editingMeta ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...metaForm, meta_objetivo: Number(metaForm.meta_objetivo), meta_actual: Number(metaForm.meta_actual || 0) })
            });
            if (res.ok) {
                await fetchData();
                setShowMetaModal(false);
            }
        } catch (err) {
            console.error('Error saving meta:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const updateMetaProgress = async (id, newValue) => {
        try {
            await fetch(`${API_BASE}/metas/${id}/progreso`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ meta_actual: Number(newValue) })
            });
            await fetchData();
        } catch (err) {
            console.error('Error updating progress:', err);
        }
    };

    const confirmDeleteMeta = async () => {
        if (!deleteMeta) return;
        setActionLoading(true);
        try {
            const res = await fetch(`${API_BASE}/metas/${deleteMeta.id}`, { method: 'DELETE' });
            if (res.ok) {
                await fetchData();
                setDeleteMeta(null);
            }
        } catch (err) {
            console.error('Error deleting meta:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const filteredMetas = metas.filter(m => metaCategoryFilter === 'all' || m.categoria === metaCategoryFilter);

    const metaStats = useMemo(() => {
        const byCategory = { economica: [], apoyo: [], trabajo: [] };
        metas.forEach(m => {
            if (byCategory[m.categoria]) byCategory[m.categoria].push(m);
        });
        const avgProgress = (arr) => arr.length ? arr.reduce((s, m) => s + (m.meta_objetivo > 0 ? (m.meta_actual / m.meta_objetivo) * 100 : 0), 0) / arr.length : 0;
        return {
            total: metas.length,
            completed: metas.filter(m => m.meta_objetivo > 0 && m.meta_actual >= m.meta_objetivo).length,
            avgAll: avgProgress(metas),
            economica: { count: byCategory.economica.length, avg: avgProgress(byCategory.economica) },
            apoyo: { count: byCategory.apoyo.length, avg: avgProgress(byCategory.apoyo) },
            trabajo: { count: byCategory.trabajo.length, avg: avgProgress(byCategory.trabajo) },
        };
    }, [metas]);

    // ═══════════════════════════════════════════════════════════════════
    // TABS CONFIG
    // ═══════════════════════════════════════════════════════════════════
    const tabs = [
        {
            id: 'registros', label: 'Registros', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            )
        },
        {
            id: 'contactos', label: 'Directorio & Mensajes', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            )
        },
        {
            id: 'estadisticas', label: 'Estadísticas', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            )
        },
        {
            id: 'metas', label: 'Metas', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
            )
        },
    ];

    // ═══════════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════════
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 text-white">
            {/* ── TOP BAR ─────────────────────────────────────────────── */}
            <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg">IS</div>
                            <div>
                                <h1 className="text-lg font-bold tracking-tight">Panel de Administración</h1>
                                <p className="text-xs text-gray-500">Iniciativa Sonora</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={fetchData} className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all" title="Refrescar datos">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        </button>
                        <button onClick={() => exportCSV(registros, 'registros')} className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-sm transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Exportar CSV
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                {/* ── TABS ────────────────────────────────────────────── */}
                <div className="flex gap-1 bg-gray-800/50 rounded-xl p-1 mb-6 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-sm whitespace-nowrap transition-all flex-1 justify-center
                                ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                }`}
                        >
                            {tab.icon}
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* ── LOADING ─────────────────────────────────────────── */}
                {loading && (
                    <div className="flex items-center justify-center py-32">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                            <p className="text-gray-400">Cargando datos...</p>
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════
                    TAB 1: REGISTROS
                ═══════════════════════════════════════════════════════ */}
                {!loading && activeTab === 'registros' && (
                    <div className="space-y-6 animate-fadeIn">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard icon="👥" label="Total Registros" value={stats.total} color="indigo" />
                            <StatCard icon="📅" label="Hoy" value={stats.todayCount} subtext={new Date().toLocaleDateString('es-MX')} color="green" />
                            <StatCard icon="📆" label="Esta Semana" value={stats.weekCount} color="amber" />
                            <StatCard icon="🤝" label="Aliados" value={stats.aliadosCount} color="blue" />
                        </div>

                        {/* Filters Bar */}
                        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-4 border border-gray-700/50">
                            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                                {/* Search */}
                                <div className="relative flex-1">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    <input
                                        type="text"
                                        placeholder="Buscar por nombre, email o teléfono..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {/* Date Filter */}
                                <select
                                    className="px-3 py-2.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                >
                                    <option value="all">📅 Todo el tiempo</option>
                                    <option value="today">📌 Hoy</option>
                                    <option value="week">📆 Esta semana</option>
                                    <option value="month">🗓️ Este mes</option>
                                    <option value="year">📊 Este año</option>
                                </select>

                                {/* Gender Filter */}
                                <select
                                    className="px-3 py-2.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
                                    value={genderFilter}
                                    onChange={(e) => setGenderFilter(e.target.value)}
                                >
                                    <option value="all">⚧ Todos</option>
                                    <option value="masculino">♂ Hombres</option>
                                    <option value="femenino">♀ Mujeres</option>
                                    <option value="otro">⚧ Otro</option>
                                </select>

                                {/* Sort */}
                                <select
                                    className="px-3 py-2.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="newest">🕐 Más recientes</option>
                                    <option value="oldest">🕰 Más antiguos</option>
                                    <option value="name">🔤 Por nombre</option>
                                </select>
                            </div>
                            <p className="text-gray-500 text-xs mt-2">{filteredRegistros.length} de {registros.length} registros</p>
                        </div>

                        {/* Table */}
                        <div className="bg-gray-800/50 backdrop-blur rounded-2xl border border-gray-700/50 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-700/50">
                                            <th className="text-left px-4 py-3 text-gray-400 font-medium">#</th>
                                            <th className="text-left px-4 py-3 text-gray-400 font-medium">Nombre</th>
                                            <th className="text-left px-4 py-3 text-gray-400 font-medium hidden md:table-cell">Email</th>
                                            <th className="text-left px-4 py-3 text-gray-400 font-medium">Celular</th>
                                            <th className="text-left px-4 py-3 text-gray-400 font-medium hidden lg:table-cell">Edad</th>
                                            <th className="text-left px-4 py-3 text-gray-400 font-medium hidden lg:table-cell">Sexo</th>
                                            <th className="text-left px-4 py-3 text-gray-400 font-medium hidden sm:table-cell">Fecha</th>
                                            <th className="text-right px-4 py-3 text-gray-400 font-medium">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRegistros.map((r, i) => (
                                            <tr key={r.id} className="border-b border-gray-800/50 hover:bg-gray-700/30 transition-colors">
                                                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                            {(r.nombre || '?')[0].toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium">{r.nombre}</p>
                                                            <p className="text-gray-500 text-xs md:hidden">{r.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-gray-300 hidden md:table-cell">{r.email}</td>
                                                <td className="px-4 py-3">
                                                    <a href={`https://wa.me/${(r.pais_codigo || '52').replace('+', '')}${r.celular}`}
                                                        target="_blank" rel="noreferrer"
                                                        className="text-green-400 hover:text-green-300 hover:underline transition-colors">
                                                        {r.pais_codigo} {r.celular}
                                                    </a>
                                                </td>
                                                <td className="px-4 py-3 text-gray-300 hidden lg:table-cell">{r.edad || '—'}</td>
                                                <td className="px-4 py-3 hidden lg:table-cell">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.sexo === 'Masculino' ? 'bg-blue-500/20 text-blue-400' :
                                                        r.sexo === 'Femenino' ? 'bg-pink-500/20 text-pink-400' :
                                                            'bg-gray-500/20 text-gray-400'
                                                        }`}>
                                                        {r.sexo || '—'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">{formatDate(r.fecha_registro)}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button
                                                            onClick={() => openEdit('registro', r)}
                                                            className="p-1.5 rounded-lg hover:bg-indigo-500/20 text-gray-500 hover:text-indigo-400 transition-all"
                                                            title="Editar"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteItem({ type: 'registro', id: r.id, name: r.nombre })}
                                                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all"
                                                            title="Eliminar"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredRegistros.length === 0 && (
                                            <tr>
                                                <td colSpan="8" className="text-center py-16 text-gray-500">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                                                        <p>No se encontraron registros</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ── Aliados Table ──────────────────────────────── */}
                        {aliados.length > 0 && (
                            <div className="bg-gray-800/50 backdrop-blur rounded-2xl border border-gray-700/50 overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-700/50 flex items-center justify-between">
                                    <h3 className="text-white font-bold flex items-center gap-2">
                                        <span className="text-lg">🤝</span> Aliados Registrados ({aliados.length})
                                    </h3>
                                    <button
                                        onClick={() => exportCSV(aliados, 'aliados')}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-xs transition-all"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        CSV
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-700/50">
                                                <th className="text-left px-4 py-3 text-gray-400 font-medium">#</th>
                                                <th className="text-left px-4 py-3 text-gray-400 font-medium">Empresa</th>
                                                <th className="text-left px-4 py-3 text-gray-400 font-medium hidden md:table-cell">Contacto</th>
                                                <th className="text-left px-4 py-3 text-gray-400 font-medium hidden md:table-cell">Email</th>
                                                <th className="text-left px-4 py-3 text-gray-400 font-medium">Teléfono</th>
                                                <th className="text-left px-4 py-3 text-gray-400 font-medium hidden lg:table-cell">Mensaje</th>
                                                <th className="text-left px-4 py-3 text-gray-400 font-medium hidden sm:table-cell">Fecha</th>
                                                <th className="text-right px-4 py-3 text-gray-400 font-medium">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {aliados.map((a, i) => (
                                                <tr key={a.id} className="border-b border-gray-800/50 hover:bg-gray-700/30 transition-colors">
                                                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                                {(a.empresa || '?')[0].toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="text-white font-medium">{a.empresa}</p>
                                                                <p className="text-gray-500 text-xs md:hidden">{a.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-300 hidden md:table-cell">{a.contacto || '—'}</td>
                                                    <td className="px-4 py-3 text-gray-300 hidden md:table-cell">{a.email}</td>
                                                    <td className="px-4 py-3">
                                                        {a.telefono ? (
                                                            <a href={`https://wa.me/52${a.telefono}`}
                                                                target="_blank" rel="noreferrer"
                                                                className="text-green-400 hover:text-green-300 hover:underline transition-colors">
                                                                {a.telefono}
                                                            </a>
                                                        ) : '—'}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell max-w-xs truncate">{a.mensaje || '—'}</td>
                                                    <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">{formatDate(a.fecha_registro)}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <button
                                                                onClick={() => openEdit('aliado', a)}
                                                                className="p-1.5 rounded-lg hover:bg-indigo-500/20 text-gray-500 hover:text-indigo-400 transition-all"
                                                                title="Editar"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteItem({ type: 'aliado', id: a.id, name: a.empresa })}
                                                                className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all"
                                                                title="Eliminar"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════
                    TAB 2: DIRECTORIO & MENSAJES
                ═══════════════════════════════════════════════════════ */}
                {!loading && activeTab === 'contactos' && (
                    <div className="space-y-6 animate-fadeIn">
                        {/* Actions Bar */}
                        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-4 border border-gray-700/50 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div className="flex-1">
                                <h2 className="text-white font-bold text-lg">Directorio de Contactos</h2>
                                <p className="text-gray-500 text-sm">{selectedContacts.size} contactos seleccionados</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => exportCSV([...registros, ...aliados], 'contactos')}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-sm transition-all"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    CSV
                                </button>
                                <button
                                    onClick={() => selectedContacts.size > 0 && setShowMessageModal(true)}
                                    disabled={selectedContacts.size === 0}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.555 4.122 1.527 5.854L.065 23.495a.5.5 0 00.607.607l5.641-1.462A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.384-1.573l-.386-.229-3.347.868.886-3.236-.251-.399A9.94 9.94 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /></svg>
                                    WhatsApp Masivo ({selectedContacts.size})
                                </button>
                            </div>
                        </div>

                        {/* Registros Section */}
                        <div className="bg-gray-800/50 backdrop-blur rounded-2xl border border-gray-700/50 overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-700/50 flex items-center justify-between">
                                <h3 className="text-white font-bold flex items-center gap-2">
                                    <span className="text-lg">👥</span> Registros ({registros.length})
                                </h3>
                                <button
                                    onClick={() => handleSelectAll(registros)}
                                    className="text-xs text-indigo-400 hover:text-indigo-300"
                                >
                                    {selectAll ? 'Deseleccionar todos' : 'Seleccionar todos'}
                                </button>
                            </div>
                            <div className="overflow-x-auto max-h-96 overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead className="sticky top-0 bg-gray-800">
                                        <tr className="border-b border-gray-700/50">
                                            <th className="px-4 py-2 w-10"></th>
                                            <th className="text-left px-4 py-2 text-gray-400 font-medium">Nombre</th>
                                            <th className="text-left px-4 py-2 text-gray-400 font-medium hidden md:table-cell">Email</th>
                                            <th className="text-left px-4 py-2 text-gray-400 font-medium">Celular</th>
                                            <th className="text-left px-4 py-2 text-gray-400 font-medium hidden lg:table-cell">País</th>
                                            <th className="text-left px-4 py-2 text-gray-400 font-medium hidden sm:table-cell">Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {registros.map((r) => (
                                            <tr key={`reg-${r.id}`} className={`border-b border-gray-800/50 hover:bg-gray-700/30 transition-colors ${selectedContacts.has(r.id) ? 'bg-indigo-500/10' : ''}`}>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedContacts.has(r.id)}
                                                        onChange={() => handleToggleContact(r.id)}
                                                        className="w-4 h-4 rounded border-gray-600 text-indigo-500 focus:ring-indigo-500 bg-gray-700 cursor-pointer"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-white font-medium">{r.nombre}</td>
                                                <td className="px-4 py-2 text-gray-300 hidden md:table-cell">{r.email}</td>
                                                <td className="px-4 py-2">
                                                    <a href={`https://wa.me/${(r.pais_codigo || '52').replace('+', '')}${r.celular}`}
                                                        target="_blank" rel="noreferrer"
                                                        className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-1">
                                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                                                        {r.pais_codigo} {r.celular}
                                                    </a>
                                                </td>
                                                <td className="px-4 py-2 text-gray-400 hidden lg:table-cell">{r.pais_codigo === '+52' ? '🇲🇽' : '🌎'} {r.pais_codigo}</td>
                                                <td className="px-4 py-2 text-gray-500 text-xs hidden sm:table-cell">{formatDate(r.fecha_registro)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Aliados Section */}
                        <div className="bg-gray-800/50 backdrop-blur rounded-2xl border border-gray-700/50 overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-700/50">
                                <h3 className="text-white font-bold flex items-center gap-2">
                                    <span className="text-lg">🤝</span> Aliados / Empresas ({aliados.length})
                                </h3>
                            </div>
                            <div className="overflow-x-auto max-h-80 overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead className="sticky top-0 bg-gray-800">
                                        <tr className="border-b border-gray-700/50">
                                            <th className="px-4 py-2 w-10"></th>
                                            <th className="text-left px-4 py-2 text-gray-400 font-medium">Empresa</th>
                                            <th className="text-left px-4 py-2 text-gray-400 font-medium hidden md:table-cell">Contacto</th>
                                            <th className="text-left px-4 py-2 text-gray-400 font-medium hidden md:table-cell">Email</th>
                                            <th className="text-left px-4 py-2 text-gray-400 font-medium">Teléfono</th>
                                            <th className="text-left px-4 py-2 text-gray-400 font-medium hidden lg:table-cell">Mensaje</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {aliados.map((a) => (
                                            <tr key={`ali-${a.id}`} className={`border-b border-gray-800/50 hover:bg-gray-700/30 transition-colors ${selectedContacts.has(a.id) ? 'bg-indigo-500/10' : ''}`}>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedContacts.has(a.id)}
                                                        onChange={() => handleToggleContact(a.id)}
                                                        className="w-4 h-4 rounded border-gray-600 text-indigo-500 focus:ring-indigo-500 bg-gray-700 cursor-pointer"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-white font-medium">{a.empresa}</td>
                                                <td className="px-4 py-2 text-gray-300 hidden md:table-cell">{a.contacto}</td>
                                                <td className="px-4 py-2 text-gray-300 hidden md:table-cell">{a.email}</td>
                                                <td className="px-4 py-2">
                                                    <a href={`https://wa.me/52${a.telefono}`} target="_blank" rel="noreferrer" className="text-green-400 hover:text-green-300 transition-colors">
                                                        {a.telefono}
                                                    </a>
                                                </td>
                                                <td className="px-4 py-2 text-gray-500 text-xs hidden lg:table-cell max-w-xs truncate">{a.mensaje || '—'}</td>
                                            </tr>
                                        ))}
                                        {aliados.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="text-center py-12 text-gray-500">No hay aliados registrados aún</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════
                    TAB 3: ESTADÍSTICAS
                ═══════════════════════════════════════════════════════ */}
                {!loading && activeTab === 'estadisticas' && (
                    <div className="space-y-6 animate-fadeIn">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <StatCard icon="👥" label="Total Registros" value={stats.total} color="indigo" />
                            <StatCard icon="📅" label="Hoy" value={stats.todayCount} color="green" />
                            <StatCard icon="📆" label="Esta Semana" value={stats.weekCount} color="amber" />
                            <StatCard icon="🤝" label="Aliados" value={stats.aliadosCount} color="blue" />
                            <StatCard icon="🌎" label="Internacionales" value={stats.origin.filter(o => !o.label.includes('+52')).reduce((s, o) => s + o.value, 0)} subtext="Migrantes" color="rose" />
                        </div>

                        {/* Charts Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <DonutChart data={stats.gender} title="📊 Distribución por Género" />
                            <DonutChart data={stats.origin} title="🌎 Origen / Migrantes" />
                            <BarChart data={stats.ageGroups} title="📈 Distribución por Edad" colorFrom="#f59e0b" colorTo="#ef4444" />
                            <BarChart data={stats.monthly} title="📅 Registros por Mes" colorFrom="#6366f1" colorTo="#8b5cf6" />
                        </div>

                        {/* Historical Timeline */}
                        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700/50">
                            <h3 className="text-white font-bold text-lg mb-4">📋 Histórico de Registros</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {stats.monthly.slice(-8).map((m, i) => (
                                    <div key={i} className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30 hover:border-indigo-500/50 transition-all">
                                        <p className="text-gray-400 text-sm capitalize">{m.label}</p>
                                        <p className="text-2xl font-bold text-white mt-1">{m.value}</p>
                                        <div className="w-full bg-gray-700/50 rounded-full h-1.5 mt-2">
                                            <div
                                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-1000"
                                                style={{ width: `${(m.value / Math.max(...stats.monthly.map(x => x.value), 1)) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════
                    TAB 4: METAS
                ═══════════════════════════════════════════════════════ */}
                {!loading && activeTab === 'metas' && (
                    <div className="space-y-6 animate-fadeIn">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <StatCard icon="🎯" label="Total Metas" value={metaStats.total} color="indigo" />
                            <StatCard icon="✅" label="Completadas" value={metaStats.completed} color="green" />
                            <StatCard icon="💰" label="Económicas" value={metaStats.economica.count} subtext={`${metaStats.economica.avg.toFixed(0)}% prom.`} color="amber" />
                            <StatCard icon="🤝" label="Apoyo" value={metaStats.apoyo.count} subtext={`${metaStats.apoyo.avg.toFixed(0)}% prom.`} color="blue" />
                            <StatCard icon="⚡" label="Trabajo" value={metaStats.trabajo.count} subtext={`${metaStats.trabajo.avg.toFixed(0)}% prom.`} color="rose" />
                        </div>

                        {/* Overall Progress Ring */}
                        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700/50">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="relative w-36 h-36 flex-shrink-0">
                                    <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
                                        <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#374151" strokeWidth="4" />
                                        <circle cx="21" cy="21" r="15.9" fill="transparent"
                                            stroke={getProgressColor(metaStats.avgAll).bar}
                                            strokeWidth="4"
                                            strokeDasharray={`${metaStats.avgAll} ${100 - metaStats.avgAll}`}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <span className="text-3xl font-bold" style={{ color: getProgressColor(metaStats.avgAll).text }}>{metaStats.avgAll.toFixed(0)}%</span>
                                            <span className="block text-xs text-gray-400">Promedio</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-3 w-full">
                                    {[{ key: 'economica', label: '💰 Económicas', data: metaStats.economica },
                                    { key: 'apoyo', label: '🤝 Apoyo', data: metaStats.apoyo },
                                    { key: 'trabajo', label: '⚡ Trabajo', data: metaStats.trabajo }].map(cat => {
                                        const clr = getProgressColor(cat.data.avg);
                                        return (
                                            <div key={cat.key}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-300">{cat.label}</span>
                                                    <span className="font-bold" style={{ color: clr.text }}>{cat.data.avg.toFixed(0)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                                                    <div className="h-full rounded-full transition-all duration-1000 ease-out"
                                                        style={{ width: `${Math.max(cat.data.avg, 2)}%`, backgroundColor: clr.bar }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Actions Bar */}
                        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-4 border border-gray-700/50 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div className="flex-1 flex items-center gap-3">
                                <select
                                    className="px-3 py-2.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
                                    value={metaCategoryFilter}
                                    onChange={(e) => setMetaCategoryFilter(e.target.value)}
                                >
                                    <option value="all">🎯 Todas las categorías</option>
                                    <option value="economica">💰 Económicas</option>
                                    <option value="apoyo">🤝 Apoyo</option>
                                    <option value="trabajo">⚡ Trabajo</option>
                                </select>
                                <span className="text-gray-500 text-sm">{filteredMetas.length} metas</span>
                            </div>
                            <button
                                onClick={() => openMetaModal()}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-500/20"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                Nueva Meta
                            </button>
                        </div>

                        {/* Metas Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredMetas.map((meta) => {
                                const pct = meta.meta_objetivo > 0 ? Math.min((meta.meta_actual / meta.meta_objetivo) * 100, 100) : 0;
                                const clr = getProgressColor(pct);
                                const catIcons = { economica: '💰', apoyo: '🤝', trabajo: '⚡' };
                                const catLabels = { economica: 'Económica', apoyo: 'Apoyo', trabajo: 'Trabajo' };
                                const isComplete = pct >= 100;
                                return (
                                    <div key={meta.id} className={`bg-gray-800/50 backdrop-blur rounded-2xl border transition-all hover:border-gray-600 overflow-hidden ${isComplete ? 'border-emerald-500/50' : 'border-gray-700/50'}`}>
                                        <div className="p-5">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: clr.bg }}>
                                                        {catIcons[meta.categoria] || '🎯'}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-bold">{meta.titulo}</h4>
                                                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: clr.bg, color: clr.text }}>{catLabels[meta.categoria] || meta.categoria}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button onClick={() => openMetaModal(meta)} className="p-1.5 rounded-lg hover:bg-indigo-500/20 text-gray-500 hover:text-indigo-400 transition-all" title="Editar">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    </button>
                                                    <button onClick={() => setDeleteMeta(meta)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all" title="Eliminar">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </div>
                                            </div>

                                            {meta.descripcion && (
                                                <p className="text-gray-500 text-sm mb-4">{meta.descripcion}</p>
                                            )}

                                            {/* Progress */}
                                            <div className="mb-3">
                                                <div className="flex justify-between items-end mb-2">
                                                    <div>
                                                        <span className="text-2xl font-bold" style={{ color: clr.text }}>
                                                            {meta.unidad === '$' ? `$${meta.meta_actual.toLocaleString()}` : meta.meta_actual.toLocaleString()}
                                                        </span>
                                                        <span className="text-gray-500 text-sm ml-1">
                                                            / {meta.unidad === '$' ? `$${meta.meta_objetivo.toLocaleString()}` : meta.meta_objetivo.toLocaleString()} {meta.unidad !== '$' ? meta.unidad : ''}
                                                        </span>
                                                    </div>
                                                    <span className="text-xl font-bold" style={{ color: clr.text }}>{pct.toFixed(0)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-700/50 rounded-full h-4 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-1000 ease-out relative"
                                                        style={{ width: `${Math.max(pct, 1)}%`, backgroundColor: clr.bar }}
                                                    >
                                                        {pct > 15 && (
                                                            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">{pct.toFixed(0)}%</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quick Progress Update */}
                                            <div className="flex items-center gap-2 pt-2 border-t border-gray-700/30">
                                                <span className="text-gray-500 text-xs">Actualizar:</span>
                                                <input
                                                    type="number"
                                                    defaultValue={meta.meta_actual}
                                                    onBlur={(e) => {
                                                        const val = Number(e.target.value);
                                                        if (val !== meta.meta_actual) updateMetaProgress(meta.id, val);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.target.blur();
                                                        }
                                                    }}
                                                    className="flex-1 px-2 py-1 rounded-lg bg-gray-900/50 border border-gray-700 text-white text-sm focus:outline-none focus:border-indigo-500 max-w-[120px]"
                                                />
                                                <span className="text-gray-600 text-xs">{meta.unidad !== '$' ? meta.unidad : 'MXN'}</span>
                                                {isComplete && (
                                                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">✓ Completada</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {filteredMetas.length === 0 && (
                            <div className="bg-gray-800/50 backdrop-blur rounded-2xl border border-gray-700/50 p-16 text-center">
                                <div className="flex flex-col items-center gap-3">
                                    <span className="text-5xl">🎯</span>
                                    <h3 className="text-white font-bold text-lg">No hay metas registradas</h3>
                                    <p className="text-gray-500">Crea tu primera meta para empezar a medir el progreso</p>
                                    <button onClick={() => openMetaModal()} className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm transition-all hover:from-indigo-600 hover:to-purple-700">
                                        + Nueva Meta
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ═══════════════════════════════════════════════════════
                MASS MESSAGE MODAL
            ═══════════════════════════════════════════════════════ */}
            {showMessageModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowMessageModal(false)}>
                    <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg border border-gray-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">Mensaje Masivo por WhatsApp</h3>
                                    <p className="text-gray-500 text-sm">{selectedContacts.size} destinatarios</p>
                                </div>
                            </div>
                            <button onClick={() => setShowMessageModal(false)} className="text-gray-500 hover:text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-gray-400 text-sm mb-2 block">Mensaje (usa <code className="bg-gray-700 px-1 rounded text-indigo-400">{'{nombre}'}</code> para personalizar)</label>
                                <textarea
                                    rows="5"
                                    className="w-full rounded-xl bg-gray-900 border border-gray-700 text-white p-4 focus:outline-none focus:border-green-500 resize-none text-sm"
                                    placeholder="Hola {nombre}, te invitamos a nuestro próximo evento..."
                                    value={massMessage}
                                    onChange={(e) => setMassMessage(e.target.value)}
                                />
                            </div>

                            <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-700/50">
                                <p className="text-xs text-gray-500 mb-2">Vista previa:</p>
                                <p className="text-gray-300 text-sm">
                                    {massMessage.replace('{nombre}', 'Juan') || '(Escribe un mensaje arriba)'}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowMessageModal(false)}
                                    className="flex-1 px-4 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-sm transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={sendWhatsAppMessages}
                                    disabled={!massMessage.trim()}
                                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-sm transition-all disabled:opacity-40 shadow-lg shadow-green-500/20"
                                >
                                    Enviar a {selectedContacts.size} contactos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════
                EDIT MODAL
            ═══════════════════════════════════════════════════════ */}
            {editItem && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditItem(null)}>
                    <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg border border-gray-700 shadow-2xl animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">Editar {editItem.type === 'registro' ? 'Registro' : 'Aliado'}</h3>
                                    <p className="text-gray-500 text-sm">ID: {editItem.data.id}</p>
                                </div>
                            </div>
                            <button onClick={() => setEditItem(null)} className="text-gray-500 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                            {editItem.type === 'registro' ? (
                                <>
                                    <div>
                                        <label className="text-gray-400 text-xs mb-1 block">Nombre</label>
                                        <input name="nombre" value={editForm.nombre || ''} onChange={handleEditChange}
                                            className="w-full rounded-xl bg-gray-900 border border-gray-700 text-white px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-gray-400 text-xs mb-1 block">Email</label>
                                            <input name="email" value={editForm.email || ''} onChange={handleEditChange}
                                                className="w-full rounded-xl bg-gray-900 border border-gray-700 text-white px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-gray-400 text-xs mb-1 block">Celular</label>
                                            <input name="celular" value={editForm.celular || ''} onChange={handleEditChange}
                                                className="w-full rounded-xl bg-gray-900 border border-gray-700 text-white px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="text-gray-400 text-xs mb-1 block">País</label>
                                            <input name="pais_codigo" value={editForm.pais_codigo || ''} onChange={handleEditChange}
                                                className="w-full rounded-xl bg-gray-900 border border-gray-700 text-white px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-gray-400 text-xs mb-1 block">Edad</label>
                                            <input name="edad" type="number" value={editForm.edad || ''} onChange={handleEditChange}
                                                className="w-full rounded-xl bg-gray-900 border border-gray-700 text-white px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-gray-400 text-xs mb-1 block">Sexo</label>
                                            <select name="sexo" value={editForm.sexo || ''} onChange={handleEditChange}
                                                className="w-full rounded-xl bg-gray-900 border border-gray-700 text-white px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm">
                                                <option value="">—</option>
                                                <option value="Hambre">Hombre</option>
                                                <option value="Mujer">Mujer</option>
                                                <option value="Otro">Otro</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-gray-400 text-xs mb-1 block">Comentarios</label>
                                        <textarea name="comentarios" value={editForm.comentarios || ''} onChange={handleEditChange} rows="3"
                                            className="w-full rounded-xl bg-gray-900 border border-gray-700 text-white px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm resize-none" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="text-gray-400 text-xs mb-1 block">Empresa</label>
                                        <input name="empresa" value={editForm.empresa || ''} onChange={handleEditChange}
                                            className="w-full rounded-xl bg-gray-900 border border-gray-700 text-white px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-gray-400 text-xs mb-1 block">Contacto</label>
                                            <input name="contacto" value={editForm.contacto || ''} onChange={handleEditChange}
                                                className="w-full rounded-xl bg-gray-900 border border-gray-700 text-white px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-gray-400 text-xs mb-1 block">Email</label>
                                            <input name="email" value={editForm.email || ''} onChange={handleEditChange}
                                                className="w-full rounded-xl bg-gray-900 border border-gray-700 text-white px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-gray-400 text-xs mb-1 block">Teléfono</label>
                                        <input name="telefono" value={editForm.telefono || ''} onChange={handleEditChange}
                                            className="w-full rounded-xl bg-gray-900 border border-gray-700 text-white px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-gray-400 text-xs mb-1 block">Mensaje</label>
                                        <textarea name="mensaje" value={editForm.mensaje || ''} onChange={handleEditChange} rows="3"
                                            className="w-full rounded-xl bg-gray-900 border border-gray-700 text-white px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm resize-none" />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setEditItem(null)}
                                className="flex-1 px-4 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-sm transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={saveEdit}
                                disabled={actionLoading}
                                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20"
                            >
                                {actionLoading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════
                DELETE CONFIRMATION MODAL
            ═══════════════════════════════════════════════════════ */}
            {deleteItem && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteItem(null)}>
                    <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700 shadow-2xl animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </div>
                            <h3 className="text-white font-bold text-xl mb-2">¿Eliminar {deleteItem.type === 'registro' ? 'registro' : 'aliado'}?</h3>
                            <p className="text-gray-400 mb-1">Estás a punto de eliminar permanentemente:</p>
                            <p className="text-white font-bold text-lg mb-4">"{deleteItem.name}"</p>
                            <p className="text-red-400/80 text-sm mb-6">⚠️ Esta acción no se puede deshacer</p>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setDeleteItem(null)}
                                    className="flex-1 px-4 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-sm transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={actionLoading}
                                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-red-500/20"
                                >
                                    {actionLoading ? 'Eliminando...' : 'Sí, Eliminar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════
                META CREATE/EDIT MODAL
            ═══════════════════════════════════════════════════════ */}
            {showMetaModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowMetaModal(false)}>
                    <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg border border-gray-700 shadow-2xl animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                    <span className="text-xl">🎯</span>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">{editingMeta ? 'Editar Meta' : 'Nueva Meta'}</h3>
                                    <p className="text-gray-500 text-sm">{editingMeta ? `ID: ${editingMeta.id}` : 'Establece un objetivo medible'}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowMetaModal(false)} className="text-gray-500 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-gray-400 text-xs mb-1 block">Título de la meta *</label>
                                <input name="titulo" value={metaForm.titulo} onChange={handleMetaFormChange} placeholder="Ej: Recaudación para evento benéfico"
                                    className="w-full rounded-xl bg-gray-900 border border-gray-700 text-white px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm placeholder-gray-600" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-gray-400 text-xs mb-1 block">Categoría</label>
                                    <select name="categoria" value={metaForm.categoria} onChange={handleMetaFormChange}
                                        className="w-full rounded-xl bg-gray-900 border border-gray-700 text-white px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm">
                                        <option value="economica">💰 Económica</option>
                                        <option value="apoyo">🤝 Apoyo</option>
                                        <option value="trabajo">⚡ Trabajo</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-gray-400 text-xs mb-1 block">Unidad de medida</label>
                                    <select name="unidad" value={metaForm.unidad} onChange={handleMetaFormChange}
                                        className="w-full rounded-xl bg-gray-900 border border-gray-700 text-white px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm">
                                        <option value="$">$ Dinero (MXN)</option>
                                        <option value="personas">Personas</option>
                                        <option value="horas">Horas</option>
                                        <option value="tareas">Tareas</option>
                                        <option value="eventos">Eventos</option>
                                        <option value="unidades">Unidades</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-gray-400 text-xs mb-1 block">Meta objetivo *</label>
                                    <input name="meta_objetivo" type="number" value={metaForm.meta_objetivo} onChange={handleMetaFormChange} placeholder="1000"
                                        className="w-full rounded-xl bg-gray-900 border border-gray-700 text-white px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm placeholder-gray-600" />
                                </div>
                                <div>
                                    <label className="text-gray-400 text-xs mb-1 block">Avance actual</label>
                                    <input name="meta_actual" type="number" value={metaForm.meta_actual} onChange={handleMetaFormChange} placeholder="0"
                                        className="w-full rounded-xl bg-gray-900 border border-gray-700 text-white px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm placeholder-gray-600" />
                                </div>
                            </div>
                            <div>
                                <label className="text-gray-400 text-xs mb-1 block">Descripción (opcional)</label>
                                <textarea name="descripcion" value={metaForm.descripcion} onChange={handleMetaFormChange} rows="2" placeholder="Describe el propósito de esta meta..."
                                    className="w-full rounded-xl bg-gray-900 border border-gray-700 text-white px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm resize-none placeholder-gray-600" />
                            </div>

                            {/* Preview */}
                            {metaForm.meta_objetivo > 0 && (
                                <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-700/50">
                                    <p className="text-xs text-gray-500 mb-2">Vista previa:</p>
                                    {(() => {
                                        const pct = metaForm.meta_objetivo > 0 ? Math.min((Number(metaForm.meta_actual || 0) / Number(metaForm.meta_objetivo)) * 100, 100) : 0;
                                        const clr = getProgressColor(pct);
                                        return (
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-300">{metaForm.titulo || 'Sin título'}</span>
                                                    <span className="font-bold" style={{ color: clr.text }}>{pct.toFixed(0)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                                                    <div className="h-full rounded-full transition-all duration-500 ease-out"
                                                        style={{ width: `${Math.max(pct, 2)}%`, backgroundColor: clr.bar }} />
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowMetaModal(false)}
                                className="flex-1 px-4 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-sm transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={saveMeta}
                                disabled={actionLoading || !metaForm.titulo || !metaForm.meta_objetivo}
                                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20"
                            >
                                {actionLoading ? 'Guardando...' : (editingMeta ? 'Guardar Cambios' : 'Crear Meta')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════
                META DELETE CONFIRMATION
            ═══════════════════════════════════════════════════════ */}
            {deleteMeta && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteMeta(null)}>
                    <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700 shadow-2xl animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </div>
                            <h3 className="text-white font-bold text-xl mb-2">¿Eliminar meta?</h3>
                            <p className="text-gray-400 mb-1">Estás a punto de eliminar permanentemente:</p>
                            <p className="text-white font-bold text-lg mb-4">"{deleteMeta.titulo}"</p>
                            <p className="text-red-400/80 text-sm mb-6">⚠️ Esta acción no se puede deshacer</p>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setDeleteMeta(null)}
                                    className="flex-1 px-4 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-sm transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDeleteMeta}
                                    disabled={actionLoading}
                                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-red-500/20"
                                >
                                    {actionLoading ? 'Eliminando...' : 'Sí, Eliminar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── CUSTOM STYLES ───────────────────────────────────────── */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out;
                }
                /* Custom scrollbar */
                .overflow-y-auto::-webkit-scrollbar {
                    width: 6px;
                }
                .overflow-y-auto::-webkit-scrollbar-track {
                    background: transparent;
                }
                .overflow-y-auto::-webkit-scrollbar-thumb {
                    background: #4b5563;
                    border-radius: 3px;
                }
                .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                    background: #6b7280;
                }
                /* Fix select option background for dark theme */
                select option {
                    background: #1f2937;
                    color: white;
                }
            `}</style>
        </div>
    );
};

export default Admin;
