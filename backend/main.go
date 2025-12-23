package main

import (
	"health-tracker/config"
	"health-tracker/database"
	"health-tracker/routes"
	"log"
	"os" // <--- INI TAMBAHAN PENTING

	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	config.LoadConfig()

	// Set Gin mode
	gin.SetMode(config.AppConfig.GinMode)

	// Initialize database (Sekarang pakai Neon Postgres)
	database.InitDatabase()

	// Create Gin router
	r := gin.Default()

	// Setup routes
	routes.SetupRoutes(r)

	// ========================================================
	// PENYESUAIAN UNTUK RENDER.COM
	// ========================================================
	// Ambil PORT dari Environment Variable (disediakan Render)
	port := os.Getenv("PORT")
	if port == "" {
		// Jika tidak ada (sedang di laptop), pakai port default dari config
		port = config.AppConfig.Port
		if port == "" {
			port = "8080" // Default cadangan
		}
	}

	log.Printf("🚀 Health Tracker API starting on port %s", port)

	// Jalankan server di 0.0.0.0 (Wajib untuk Render)
	if err := r.Run("0.0.0.0:" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
