package routes

import (
	"health-tracker/handlers"
	"health-tracker/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	// CORS middleware
	r.Use(middleware.CORSMiddleware())

	// API group
	api := r.Group("/api")
	{
		// Public routes (no auth required)
		auth := api.Group("/auth")
		{
			auth.POST("/register", handlers.Register)
			auth.POST("/login", handlers.Login)
		}

		// Protected routes (auth required)
		protected := api.Group("")
		protected.Use(middleware.AuthMiddleware())
		{
			// User routes
			protected.GET("/auth/me", handlers.GetCurrentUser)
			protected.PUT("/auth/profile", handlers.UpdateProfile)

			// Health data routes
			health := protected.Group("/health")
			{
				health.POST("", handlers.CreateHealthData)
				health.GET("", handlers.GetHealthData)
				health.GET("/latest", handlers.GetLatestHealthData)
				health.GET("/dashboard", handlers.GetDashboard)
				health.GET("/graph/:period", handlers.GetHealthGraph)
			}

			// Symptom routes
			symptoms := protected.Group("/symptoms")
			{
				symptoms.GET("/list", handlers.GetSymptomList)
				symptoms.POST("", handlers.LogSymptom)
				symptoms.POST("/batch", handlers.LogMultipleSymptoms)
				symptoms.GET("/history", handlers.GetSymptomHistory)
				symptoms.GET("/stats", handlers.GetSymptomStats)
			}

			// Family routes
			family := protected.Group("/family")
			{
				family.POST("/invite", handlers.InviteFamilyMember)
				family.GET("/members", handlers.GetFamilyMembers)
				family.GET("/requests", handlers.GetFamilyRequests)
				family.PUT("/approve/:id", handlers.ApproveFamilyRequest)
				family.PUT("/reject/:id", handlers.RejectFamilyRequest)
				family.GET("/:id/health", handlers.GetFamilyMemberHealth)
				family.DELETE("/:id", handlers.RemoveFamilyMember)
			}

			// Recommendation routes
			recommendations := protected.Group("/recommendations")
			{
				recommendations.GET("/food", handlers.GetFoodRecommendations)
				recommendations.GET("/exercise", handlers.GetExerciseRecommendations)
				recommendations.GET("/emotional", handlers.GetEmotionalRecommendations)
			}
		}
	}

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "message": "Health Tracker API is running"})
	})
}
