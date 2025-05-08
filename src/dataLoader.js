// src/utils/getMicrohabitsData.js

export default function getMicrohabitsData() {
  return {
    mappingData: [
      // Stress Management
      {
        category: "Lifestyle",
        subcategory: "Stress Management",
        historyInput: "Self-assessed \"moderate\" level of stress",
        condition: "High stress (cortisol > 20)",
        recommendation: "Incorporate 10-15 minutes of mindfulness or meditation daily"
      },
      {
        category: "Lifestyle",
        subcategory: "Stress Management",
        historyInput: "Fluctuating levels of energy during day",
        condition: "High stress (cortisol > 20)",
        recommendation: "Complete the stress cycle daily (movement, breath, social, creative, physical contact, laugh, cry)"
      },
      {
        category: "Lifestyle",
        subcategory: "Stress Management",
        historyInput: "Generally low levels of energy",
        condition: "Difficulty handling stress",
        recommendation: "Journaling, yoga, or breathwork techniques (physiological sigh), PMR"
      },
      {
        category: "Lifestyle",
        subcategory: "Stress Management",
        historyInput: "Insomnia",
        condition: "Difficulty handling stress",
        recommendation: "20 Things That Bring Me Joy List"
      },
      {
        category: "Lifestyle",
        subcategory: "Stress Management",
        labInput: "DHEA level below 4.5",
        condition: "Persistent worry/anxiety",
        recommendation: "Cognitive Behavioral Therapy (CBT) or guided relaxation exercises"
      },

      // Sleep
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "hours sleep less than 8hrs",
        condition: "Poor sleep (<6 hours)",
        recommendation: "Aim for 7-8 hours nightly, establish a consistent sleep routine"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "waking up multiple times a night - no reason",
        condition: "Poor sleep (wake at 3am)",
        recommendation: "Trial snack before bedtime (~ 250 Cal eg. tsp of raw honey, apple with nut butter)"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "Waking up multiple times a night - night sweats",
        condition: "Difficulty falling asleep",
        recommendation: "Use blue-light blocking glasses in the evening, wind-down routine"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "Waking up multiple times a night - to void",
        condition: "Difficulty falling asleep",
        recommendation: "Avoid stimulating activity in evening (e.g., intense workout, excessive socialization, heavy work)"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "Poor sleep hygiene",
        condition: "Low sleep quality",
        recommendation: "Weighted blanket or white noise machine"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "Feeling unrested upon waking",
        condition: "Low sleep quality",
        recommendation: "Cool dark cave (turn down thermostat, blackout blinds, ear plugs/white noise machine at 60-68 dB, humidifier)"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "Trouble falling asleep",
        condition: "Circadian Rhythm dysregulation",
        recommendation: "Wind down routine 90 min before bed (reading, stretching, journaling, meditation)"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "Difficult to wake up in the morning",
        condition: "Circadian Rhythm dysregulation",
        recommendation: "Early morning light exposure (to sunlight, glow light within 30 min of waking)"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "Erratic sleep schedule",
        condition: "Circadian Rhythm dysregulation",
        recommendation: "Consistent bed and wake time"
      },

      // Add remaining inputs following the same structure if needed
    ]
  };
}
