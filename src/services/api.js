// Simulasi data API agar Dashboard bisa tampil
export const healthAPI = {
    getDashboard: async () => {
        return {
            data: {
                data: {
                    health_score: 85,
                    bmi_category: 'Normal',
                    latest_health: { bmi: 22.5, emotional_state: 'happy' },
                    recent_symptoms: [
                        { symptom_name: 'Sakit Kepala Ringan', severity: 3, logged_at: new Date().toISOString(), symptom_type: 'physical' }
                    ],
                    recommendations: [
                        { title: 'Jaga Hidrasi', description: 'Minum 2 liter air hari ini', priority: 'high' },
                        { title: 'Jalan Kaki', description: 'Lakukan jalan santai 30 menit', priority: 'medium' }
                    ]
                }
            }
        };
    },
    getGraph: async (period) => {
        // Data dummy untuk grafik
        return {
            data: {
                data: [
                    { date: '2025-01-01', weight: 60 },
                    { date: '2025-01-02', weight: 60.5 },
                    { date: '2025-01-03', weight: 60.2 },
                    { date: '2025-01-04', weight: 59.8 },
                    { date: '2025-01-05', weight: 60 },
                    { date: '2025-01-06', weight: 59.5 },
                    { date: '2025-01-07', weight: 59.2 },
                ]
            }
        };
    }
};

export const symptomsAPI = {
    getHistory: async () => {
        return { data: { data: [] } };
    }
};

export const remindersAPI = {
    getAll: async () => {
        return { data: { data: [] } };
    },
    toggle: async (id) => { return true; },
    create: async (data) => { return true; },
    update: async (id, data) => { return true; },
    delete: async (id) => { return true; }
};