package handlers

import (
	"net/http"

	"health-tracker/database"
	"health-tracker/models"
	"health-tracker/utils"

	"github.com/gin-gonic/gin"
)

// GetFoodRecommendations returns personalized food recommendations
func GetFoodRecommendations(c *gin.Context) {
	userID := c.GetUint("userID")

	// Get latest health data
	var health models.HealthData
	database.DB.Where("user_id = ?", userID).Order("record_date desc").First(&health)

	// Get recent symptoms
	var symptoms []models.Symptom
	database.DB.Where("user_id = ?", userID).Order("logged_at desc").Limit(10).Find(&symptoms)

	recommendations := generateFoodRecommendations(health, symptoms)

	utils.SuccessResponse(c, http.StatusOK, "Food recommendations retrieved", recommendations)
}

// GetExerciseRecommendations returns personalized exercise recommendations
func GetExerciseRecommendations(c *gin.Context) {
	userID := c.GetUint("userID")

	// Get user profile
	var user models.User
	database.DB.First(&user, userID)

	// Get latest health data
	var health models.HealthData
	database.DB.Where("user_id = ?", userID).Order("record_date desc").First(&health)

	// Get recent symptoms
	var symptoms []models.Symptom
	database.DB.Where("user_id = ?", userID).Order("logged_at desc").Limit(10).Find(&symptoms)

	recommendations := generateExerciseRecommendations(user, health, symptoms)

	utils.SuccessResponse(c, http.StatusOK, "Exercise recommendations retrieved", recommendations)
}

// GetEmotionalRecommendations returns emotional activity recommendations
func GetEmotionalRecommendations(c *gin.Context) {
	userID := c.GetUint("userID")

	// Get latest health data for emotional state
	var health models.HealthData
	database.DB.Where("user_id = ?", userID).Order("record_date desc").First(&health)

	// Get mental symptoms
	var mentalSymptoms []models.Symptom
	database.DB.Where("user_id = ? AND symptom_type = ?", userID, "mental").
		Order("logged_at desc").Limit(5).Find(&mentalSymptoms)

	recommendations := generateEmotionalRecommendations(health.EmotionalState, mentalSymptoms)

	utils.SuccessResponse(c, http.StatusOK, "Emotional recommendations retrieved", recommendations)
}

func generateFoodRecommendations(health models.HealthData, symptoms []models.Symptom) []models.FoodRecommendation {
	var recommendations []models.FoodRecommendation

	bmiCategory := models.GetBMICategory(health.BMI)

	// BMI-based recommendations
	switch bmiCategory {
	case "Underweight":
		recommendations = append(recommendations, models.FoodRecommendation{
			Category:    "weight_gain",
			Title:       "Makanan untuk Menambah Berat Badan",
			Description: "Tingkatkan asupan kalori dengan makanan bergizi tinggi",
			Foods:       []string{"Alpukat", "Kacang-kacangan", "Susu full cream", "Nasi merah", "Daging tanpa lemak", "Telur", "Keju", "Yogurt"},
			Avoid:       []string{"Makanan cepat saji", "Minuman bersoda"},
			Reason:      "BMI Anda di bawah normal, perlu menambah asupan kalori sehat",
		})
	case "Overweight", "Obese":
		recommendations = append(recommendations, models.FoodRecommendation{
			Category:    "weight_loss",
			Title:       "Makanan untuk Menurunkan Berat Badan",
			Description: "Fokus pada makanan rendah kalori dan tinggi serat",
			Foods:       []string{"Sayuran hijau", "Buah-buahan segar", "Ikan", "Dada ayam", "Oatmeal", "Quinoa", "Kacang almond"},
			Avoid:       []string{"Gorengan", "Makanan tinggi gula", "Minuman manis", "Fast food", "Makanan olahan"},
			Reason:      "BMI Anda di atas normal, perlu mengurangi asupan kalori",
		})
	case "Normal":
		recommendations = append(recommendations, models.FoodRecommendation{
			Category:    "maintenance",
			Title:       "Pertahankan Pola Makan Sehat",
			Description: "Lanjutkan konsumsi makanan seimbang",
			Foods:       []string{"Sayuran beragam warna", "Protein seimbang", "Karbohidrat kompleks", "Buah segar", "Air putih cukup"},
			Avoid:       []string{"Makanan ultra-proses", "Gula berlebihan"},
			Reason:      "BMI Anda normal, pertahankan pola makan sehat",
		})
	}

	// Symptom-based recommendations
	symptomNames := make(map[string]bool)
	for _, s := range symptoms {
		symptomNames[s.SymptomName] = true
	}

	if symptomNames["Tekanan Darah Tinggi"] {
		recommendations = append(recommendations, models.FoodRecommendation{
			Category:    "blood_pressure",
			Title:       "Makanan untuk Tekanan Darah",
			Description: "Diet DASH untuk mengontrol tekanan darah",
			Foods:       []string{"Pisang", "Bayam", "Brokoli", "Salmon", "Kentang", "Kacang merah", "Semangka"},
			Avoid:       []string{"Garam berlebihan", "Makanan kaleng", "Keripik", "Makanan asin"},
			Reason:      "Anda mengalami tekanan darah tinggi",
		})
	}

	if symptomNames["Maag"] || symptomNames["Gangguan Pencernaan"] {
		recommendations = append(recommendations, models.FoodRecommendation{
			Category:    "digestive",
			Title:       "Makanan untuk Pencernaan",
			Description: "Makanan yang mudah dicerna dan menenangkan lambung",
			Foods:       []string{"Pisang", "Nasi putih", "Roti tawar", "Ayam rebus", "Jahe", "Pepaya", "Yogurt"},
			Avoid:       []string{"Makanan pedas", "Kopi", "Alkohol", "Makanan berminyak", "Jeruk"},
			Reason:      "Anda mengalami gangguan pencernaan",
		})
	}

	if symptomNames["Kolesterol Tinggi"] {
		recommendations = append(recommendations, models.FoodRecommendation{
			Category:    "cholesterol",
			Title:       "Makanan untuk Kolesterol",
			Description: "Makanan yang membantu menurunkan kolesterol",
			Foods:       []string{"Oatmeal", "Ikan salmon", "Kacang walnut", "Alpukat", "Minyak zaitun", "Apel", "Bayam"},
			Avoid:       []string{"Daging merah berlemak", "Kuning telur berlebihan", "Mentega", "Makanan goreng"},
			Reason:      "Anda memiliki kolesterol tinggi",
		})
	}

	if symptomNames["Kelelahan Fisik"] || symptomNames["Kelelahan Emosional (Burnout)"] {
		recommendations = append(recommendations, models.FoodRecommendation{
			Category:    "energy",
			Title:       "Makanan Penambah Energi",
			Description: "Nutrisi untuk melawan kelelahan",
			Foods:       []string{"Bayam", "Pisang", "Kacang almond", "Telur", "Salmon", "Ubi jalar", "Cokelat hitam"},
			Avoid:       []string{"Gula berlebihan", "Kafein berlebihan", "Alkohol"},
			Reason:      "Anda mengalami kelelahan",
		})
	}

	return recommendations
}

func generateExerciseRecommendations(user models.User, health models.HealthData, symptoms []models.Symptom) []models.ExerciseRecommendation {
	var recommendations []models.ExerciseRecommendation

	activityLevel := health.ActivityLevel
	if activityLevel == "" {
		activityLevel = user.ActivityLevel
	}

	bmiCategory := models.GetBMICategory(health.BMI)

	// Activity level based
	switch activityLevel {
	case "sedentary":
		recommendations = append(recommendations, models.ExerciseRecommendation{
			Category:    "beginner",
			Title:       "Mulai dengan Aktivitas Ringan",
			Description: "Bangun kebiasaan olahraga secara bertahap",
			Exercises:   []string{"Jalan kaki 15-30 menit", "Stretching pagi", "Yoga pemula", "Berenang santai"},
			Duration:    "15-30 menit",
			Frequency:   "3-4 kali/minggu",
			Intensity:   "Ringan",
			Reason:      "Tingkat aktivitas Anda rendah, mulai perlahan",
		})
	case "light":
		recommendations = append(recommendations, models.ExerciseRecommendation{
			Category:    "intermediate_light",
			Title:       "Tingkatkan Intensitas Olahraga",
			Description: "Tambah variasi dan durasi latihan",
			Exercises:   []string{"Jogging ringan", "Bersepeda santai", "Senam aerobik", "Pilates"},
			Duration:    "30-45 menit",
			Frequency:   "4-5 kali/minggu",
			Intensity:   "Ringan-Sedang",
			Reason:      "Anda sudah aktif ringan, tingkatkan intensitas",
		})
	case "moderate":
		recommendations = append(recommendations, models.ExerciseRecommendation{
			Category:    "intermediate",
			Title:       "Variasikan Latihan Anda",
			Description: "Kombinasi kardio dan latihan kekuatan",
			Exercises:   []string{"Lari 5K", "HIIT workout", "Angkat beban", "Berenang lap", "Bulu tangkis"},
			Duration:    "45-60 menit",
			Frequency:   "5 kali/minggu",
			Intensity:   "Sedang",
			Reason:      "Tingkat aktivitas sedang, tambah variasi",
		})
	case "active":
		recommendations = append(recommendations, models.ExerciseRecommendation{
			Category:    "advanced",
			Title:       "Pertahankan Performa",
			Description: "Jaga konsistensi dan hindari overtraining",
			Exercises:   []string{"Lari jarak jauh", "CrossFit", "Latihan interval", "Olahraga kompetitif"},
			Duration:    "60+ menit",
			Frequency:   "5-6 kali/minggu dengan 1 hari istirahat",
			Intensity:   "Tinggi",
			Reason:      "Anda sangat aktif, jaga keseimbangan",
		})
	}

	// BMI-specific
	if bmiCategory == "Overweight" || bmiCategory == "Obese" {
		recommendations = append(recommendations, models.ExerciseRecommendation{
			Category:    "weight_loss",
			Title:       "Olahraga untuk Menurunkan Berat",
			Description: "Kombinasi kardio untuk membakar kalori",
			Exercises:   []string{"Jalan cepat", "Berenang", "Sepeda statis", "Eliptical trainer", "Zumba"},
			Duration:    "45-60 menit",
			Frequency:   "5-6 kali/minggu",
			Intensity:   "Sedang",
			Reason:      "Fokus pada pembakaran kalori untuk penurunan berat badan",
		})
	}

	// Check for physical symptoms that affect exercise
	for _, s := range symptoms {
		if s.SymptomName == "Nyeri Sendi" || s.SymptomName == "Nyeri Otot" {
			recommendations = append(recommendations, models.ExerciseRecommendation{
				Category:    "low_impact",
				Title:       "Olahraga Rendah Dampak",
				Description: "Aktivitas yang tidak membebani sendi",
				Exercises:   []string{"Berenang", "Yoga", "Tai Chi", "Bersepeda statis", "Water aerobics"},
				Duration:    "20-30 menit",
				Frequency:   "3-4 kali/minggu",
				Intensity:   "Ringan",
				Reason:      "Anda mengalami nyeri, pilih olahraga yang lembut",
			})
			break
		}
	}

	return recommendations
}

func generateEmotionalRecommendations(emotionalState string, mentalSymptoms []models.Symptom) []models.EmotionalRecommendation {
	var recommendations []models.EmotionalRecommendation

	// Based on emotional state
	switch emotionalState {
	case "stressed":
		recommendations = append(recommendations, models.EmotionalRecommendation{
			EmotionalState: "stressed",
			Title:          "Kelola Stres Anda",
			Description:    "Teknik relaksasi untuk mengurangi stres",
			Activities:     []string{"Meditasi 10 menit", "Pernapasan dalam (4-7-8)", "Jalan santai di alam", "Mendengarkan musik menenangkan", "Journaling"},
			Tips:           []string{"Tidur cukup 7-8 jam", "Batasi screen time", "Luangkan waktu untuk diri sendiri", "Bicara dengan orang terdekat"},
			Reason:         "Anda sedang mengalami stres",
		})
	case "anxious":
		recommendations = append(recommendations, models.EmotionalRecommendation{
			EmotionalState: "anxious",
			Title:          "Atasi Kecemasan",
			Description:    "Aktivitas untuk menenangkan pikiran cemas",
			Activities:     []string{"Grounding technique (5-4-3-2-1)", "Progressive muscle relaxation", "Yoga restoratif", "Mewarnai mandala", "Merajut/craft"},
			Tips:           []string{"Hindari kafein berlebihan", "Batasi berita negatif", "Tetap terhubung dengan orang tersayang", "Fokus pada yang bisa dikontrol"},
			Reason:         "Anda sedang merasa cemas",
		})
	case "sad":
		recommendations = append(recommendations, models.EmotionalRecommendation{
			EmotionalState: "sad",
			Title:          "Tingkatkan Mood Anda",
			Description:    "Aktivitas untuk mengangkat suasana hati",
			Activities:     []string{"Olahraga ringan (endorfin)", "Bertemu teman", "Menonton film favorit", "Memasak makanan kesukaan", "Berkebun"},
			Tips:           []string{"Jangan isolasi diri", "Tetap jaga rutinitas", "Terpapar sinar matahari pagi", "Jika berlanjut, pertimbangkan konseling"},
			Reason:         "Anda sedang merasa sedih",
		})
	case "happy":
		recommendations = append(recommendations, models.EmotionalRecommendation{
			EmotionalState: "happy",
			Title:          "Pertahankan Kebahagiaan",
			Description:    "Aktivitas untuk menjaga mood positif",
			Activities:     []string{"Berbagi kebahagiaan", "Gratitude journal", "Lakukan hobi", "Quality time dengan keluarga", "Olahraga yang menyenangkan"},
			Tips:           []string{"Rayakan pencapaian kecil", "Bantu orang lain", "Simpan momen bahagia", "Tetap bersyukur"},
			Reason:         "Mood Anda sedang baik, pertahankan!",
		})
	case "neutral":
		recommendations = append(recommendations, models.EmotionalRecommendation{
			EmotionalState: "neutral",
			Title:          "Jaga Keseimbangan Emosi",
			Description:    "Aktivitas untuk kesejahteraan mental",
			Activities:     []string{"Mindfulness harian", "Olahraga rutin", "Hobi kreatif", "Sosialisasi sehat", "Belajar hal baru"},
			Tips:           []string{"Tetap jaga rutinitas sehat", "Check-in perasaan secara rutin", "Istirahat yang cukup"},
			Reason:         "Jaga keseimbangan emosional Anda",
		})
	}

	// Based on mental symptoms
	symptomActivities := map[string]models.EmotionalRecommendation{
		"Gangguan Tidur": {
			EmotionalState: "sleep_issue",
			Title:          "Perbaiki Kualitas Tidur",
			Description:    "Tips untuk tidur lebih baik",
			Activities:     []string{"Rutinitas tidur tetap", "Hindari gadget 1 jam sebelum tidur", "Mandi air hangat", "Aromatherapy lavender", "Membaca buku"},
			Tips:           []string{"Kamar gelap dan sejuk", "Hindari kafein sore hari", "Olahraga pagi, bukan malam", "Konsisten jam tidur"},
			Reason:         "Anda mengalami gangguan tidur",
		},
		"Burnout": {
			EmotionalState: "burnout",
			Title:          "Pulihkan Diri dari Burnout",
			Description:    "Langkah pemulihan dari kelelahan emosional",
			Activities:     []string{"Ambil cuti/istirahat", "Delegasikan tugas", "Reconnect dengan passion", "Digital detox", "Spa/self-care day"},
			Tips:           []string{"Set boundaries dengan jelas", "Belajar bilang 'tidak'", "Prioritaskan kesehatan", "Pertimbangkan konseling profesional"},
			Reason:         "Anda mengalami burnout",
		},
		"Kesepian Sosial": {
			EmotionalState: "lonely",
			Title:          "Bangun Koneksi Sosial",
			Description:    "Aktivitas untuk mengurangi kesepian",
			Activities:     []string{"Hubungi teman lama", "Ikut komunitas hobi", "Volunteer/sukarelawan", "Adopsi hewan peliharaan", "Ikut kelas/workshop"},
			Tips:           []string{"Kualitas > kuantitas hubungan", "Jangan takut memulai percakapan", "Online community juga valid", "Jadi pendengar yang baik"},
			Reason:         "Anda merasa kesepian",
		},
	}

	for _, symptom := range mentalSymptoms {
		if rec, exists := symptomActivities[symptom.SymptomName]; exists {
			// Check if not already added
			exists := false
			for _, r := range recommendations {
				if r.EmotionalState == rec.EmotionalState {
					exists = true
					break
				}
			}
			if !exists {
				recommendations = append(recommendations, rec)
			}
		}
	}

	return recommendations
}
