// Helper untuk LocalStorage
const getStorage = (key, defaultVal) => {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultVal;
    try {
        return JSON.parse(stored);
    } catch {
        return defaultVal;
    }
};

const setStorage = (key, val) => {
    localStorage.setItem(key, JSON.stringify(val));
};

// --- SERVICE KESEHATAN ---
export const healthAPI = {
    getDashboard: async () => {
        // Ambil data logs
        const logs = getStorage('health_logs', []);
        
        // Ambil data terakhir untuk ditampilkan di kartu
        const latest = logs[0] || { weight: 0, emotional_state: 'neutral' };
        
        // Hitung BMI (Asumsi tinggi 170cm untuk testing)
        const heightM = 1.70; 
        const bmi = latest.weight > 0 ? (latest.weight / (heightM * heightM)).toFixed(1) : 0;
        
        let bmiCat = 'Belum ada data';
        if (bmi > 0) {
            if (bmi < 18.5) bmiCat = 'Underweight';
            else if (bmi < 25) bmiCat = 'Normal';
            else if (bmi < 30) bmiCat = 'Overweight';
            else bmiCat = 'Obese';
        }

        return {
            data: {
                data: {
                    health_score: latest.weight > 0 ? 85 : 0, // Skor dummy jika ada data
                    bmi: bmi,
                    bmi_category: bmiCat,
                    mood: latest.emotional_state || 'neutral',
                    recent_symptoms: [] 
                }
            }
        };
    },

    getGraph: async (period) => {
        const logs = getStorage('health_logs', []);
        // Siapkan data untuk Recharts (Format: { date: 'DD/MM', weight: 60 })
        // Kita balik (.reverse) agar data lama di kiri, baru di kanan
        const data = logs.slice(0, 7).reverse().map(log => ({
            date: new Date(log.date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' }),
            weight: parseFloat(log.weight)
        }));
        return { data: { data } };
    },

    addLog: async (data) => {
        const logs = getStorage('health_logs', []);
        const newLog = { 
            ...data, 
            date: new Date().toISOString(),
            id: Date.now() 
        };
        // Masukkan data baru ke paling depan array
        logs.unshift(newLog);
        setStorage('health_logs', logs);
        return { data: newLog };
    }
};

// --- SERVICE PENGINGAT ---
export const remindersAPI = {
    getAll: async () => {
        const defaultReminders = [
            { id: 1, type: 'water', label: 'Minum Air Pagi', time: '07:00', is_active: true },
            { id: 2, type: 'meal', label: 'Sarapan Sehat', time: '08:00', is_active: true },
            { id: 3, type: 'exercise', label: 'Lari Sore', time: '17:00', is_active: false },
        ];
        return { data: { data: getStorage('reminders', defaultReminders) } };
    },
    
    toggle: async (id) => {
        const current = getStorage('reminders', []);
        const updated = current.map(r => 
            r.id === id ? { ...r, is_active: !r.is_active } : r
        );
        setStorage('reminders', updated);
        return { data: true };
    }
};