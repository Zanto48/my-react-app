import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../contexts/ThemeContext'; // Import Tema
import { healthAPI, remindersAPI } from '../services/api'; // Import API
import {
    Heart, Activity, Bell, LogOut, Sun, Moon, 
    CheckCircle, AlertTriangle, Plus, Clock, Smile, Frown, Meh,
    Brain, Utensils, Users, ChevronRight, Droplets, Coffee, Dumbbell
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    
    // State Data
    const [stats, setStats] = useState({ healthScore: 0, bmi: 0, bmiCategory: '-', mood: 'neutral' });
    const [graphData, setGraphData] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load Data saat aplikasi dibuka
    useEffect(() => {
        const loadAllData = async () => {
            try {
                // Ambil data dashboard
                const dashRes = await healthAPI.getDashboard();
                setStats(dashRes.data.data);

                // Ambil data grafik
                const graphRes = await healthAPI.getGraph();
                setGraphData(graphRes.data.data);

                // Ambil data pengingat
                const remRes = await remindersAPI.getAll();
                setReminders(remRes.data.data);
            } catch (error) {
                console.error("Error loading data", error);
            } finally {
                setLoading(false);
            }
        };
        loadAllData();
    }, []);

    const handleToggleReminder = async (id) => {
        // Update UI duluan biar cepat (Optimistic Update)
        setReminders(prev => prev.map(r => r.id === id ? { ...r, is_active: !r.is_active } : r));
        // Simpan ke storage
        await remindersAPI.toggle(id);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const getDisplayName = () => user?.user_metadata?.full_name || 'User';

    // Helper Styles & Icons
    const getScoreColor = (score) => score >= 80 ? '#10b981' : score > 0 ? '#f59e0b' : '#64748b';
    const getMoodIcon = (mood) => {
        if (mood === 'happy') return <Smile className="mood-icon happy" />;
        if (mood === 'sad') return <Frown className="mood-icon sad" />;
        return <Meh className="mood-icon neutral" />;
    };
    const getReminderIcon = (type) => {
        if(type === 'water') return Droplets;
        if(type === 'exercise') return Dumbbell;
        if(type === 'meal') return Coffee;
        return Bell;
    };

    if (loading) return <div style={{padding: 50, textAlign: 'center'}}>Memuat Dashboard...</div>;

    return (
        <div className="dashboard" style={{ minHeight: '100vh', transition: 'background 0.3s' }}>
            <nav className="dashboard-nav" style={{ background: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)' }}>
                <div className="nav-brand">
                    <Heart className="nav-logo" color="#10b981" fill="#10b981" />
                    <span>Live for Health</span>
                </div>
                <div className="nav-user">
                    <button className="theme-toggle-btn" onClick={toggleTheme} style={{ color: isDark ? '#fff' : '#333' }}>
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <Link to="/profile" className="profile-link" style={{ color: isDark ? '#fff' : '#333' }}>
                        <span>Halo, {getDisplayName()}</span>
                    </Link>
                    <button className="logout-btn" onClick={handleLogout} style={{ color: '#ef4444' }}>
                        <LogOut size={18} />
                    </button>
                </div>
            </nav>

            <div className="dashboard-content">
                <header className="dashboard-header">
                    <div>
                        <h1>🌿 Dashboard Kesehatan</h1>
                        <p>Pantau kesehatan fisik & mental Anda setiap hari</p>
                    </div>
                    <div className="header-actions">
                        <Link to="/health/add" className="add-btn">
                            <Plus size={20} /> Tambah Data
                        </Link>
                    </div>
                </header>

                {/* STATS */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: getScoreColor(stats.health_score) }}><Heart /></div>
                        <div className="stat-info">
                            <span className="stat-label">Skor Kesehatan</span>
                            <span className="stat-value" style={{ color: getScoreColor(stats.health_score) }}>{stats.health_score}</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#3b82f6' }}><Activity /></div>
                        <div className="stat-info">
                            <span className="stat-label">BMI</span>
                            <span className="stat-value">{stats.bmi}</span>
                            <span className="stat-category">{stats.bmi_category}</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#8b5cf6' }}>{getMoodIcon(stats.mood)}</div>
                        <div className="stat-info">
                            <span className="stat-label">Mood</span>
                            <span className="stat-value" style={{textTransform: 'capitalize'}}>{stats.mood}</span>
                        </div>
                    </div>
                </div>

                {/* CHART */}
                <div className="charts-section">
                    <div className="chart-card wide">
                        <h3><Activity size={20} style={{marginRight: 10}}/> Grafik Berat Badan</h3>
                        <div style={{ width: '100%', height: 250, marginTop: 20 }}>
                            {graphData.length > 0 ? (
                                <ResponsiveContainer>
                                    <AreaChart data={graphData}>
                                        <defs>
                                            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="date" stroke="#94a3b8" />
                                        <YAxis domain={['auto', 'auto']} stroke="#94a3b8" />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                                        <Area type="monotone" dataKey="weight" stroke="#10b981" fillOpacity={1} fill="url(#colorWeight)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="empty-chart">Belum ada data. Klik "Tambah Data" untuk memulai.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* REMINDERS */}
                <div className="dashboard-grid">
                    <div className="reminders-card">
                        <div className="card-header">
                            <h3><Bell size={20} /> Pengingat Hari Ini</h3>
                        </div>
                        <div className="reminders-list">
                            {reminders.map(r => {
                                const Icon = getReminderIcon(r.type);
                                return (
                                    <div key={r.id} className={`reminder-item ${!r.is_active ? 'done' : ''}`} onClick={() => handleToggleReminder(r.id)}>
                                        <div className="reminder-check">{!r.is_active ? <CheckCircle color="#10b981"/> : <div className="check-circle"/>}</div>
                                        <Icon className="reminder-type-icon" size={18}/>
                                        <span className="reminder-label">{r.label}</span>
                                        <span className="reminder-time"><Clock size={12}/> {r.time}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;