// src/dataLoader.js

export default function getMicrohabitsData() {
  return {
    mappingData: [
      // Stress Management
      {
        category: "Lifestyle",
        subcategory: "Stress Management",
        historyInput: "Self-assessed \"moderate\" level of stress",
        condition: "High stress (cortisol > 20)",
        recommendation: "Incorporate 10-15 minutes of mindfulness or meditation daily",
        notes: "",
        indications: ""
      },
      {
        category: "Lifestyle",
        subcategory: "Stress Management",
        historyInput: "Fluctuating levels of energy during day",
        condition: "High stress (cortisol > 20)",
        recommendation: "Complete the stress cycle daily (movement, breath, social, creative, physical contact, laugh, cry)",
        notes: "",
        indications: ""
      },
      {
        category: "Lifestyle",
        subcategory: "Stress Management",
        historyInput: "Generally low levels of energy",
        condition: "Difficulty handling stress",
        recommendation: "Journaling, yoga, or breathwork techniques (physiological sigh), PMR",
        notes: "",
        indications: ""
      },
      {
        category: "Lifestyle",
        subcategory: "Stress Management",
        historyInput: "Insomnia",
        condition: "Difficulty handling stress",
        recommendation: "20 Things That Bring Me Joy List",
        notes: "",
        indications: ""
      },
      {
        category: "Lifestyle",
        subcategory: "Stress Management",
        labInput: "DHEA level below 4.5",
        condition: "Persistent worry/anxiety",
        recommendation: "Cognitive Behavioral Therapy (CBT) or guided relaxation exercises",
        notes: "Refer to psychologist or therapist",
        indications: "DHEA < 4.5"
      },

      // Sleep
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "hours sleep less than 8hrs",
        condition: "Poor sleep (<6 hours)",
        recommendation: "Aim for 7-8 hours nightly, establish a consistent sleep routine",
        notes: "",
        indications: "<8hrs sleep"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "waking up multiple times a night - no reason",
        condition: "Poor sleep (wake at 3am)",
        recommendation: "Trial snack before bedtime (~ 250 Cal eg. tsp of raw honey, apple with nut butter)",
        notes: "Avoid if SIBO/IBS/dysbiosis. Consume snack 30-60 minutes before bed. Avoid simple carbs (candy, juice) that can cause blood sugar crashes.",
        indications: "Waking up multiple times a night - no reason"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "Waking up multiple times a night - night sweats",
        condition: "Difficulty falling asleep",
        recommendation: "Use blue-light blocking glasses in the evening, wind-down routine",
        notes: "",
        indications: "Waking up multiple times a night - night sweats"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "Waking up multiple times a night - to void",
        condition: "Difficulty falling asleep",
        recommendation: "Avoid stimulating activity in evening (e.g., intense workout, excessive socialization, heavy work)",
        notes: "",
        indications: "Waking up multiple times a night - to void"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "Poor sleep hygiene",
        condition: "Low sleep quality",
        recommendation: "Weighted blanket or white noise machine",
        notes: "",
        indications: "Poor sleep hygiene"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "Feeling unrested upon waking",
        condition: "Low sleep quality",
        recommendation: "Cool dark cave (turn down thermostat, blackout blinds, ear plugs/white noise machine at 60-68 dB, humidifier)",
        notes: "",
        indications: "Feeling unrested upon waking"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "Trouble falling asleep",
        condition: "Circadian Rhythm dysregulation",
        recommendation: "Wind down routine 90 min before bed (reading, stretching, journaling, meditation)",
        notes: "",
        indications: "Trouble falling asleep"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "Difficult to wake up in the morning",
        condition: "Circadian Rhythm dysregulation",
        recommendation: "Early morning light exposure (to sunlight, glow light within 30 min of waking)",
        notes: "",
        indications: "Difficult to wake up in the morning"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "Erratic sleep schedule",
        condition: "Circadian Rhythm dysregulation",
        recommendation: "Consistent bed and wake time",
        notes: "",
        indications: "Erratic sleep schedule"
      },
      // Nutrition - General
      {
        category: "Lifestyle",
        subcategory: "Nutrition - General",
        historyInput: "Generally low levels of energy",
        condition: "Nutrient deficiency",
        recommendation: "Eat the rainbow (diverse range of colorful fruits and vegetables)",
        notes: "",
        indications: ""
      },
      {
        category: "Lifestyle",
        subcategory: "Nutrition - General",
        historyInput: "Infrequent bowel movements",
        condition: "Nutrient deficiency",
        recommendation: "Consider a multivitamin or specific nutrient supplements as needed",
        notes: "Consult with healthcare provider before starting new supplements",
        indications: ""
      },
      {
        category: "Lifestyle",
        subcategory: "Nutrition - General",
        historyInput: "History of cardiovascular disease",
        condition: "High Blood Sugar (Fasting Glucose > 5.5)",
        recommendation: "Follow a balanced diet (e.g. Mediterranean, DASH) rich in whole foods",
        notes: "",
        indications: ""
      },
      {
        category: "Lifestyle",
        subcategory: "Nutrition - General",
        historyInput: "Obesity",
        condition: "High Blood Sugar (Fasting Glucose > 5.5)",
        recommendation: "Monitor blood sugar levels regularly",
        notes: "",
        indications: ""
      },
      {
        category: "Lifestyle",
        subcategory: "Nutrition - General",
        historyInput: "Frequent urination",
        condition: "High cholesterol (Total chol > 5.2)",
        recommendation: "Incorporate soluble fiber (oats, beans, apples) and healthy fats (avocado, nuts)",
        notes: "",
        indications: ""
      },
      {
        category: "Lifestyle",
        subcategory: "Nutrition - General",
        historyInput: "Excessive thirst",
        condition: "High cholesterol (Total chol > 5.2)",
        recommendation: "Limit saturated and trans fats, opt for lean proteins",
        notes: "",
        indications: ""
      },
      {
        category: "Lifestyle",
        subcategory: "Nutrition - General",
        historyInput: "Self-assessed \"moderate\" level of stress",
        condition: "Signs of inflammation (CRP >3)",
        recommendation: "Anti-inflammatory diet (rich in omega-3s, antioxidants)",
        notes: "",
        indications: ""
      },
      {
        category: "Lifestyle",
        subcategory: "Nutrition - General",
        historyInput: "Skin issues (acne, eczema, psoriasis)",
        condition: "Signs of inflammation (CRP >3)",
        recommendation: "Include turmeric, ginger, and green leafy vegetables",
        notes: "",
        indications: ""
      },
      // Nutrition - Hydration
      {
        category: "Lifestyle",
        subcategory: "Nutrition - Hydration",
        historyInput: "Dry mouth",
        condition: "Dehydration",
        recommendation: "Drink at least 8 glasses (64 oz) of water daily",
        notes: "",
        indications: ""
      },
      {
        category: "Lifestyle",
        subcategory: "Nutrition - Hydration",
        historyInput: "Dark yellow urine",
        condition: "Dehydration",
        recommendation: "Carry a water bottle and sip throughout the day",
        notes: "",
        indications: ""
      },
      // Exercise
      {
        category: "Lifestyle",
        subcategory: "Exercise",
        historyInput: "Sedentary lifestyle (less than 30 minutes of activity daily)",
        condition: "Low physical activity",
        recommendation: "Aim for 150 minutes of moderate-intensity exercise per week",
        notes: "",
        indications: ""
      },
      {
        category: "Lifestyle",
        subcategory: "Exercise",
        historyInput: "Generally low levels of energy",
        condition: "Low physical activity",
        recommendation: "Incorporate strength training at least twice a week",
        notes: "",
        indications: ""
      },
      // Social Connection
      {
        category: "Lifestyle",
        subcategory: "Social Connection",
        historyInput: "Feelings of loneliness or isolation",
        condition: "Lack of social connection",
        recommendation: "Schedule regular social activities with friends or family",
        notes: "",
        indications: ""
      },
      {
        category: "Lifestyle",
        subcategory: "Social Connection",
        historyInput: "Limited social interaction",
        condition: "Lack of social connection",
        recommendation: "Join a club, group, or volunteer to meet new people",
        notes: "",
        indications: ""
      },
      // Gut Health
      {
        category: "Lifestyle",
        subcategory: "Gut Health",
        historyInput: "Bloating or gas after meals",
        condition: "Poor gut health",
        recommendation: "Include probiotic-rich foods (yogurt, kefir, sauerkraut)",
        notes: "",
        indications: ""
      },
      {
        category: "Lifestyle",
        subcategory: "Gut Health",
        historyInput: "Irregular bowel movements",
        condition: "Poor gut health",
        recommendation: "Increase fiber intake gradually from fruits, vegetables, and whole grains",
        notes: "",
        indications: ""
      },
      // Mental Acuity
      {
        category: "Lifestyle",
        subcategory: "Mental Acuity",
        historyInput: "Difficulty concentrating or 'brain fog'",
        condition: "Reduced mental acuity",
        recommendation: "Engage in brain-stimulating activities (puzzles, reading, learning new skills)",
        notes: "",
        indications: ""
      },
      {
        category: "Lifestyle",
        subcategory: "Mental Acuity",
        historyInput: "Forgetfulness",
        condition: "Reduced mental acuity",
        recommendation: "Ensure adequate sleep and manage stress effectively",
        notes: "",
        indications: ""
      },
      // Environmental Health
      {
        category: "Lifestyle",
        subcategory: "Environmental Health",
        historyInput: "Frequent exposure to pollutants or toxins",
        condition: "High toxin exposure",
        recommendation: "Use air purifiers and ensure good ventilation at home and work",
        notes: "",
        indications: ""
      },
      {
        category: "Lifestyle",
        subcategory: "Environmental Health",
        historyInput: "Use of plastic containers for food/drinks",
        condition: "High toxin exposure",
        recommendation: "Choose natural cleaning and personal care products",
        notes: "",
        indications: ""
      },
      // Labs
      {
        category: "Labs",
        subcategory: "Blood Sugar",
        labInput: "Fasting Glucose > 5.5 mmol/L",
        condition: "High Blood Sugar (Fasting Glucose > 5.5)",
        recommendation: "Reduce intake of sugary drinks and processed foods. Focus on whole, unprocessed carbohydrates.",
        notes: "",
        indications: "Fasting Glucose > 5.5 mmol/L"
      },
      {
        category: "Labs",
        subcategory: "Blood Sugar",
        labInput: "HbA1c > 5.7%",
        condition: "Elevated HbA1c (> 5.7%)",
        recommendation: "Increase physical activity to help improve insulin sensitivity. Consider a low-glycemic index diet.",
        notes: "",
        indications: "HbA1c > 5.7%"
      },
      {
        category: "Labs",
        subcategory: "Cholesterol",
        labInput: "Total Cholesterol > 5.2 mmol/L",
        condition: "High cholesterol (Total chol > 5.2)",
        recommendation: "Increase consumption of omega-3 fatty acids (e.g., fatty fish, flaxseeds).",
        notes: "",
        indications: "Total Cholesterol > 5.2 mmol/L"
      },
      {
        category: "Labs",
        subcategory: "Cholesterol",
        labInput: "LDL Cholesterol > 3.4 mmol/L",
        condition: "High LDL Cholesterol (> 3.4)",
        recommendation: "Reduce saturated and trans fat intake. Increase soluble fiber.",
        notes: "",
        indications: "LDL Cholesterol > 3.4 mmol/L"
      },
      {
        category: "Labs",
        subcategory: "Inflammation",
        labInput: "hs-CRP > 3 mg/L",
        condition: "Signs of inflammation (CRP >3)",
        recommendation: "Adopt an anti-inflammatory diet (e.g., Mediterranean diet). Avoid processed foods.",
        notes: "",
        indications: "hs-CRP > 3 mg/L"
      },
      {
        category: "Labs",
        subcategory: "Hormonal Balance",
        labInput: "Cortisol (AM) > 550 nmol/L",
        condition: "High AM Cortisol (>550)",
        recommendation: "Implement stress-reduction techniques like meditation, yoga, or deep breathing exercises.",
        notes: "Consider adaptogenic herbs under guidance.",
        indications: "Cortisol (AM) > 550 nmol/L"
      },
      {
        category: "Labs",
        subcategory: "Hormonal Balance",
        labInput: "DHEA-S < 2.0 µmol/L (female) or < 2.5 µmol/L (male)",
        condition: "Low DHEA-S",
        recommendation: "Focus on stress management, adequate sleep, and a balanced diet. Consider DHEA supplementation under medical supervision if clinically indicated.",
        notes: "Normal ranges vary by age and sex. Female: Age 30-39: 1.5 - 10.6 µmol/L. Male: Age 30-39: 2.4 - 14.5 µmol/L. This is a general low threshold.",
        indications: "DHEA-S < 2.0 µmol/L (female) or < 2.5 µmol/L (male)"
      },
      {
        category: "Labs",
        subcategory: "Thyroid Function",
        labInput: "TSH > 4.5 mIU/L",
        condition: "Elevated TSH (>4.5)",
        recommendation: "Ensure adequate iodine and selenium intake. Manage stress and avoid goitrogenic foods in excess if hypothyroid.",
        notes: "Further thyroid panel (Free T3, Free T4, antibodies) recommended.",
        indications: "TSH > 4.5 mIU/L"
      },
      {
        category: "Labs",
        subcategory: "Nutrient Status",
        labInput: "Vitamin D (25-OH) < 75 nmol/L",
        condition: "Vitamin D Deficiency (<75)",
        recommendation: "Increase sun exposure (safely) and consume vitamin D-rich foods or supplement as advised by a healthcare provider.",
        notes: "",
        indications: "Vitamin D (25-OH) < 75 nmol/L"
      },
      {
        category: "Labs",
        subcategory: "Nutrient Status",
        labInput: "Ferritin < 30 ng/mL",
        condition: "Low Iron (Ferritin <30)",
        recommendation: "Increase intake of iron-rich foods (e.g., red meat, lentils, spinach) and consider supplementation if necessary, under medical guidance.",
        notes: "",
        indications: "Ferritin < 30 ng/mL"
      }
    ]
  };
}
