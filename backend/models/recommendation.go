package models

type Recommendation struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Category    string `json:"category"` // food, exercise, emotional
	Condition   string `json:"condition"` // BMI category, symptom, emotional state
	Title       string `json:"title"`
	Description string `json:"description"`
	Details     string `gorm:"type:text" json:"details"`
	Priority    int    `json:"priority"` // 1-5
}

type FoodRecommendation struct {
	Category    string   `json:"category"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Foods       []string `json:"foods"`
	Avoid       []string `json:"avoid"`
	Reason      string   `json:"reason"`
}

type ExerciseRecommendation struct {
	Category    string   `json:"category"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Exercises   []string `json:"exercises"`
	Duration    string   `json:"duration"`
	Frequency   string   `json:"frequency"`
	Intensity   string   `json:"intensity"`
	Reason      string   `json:"reason"`
}

type EmotionalRecommendation struct {
	EmotionalState string   `json:"emotional_state"`
	Title          string   `json:"title"`
	Description    string   `json:"description"`
	Activities     []string `json:"activities"`
	Tips           []string `json:"tips"`
	Reason         string   `json:"reason"`
}
