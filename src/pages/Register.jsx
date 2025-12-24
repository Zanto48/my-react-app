import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Pastikan path ini benar
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import './Auth.css'; // Pakai CSS yang sama dengan Login

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // PERBAIKAN DISINI: Mengirim data nama ke metadata Supabase
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: name, // Ini agar nama tersimpan!
                    },
                },
            });

            if (error) throw error;

            alert('Registrasi berhasil! Silakan login.');
            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Daftar Akun Baru</h2>
                    <p>Mulai perjalanan sehat Anda hari ini</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="auth-error">{error}</div>}

                    <div className="input-group">
                        <User className="input-icon" />
                        <input
                            type="text"
                            placeholder="Nama Lengkap"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Mail className="input-icon" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Lock className="input-icon" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? <Loader2 className="spinner" /> : 'Daftar Sekarang'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Sudah punya akun? <Link to="/login">Login disini</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;