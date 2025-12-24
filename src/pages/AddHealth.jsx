import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { healthAPI } from '../services/api';
import { Activity, Smile, Save, ArrowLeft } from 'lucide-react';
import './Auth.css'; // Reuse CSS agar konsisten

const AddHealth = () => {
    const navigate = useNavigate();
    const [weight, setWeight] = useState('');
    const [mood, setMood] = useState('happy');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await healthAPI.addLog({
                weight: parseFloat(weight),
                emotional_state: mood
            });
            alert('Data berhasil disimpan!');
            navigate('/dashboard');
        } catch (error) {
            alert('Gagal menyimpan data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                        <ArrowLeft />
                    </button>
                    <div>
                        <h2 style={{ marginBottom: 0 }}>Catat Kesehatan</h2>
                        <p style={{ margin: 0 }}>Update kondisi harianmu</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <Activity className="input-icon" />
                        <input 
                            type="number" 
                            placeholder="Berat Badan (kg)" 
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Smile className="input-icon" />
                        <select 
                            value={mood} 
                            onChange={(e) => setMood(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}
                        >
                            <option value="happy">😊 Bahagia</option>
                            <option value="neutral">😐 Biasa Saja</option>
                            <option value="sad">😔 Sedih</option>
                            <option value="stressed">😫 Stres</option>
                            <option value="anxious">😰 Cemas</option>
                        </select>
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Menyimpan...' : 'Simpan Data'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddHealth;