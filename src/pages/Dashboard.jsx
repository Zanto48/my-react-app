import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { healthAPI, symptomsAPI } from '../services/api';
import {
    Heart, Activity, Utensils, Dumbbell, Users, Brain,
    TrendingUp, AlertCircle, Calendar, LogOut, Plus, ChevronRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);
    const [graphData, setGraphData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const [dashRes, graphRes] = await Promise.all([
                healthAPI.getDashboard(),
                healthAPI.getGraph('week'),
            ]);
            setDashboard(dashRes.data.data);
            setGraphData(graphRes.data.data || []);
        } catch (err) {
            console.error('Failed to load dashboard:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getBMIColor = (category) => {
        switch (category) {
            case 'Underweight': return '#ed8936';
            case 'Normal': return '#48bb78';
            case 'Overweight': return '#ed8936';
            case 'Obese': return '#f56565';
            default: return '#a0aec0';
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return '#48bb78';
        if (score >= 60) return '#ed8936';
        return '#f56565';
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <Heart className="loading-icon" />
                <p>Memuat dashboard...</p>
            </div>
        );
    }

    const bmi = dashboard?.latest_health?.bmi || 0;
    const bmiCategory = dashboard?.bmi_category || 'Unknown';
    const healthScore = dashboard?.health_score || 0;

    return (
        <div className="dashboard">
            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <Heart className="nav-logo" />
                    <span>HealthTracker</span>
                </div>
                <div className="nav-user">
                    <span>Halo, {user?.name || 'User'}</span>
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={18} />
                    </button>
                </div>
            </nav>

            <div className="dashboard-content">
                <header className="dashboard-header">
                    <div>
                        <h1>Dashboard Kesehatan</h1>
                        <p>Pantau kesehatan Anda setiap hari</p>
                    </div>
                    <Link to="/health/add" className="add-btn">
                        <Plus size={20} /> Tambah Data
                    </Link>
                </header>

                <div className="stats-grid">
                    <div className="stat-card health-score">
                        <div className="stat-icon" style={{ background: getScoreColor(healthScore) }}>
                            <Heart />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Skor Kesehatan</span>
                            <span className="stat-value" style={{ color: getScoreColor(healthScore) }}>
                                {healthScore}
                            </span>
                        </div>
                    </div>

                    <div className="stat-card bmi-card">
                        <div className="stat-icon" style={{ background: getBMIColor(bmiCategory) }}>
                            <Activity />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">BMI</span>
                            <span className="stat-value">{bmi.toFixed(1)}</span>
                            <span className="stat-category" style={{ color: getBMIColor(bmiCategory) }}>
                                {bmiCategory}
                            </span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <TrendingUp />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Total Record</span>
                            <span className="stat-value">{dashboard?.total_records || 0}</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon symptoms-icon">
                            <AlertCircle />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Gejala Minggu Ini</span>
                            <span className="stat-value">{dashboard?.recent_symptoms?.length || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="dashboard-grid">
                    <div className="chart-card">
                        <div className="card-header">
                            <h3>Perkembangan Berat Badan</h3>
                            <span className="period-badge">7 Hari Terakhir</span>
                        </div>
                        {graphData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={graphData}>
                                    <XAxis dataKey="date" tickFormatter={(d) => d.split('-')[2]} />
                                    <YAxis domain={['auto', 'auto']} />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="weight"
                                        stroke="#667eea"
                                        strokeWidth={3}
                                        dot={{ fill: '#667eea', r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="empty-chart">
                                <Calendar size={40} />
                                <p>Belum ada data minggu ini</p>
                            </div>
                        )}
                    </div>

                    <div className="quick-actions">
                        <h3>Menu Cepat</h3>
                        <div className="action-list">
                            <Link to="/symptoms" className="action-item">
                                <Brain className="action-icon" />
                                <span>Log Gejala</span>
                                <ChevronRight size={18} />
                            </Link>
                            <Link to="/recommendations/food" className="action-item">
                                <Utensils className="action-icon food" />
                                <span>Rekomendasi Makanan</span>
                                <ChevronRight size={18} />
                            </Link>
                            <Link to="/recommendations/exercise" className="action-item">
                                <Dumbbell className="action-icon exercise" />
                                <span>Rekomendasi Olahraga</span>
                                <ChevronRight size={18} />
                            </Link>
                            <Link to="/family" className="action-item">
                                <Users className="action-icon family" />
                                <span>Keluarga</span>
                                <ChevronRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>

                {dashboard?.recommendations?.length > 0 && (
                    <div className="recommendations-preview">
                        <h3>Rekomendasi untuk Anda</h3>
                        <div className="rec-list">
                            {dashboard.recommendations.map((rec, idx) => (
                                <div key={idx} className={`rec-card priority-${rec.priority}`}>
                                    <h4>{rec.title}</h4>
                                    <p>{rec.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
