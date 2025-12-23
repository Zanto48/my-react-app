package database

import (
	"health-tracker/models"
	"log"

	"gorm.io/driver/postgres" // <--- KITA PAKAI DRIVER BARU
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func InitDatabase() {
	var err error

	// =================================================================
	// ⚠️ BAGIAN INI YANG HARUS ANDA ISI DENGAN LINK NEON ⚠️
	// =================================================================
	// Cara Paste yang benar:
	// 1. Klik tombol MATA di Neon agar password terlihat.
	// 2. Copy linknya (mulai dari postgres://.... sampai akhir).
	// 3. JANGAN ikutkan kata 'psql' atau tanda kutip ' di depannya.

	dsn := "postgresql://neondb_owner:npg_mslqBoK0jy5r@ep-gentle-bar-a17rvmi5-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

	// Membuka koneksi ke Cloud (PostgreSQL)
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Fatal("❌ Gagal koneksi ke Cloud Database:", err)
	}

	log.Println("✅ SUKSES! Terhubung ke Cloud Database (PostgreSQL)")

	// Auto-migrate models (Sama seperti dulu, tapi sekarang tabelnya dibuat di Cloud)
	err = DB.AutoMigrate(
		&models.User{},
		&models.HealthData{},
		&models.Symptom{},
		&models.SymptomTemplate{},
		&models.FamilyMember{},
		&models.Recommendation{},
		&models.Article{},
		&models.Post{},
		&models.Comment{},
		&models.Like{},
		&models.WaterIntake{},
		&models.Goal{},
		&models.Reminder{},
	)

	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	log.Println("Database migration completed")

	// Seed data (Hati-hati, jika dijalankan berkali-kali data akan dobel, tapi aman untuk tes pertama)
	SeedData()
}
