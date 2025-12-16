import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { recommendationsAPI } from '../services/api';
import {
    ArrowLeft, Utensils, Dumbbell, Heart, Loader2,
    CheckCircle, XCircle, Clock, Flame
} from 'lucide-react';
import './Recommendations.css';

const Recommendations = () => {
    const { type } = useParams();
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRecommendations();
    }, [type]);

    const loadRecommendations = async () => {
        setLoading(true);
        try {
            let res;
            switch (type) {
                case 'food':
                    res = await recommendationsAPI.getFood();
                    break;
                case 'exercise':
                    res = await recommendationsAPI.getExercise();
                    break;
                case 'emotional':
                    res = await recommendationsAPI.getEmotional();
                    break;
                default:
                    res = await recommendationsAPI.getFood();
            }
            setRecommendations(res.data.data || []);
        } catch (err) {
            console.error('Failed to load recommendations:', err);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'food': return <Utensils />;
            case 'exercise': return <Dumbbell />;
            case 'emotional': return <Heart />;
            default: return <Utensils />;
        }
    };

    const getTitle = () => {
        switch (type) {
            case 'food': return 'Rekomendasi Makanan';
            case 'exercise': return 'Rekomendasi Olahraga';
            case 'emotional': return 'Aktivitas Emosional';
            default: return 'Rekomendasi';
        }
    };

    if (loading) {
        return (
            <div className="rec-loading">
                <Loader2 className="spinner" />
                <p>Memuat rekomendasi...</p>
            </div>
        );
    }

    return (
        <div className="recommendations-page">
            <header className="page-header">
                <Link to="/dashboard" className="back-btn">
                    <ArrowLeft size={20} />
                </Link>
                <div className="header-icon">{getIcon()}</div>
                <h1>{getTitle()}</h1>
            </header>

            <div className="rec-container">
                {recommendations.length === 0 ? (
                    <div className="empty-state">
                        <Heart size={48} />
                        <h3>Belum Ada Rekomendasi</h3>
                        <p>Lengkapi data kesehatan Anda untuk mendapatkan rekomendasi personal</p>
                        <Link to="/health/add" className="cta-btn">Tambah Data Kesehatan</Link>
                    </div>
                ) : (
                    <div className="rec-list">
                        {recommendations.map((rec, idx) => (
                            <div key={idx} className="rec-card">
                                <div className="rec-header">
                                    <h3>{rec.title}</h3>
                                    <span className="rec-category">{rec.category}</span>
                                </div>
                                <p className="rec-desc">{rec.description}</p>
                                <p className="rec-reason">💡 {rec.reason}</p>

                                {type === 'food' && (
                                    <>
                                        {rec.foods && (
                                            <div className="rec-section foods">
                                                <h4><CheckCircle size={16} /> Makanan Dianjurkan</h4>
                                                <div className="item-tags">
                                                    {rec.foods.map((food, i) => (
                                                        <span key={i} className="tag good">{food}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {rec.avoid && rec.avoid.length > 0 && (
                                            <div className="rec-section avoid">
                                                <h4><XCircle size={16} /> Hindari</h4>
                                                <div className="item-tags">
                                                    {rec.avoid.map((food, i) => (
                                                        <span key={i} className="tag bad">{food}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {type === 'exercise' && (
                                    <>
                                        {rec.exercises && (
                                            <div className="rec-section">
                                                <h4><Flame size={16} /> Olahraga</h4>
                                                <div className="item-tags">
                                                    {rec.exercises.map((ex, i) => (
                                                        <span key={i} className="tag good">{ex}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="exercise-meta">
                                            {rec.duration && (
                                                <span><Clock size={14} /> {rec.duration}</span>
                                            )}
                                            {rec.frequency && (
                                                <span>📅 {rec.frequency}</span>
                                            )}
                                            {rec.intensity && (
                                                <span>⚡ {rec.intensity}</span>
                                            )}
                                        </div>
                                    </>
                                )}

                                {type === 'emotional' && (
                                    <>
                                        {rec.activities && (
                                            <div className="rec-section">
                                                <h4>🎯 Aktivitas</h4>
                                                <ul className="activity-list">
                                                    {rec.activities.map((act, i) => (
                                                        <li key={i}>{act}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {rec.tips && (
                                            <div className="rec-section tips">
                                                <h4>💭 Tips</h4>
                                                <ul className="tips-list">
                                                    {rec.tips.map((tip, i) => (
                                                        <li key={i}>{tip}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="rec-nav">
                    <Link
                        to="/recommendations/food"
                        className={`nav-item ${type === 'food' ? 'active' : ''}`}
                    >
                        <Utensils size={20} />
                        <span>Makanan</span>
                    </Link>
                    <Link
                        to="/recommendations/exercise"
                        className={`nav-item ${type === 'exercise' ? 'active' : ''}`}
                    >
                        <Dumbbell size={20} />
                        <span>Olahraga</span>
                    </Link>
                    <Link
                        to="/recommendations/emotional"
                        className={`nav-item ${type === 'emotional' ? 'active' : ''}`}
                    >
                        <Heart size={20} />
                        <span>Emosional</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Recommendations;
