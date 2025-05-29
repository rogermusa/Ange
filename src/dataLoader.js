// src/dataLoader.js

export default function getMicrohabitsData() {
  return {
    mappingData: [
      {
        category: "Lifestyle",
        subcategory: "Stress Management",
        historyInput: "Self-assessed \"moderate\" level of stress",
        labInput: null,
        condition: "High stress (cortisol > 20)",
        recommendation: "Incorporate 10-15 minutes of mindfulness or meditation daily",
        notes: null,
        indications: null
      },
      {
        category: "Lifestyle",
        subcategory: "Stress Management",
        historyInput: "Fluctuating levels of energy during day",
        labInput: null,
        condition: "High stress (cortisol > 20)",
        recommendation: "Complete the stress cycle daily (movement, breath, social, creative, physical contact, laugh, cry)",
        notes: null,
        indications: null
      },
      {
        category: "Lifestyle",
        subcategory: "Stress Management",
        historyInput: "Generally low levels of energy",
        labInput: null,
        condition: "Difficulty handling stress",
        recommendation: "Journaling, yoga, or breathwork techniques (physiological sigh), PMR",
        notes: null,
        indications: null
      },
      {
        category: "Lifestyle",
        subcategory: "Stress Management",
        historyInput: "Insomnia",
        labInput: null,
        condition: "Difficulty handling stress",
        recommendation: "20 Things That Bring Me Joy List",
        notes: null,
        indications: null
      },
      {
        category: "Lifestyle",
        subcategory: "Stress Management",
        historyInput: "Persistent worry/anxiety",
        labInput: "DHEA level below 4.5",
        condition: "Persistent worry/anxiety",
        recommendation: "Cognitive Behavioral Therapy (CBT) or guided relaxation exercises",
        notes: "Refer to psychologist or therapist",
        indications: "DHEA < 4.5"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "hours sleep less than 8hrs",
        labInput: null,
        condition: "Poor sleep (<6 hours)",
        recommendation: "Aim for 7-8 hours nightly, establish a consistent sleep routine",
        notes: null,
        indications: "<8hrs sleep"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "waking up multiple times a night - no reason",
        labInput: null,
        condition: "Poor sleep (wake at 3am)",
        recommendation: "Trial snack before bedtime (~ 250 Cal eg. tsp of raw honey, apple with nut butter)",
        notes: "Avoid if SIBO/IBS/dysbiosis. Consume snack 30-60 minutes before bed. Avoid simple carbs (candy, juice) that can cause blood sugar crashes.",
        indications: "Waking up multiple times a night - no reason"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "Waking up multiple times a night - night sweats",
        labInput: null,
        condition: "Difficulty falling asleep",
        recommendation: "Use blue-light blocking glasses in the evening, wind-down routine",
        notes: null,
        indications: "Waking up multiple times a night - night sweats"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "Waking up multiple times a night - to void",
        labInput: null,
        condition: "Difficulty falling asleep",
        recommendation: "Avoid stimulating activity in evening (e.g., intense workout, excessive socialization, heavy work)",
        notes: null,
        indications: "Waking up multiple times a night - to void"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "Poor sleep hygiene",
        labInput: null,
        condition: "Low sleep quality",
        recommendation: "Weighted blanket or white noise machine",
        notes: null,
        indications: "Poor sleep hygiene"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "Feeling unrested upon waking",
        labInput: null,
        condition: "Low sleep quality",
        recommendation: "Cool dark cave (turn down thermostat, blackout blinds, ear plugs/white noise machine at 60-68 dB, humidifier)",
        notes: null,
        indications: "Feeling unrested upon waking"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "Trouble falling asleep",
        labInput: null,
        condition: "Circadian Rhythm dysregulation",
        recommendation: "Wind down routine 90 min before bed (reading, stretching, journaling, meditation)",
        notes: null,
        indications: "Trouble falling asleep"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "Difficult to wake up in the morning",
        labInput: null,
        condition: "Circadian Rhythm dysregulation",
        recommendation: "Early morning light exposure (to sunlight, glow light within 30 min of waking)",
        notes: null,
        indications: "Difficult to wake up in the morning"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "Erratic sleep schedule",
        labInput: null,
        condition: "Circadian Rhythm dysregulation",
        recommendation: "Consistent bed and wake time",
        notes: null,
        indications: "Erratic sleep schedule"
      },
      {
        category: "Lifestyle",
        subcategory: "Nutrition",
        historyInput: "Generally low levels of energy",
        labInput: null,
        condition: "Nutrient deficiency",
        recommendation: "Eat the rainbow (diverse range of colorful fruits and vegetables)",
        notes: null,
        indications: null
      },
      {
        category: "Lifestyle",
        subcategory: "Nutrition",
        historyInput: "Infrequent bowel movements",
        labInput: null,
        condition: "Nutrient deficiency",
        recommendation: "Consider a multivitamin or specific nutrient supplements as needed",
        notes: "Consult with healthcare provider before starting new supplements",
        indications: null
      },
      {
        category: "Lifestyle",
        subcategory: "Nutrition",
        historyInput: "History of cardiovascular disease",
        labInput: null,
        condition: "High Blood Sugar (Fasting Glucose > 5.5)",
        recommendation: "Follow a balanced diet (e.g. Mediterranean, DASH) rich in whole foods",
        notes: null,
        indications: null
      },
      {
        category: "Lifestyle",
        subcategory: "Nutrition",
        historyInput: "Obesity",
        labInput: null,
        condition: "High Blood Sugar (Fasting Glucose > 5.5)",
        recommendation: "Monitor blood sugar levels regularly",
        notes: null,
        indications: null
      },
      {
        category: "Lifestyle",
        subcategory: "Nutrition",
        historyInput: "Frequent urination",
        labInput: null,
        condition: "High cholesterol (Total chol > 5.2)",
        recommendation: "Incorporate soluble fiber (oats, beans, apples) and healthy fats (avocado, nuts)",
        notes: null,
        indications: null
      },
      {
        category: "Lifestyle",
        subcategory: "Nutrition",
        historyInput: "Excessive thirst",
        labInput: null,
        condition: "High cholesterol (Total chol > 5.2)",
        recommendation: "Limit saturated and trans fats, opt for lean proteins",
        notes: null,
        indications: null
      },
      {
        category: "Lifestyle",
        subcategory: "Nutrition",
        historyInput: "Self-assessed \"moderate\" level of stress",
        labInput: null,
        condition: "Signs of inflammation (CRP >3)",
        recommendation: "Anti-inflammatory diet (rich in omega-3s, antioxidants)",
        notes: null,
        indications: null
      },
      {
        category: "Lifestyle",
        subcategory: "Nutrition",
        historyInput: "Skin issues (acne, eczema, psoriasis)",
        labInput: null,
        condition: "Signs of inflammation (CRP >3)",
        recommendation: "Include turmeric, ginger, and green leafy vegetables",
        notes: null,
        indications: null
      },
      {
        category: "Lifestyle",
        subcategory: "Nutrition",
        historyInput: "Dry mouth",
        labInput: null,
        condition: "Dehydration",
        recommendation: "Drink at least 8 glasses (64 oz) of water daily",
        notes: null,
        indications: null
      },
      {
        category: "Lifestyle",
        subcategory: "Nutrition",
        historyInput: "Dark yellow urine",
        labInput: null,
        condition: "Dehydration",
        recommendation: "Carry a water bottle and sip throughout the day",
        notes: null,
        indications: null
      },
      {
        category: "Lifestyle",
        subcategory: "Nutrition",
        historyInput: "lightheaded when getting up",
        labInput: null,
        condition: "Orthostatic Hypotension",
        recommendation: "Add a pinch of sea salt to your morning lemon water to support adrenal function and electrolyte balance. Consider electrolyte supplements if engaging in intense exercise or sweating heavily.",
        notes: "Check BP",
        indications: null
      },
      {
        category: "Lifestyle",
        subcategory: "Exercise",
        historyInput: "Sedentary lifestyle (less than 30 minutes of activity daily)",
        labInput: null,
        condition: "Low physical activity",
        recommendation: "Aim for 150 minutes of moderate-intensity exercise per week",
        notes: null,
        indications: null
      },
      {
        category: "Lifestyle",
        subcategory: "Exercise",
        historyInput: "Generally low levels of energy",
        labInput: null,
        condition: "Low physical activity",
        recommendation: "Incorporate strength training at least twice a week",
        notes: null,
        indications: null
      },
      {
        category: "Lifestyle",
        subcategory: "Social Connection",
        historyInput: "Feelings of loneliness or isolation",
        labInput: null,
        condition: "Lack of social connection",
        recommendation: "Schedule regular social activities with friends or family",
        notes: null,
        indications: null
      },
      {
        category: "Lifestyle",
        subcategory: "Social Connection",
        historyInput: "Limited social interaction",
        labInput: null,
        condition: "Lack of social connection",
        recommendation: "Join a club, group, or volunteer to meet new people",
        notes: null,
        indications: null
      },
      {
        category: "Lifestyle",
        subcategory: "Gut Health",
        historyInput: "Bloating or gas after meals",
        labInput: null,
        condition: "Poor gut health",
        recommendation: "Include probiotic-rich foods (yogurt, kefir, sauerkraut)",
        notes: null,
        indications: null
      },
      {
        category: "Lifestyle",
        subcategory: "Gut Health",
        historyInput: "Irregular bowel movements",
        labInput: null,
        condition: "Poor gut health",
        recommendation: "Increase fiber intake gradually from fruits, vegetables, and whole grains",
        notes: null,
        indications: null
      },
      {
        category: "Lifestyle",
        subcategory: "Mental Acuity",
        historyInput: "Difficulty concentrating or 'brain fog'",
        labInput: null,
        condition: "Reduced mental acuity",
        recommendation: "Engage in brain-stimulating activities (puzzles, reading, learning new skills)",
        notes: null,
        indications: null
      },
      {
        category: "Lifestyle",
        subcategory: "Mental Acuity",
        historyInput: "Forgetfulness",
        labInput: null,
        condition: "Reduced mental acuity",
        recommendation: "Ensure adequate sleep and manage stress effectively",
        notes: null,
        indications: null
      },
      {
        category: "Lifestyle",
        subcategory: "Environmental Health",
        historyInput: "Frequent exposure to pollutants or toxins",
        labInput: null,
        condition: "High toxin exposure",
        recommendation: "Use air purifiers and ensure good ventilation at home and work",
        notes: null,
        indications: null
      },
      {
        category: "Lifestyle",
        subcategory: "Environmental Health",
        historyInput: "Use of plastic containers for food/drinks",
        labInput: null,
        condition: "High toxin exposure",
        recommendation: "Choose natural cleaning and personal care products",
        notes: null,
        indications: null
      },
      {
        category: "Labs",
        subcategory: "Blood Sugar",
        historyInput: null,
        labInput: "Fasting Glucose > 5.5 mmol/L",
        condition: "High Blood Sugar (Fasting Glucose > 5.5)",
        recommendation: "Reduce intake of sugary drinks and processed foods. Focus on whole, unprocessed carbohydrates.",
        notes: null,
        indications: "Fasting Glucose > 5.5 mmol/L"
      },
      {
        category: "Labs",
        subcategory: "Blood Sugar",
        historyInput: null,
        labInput: "HbA1c > 5.7%",
        condition: "Elevated HbA1c (> 5.7%)",
        recommendation: "Increase physical activity to help improve insulin sensitivity. Consider a low-glycemic index diet.",
        notes: null,
        indications: "HbA1c > 5.7%"
      },
      {
        category: "Labs",
        subcategory: "Cholesterol",
        historyInput: null,
        labInput: "Total Cholesterol > 5.2 mmol/L",
        condition: "High cholesterol (Total chol > 5.2)",
        recommendation: "Increase consumption of omega-3 fatty acids (e.g., fatty fish, flaxseeds).",
        notes: null,
        indications: "Total Cholesterol > 5.2 mmol/L"
      },
      {
        category: "Labs",
        subcategory: "Cholesterol",
        historyInput: null,
        labInput: "LDL Cholesterol > 3.4 mmol/L",
        condition: "High LDL Cholesterol (> 3.4)",
        recommendation: "Reduce saturated and trans fat intake. Increase soluble fiber.",
        notes: null,
        indications: "LDL Cholesterol > 3.4 mmol/L"
      },
      {
        category: "Labs",
        subcategory: "Inflammation",
        historyInput: null,
        labInput: "hs-CRP > 3 mg/L",
        condition: "Signs of inflammation (CRP >3)",
        recommendation: "Adopt an anti-inflammatory diet (e.g., Mediterranean diet). Avoid processed foods.",
        notes: null,
        indications: "hs-CRP > 3 mg/L"
      },
      {
        category: "Labs",
        subcategory: "Hormonal Balance",
        historyInput: null,
        labInput: "Cortisol (AM) > 550 nmol/L",
        condition: "High AM Cortisol (>550)",
        recommendation: "Implement stress-reduction techniques like meditation, yoga, or deep breathing exercises.",
        notes: "Consider adaptogenic herbs under guidance.",
        indications: "Cortisol (AM) > 550 nmol/L"
      },
      {
        category: "Labs",
        subcategory: "Hormonal Balance",
        historyInput: null,
        labInput: "DHEA-S < 2.0 µmol/L (female) or < 2.5 µmol/L (male)",
        condition: "Low DHEA-S",
        recommendation: "Focus on stress management, adequate sleep, and a balanced diet. Consider DHEA supplementation under medical supervision if clinically indicated.",
        notes: "Normal ranges vary by age and sex. Female: Age 30-39: 1.5 - 10.6 µmol/L. Male: Age 30-39: 2.4 - 14.5 µmol/L. This is a general low threshold.",
        indications: "DHEA-S < 2.0 µmol/L (female) or < 2.5 µmol/L (male)"
      },
      {
        category: "Labs",
        subcategory: "Thyroid Function",
        historyInput: null,
        labInput: "TSH > 4.5 mIU/L",
        condition: "Elevated TSH (>4.5)",
        recommendation: "Ensure adequate iodine and selenium intake. Manage stress and avoid goitrogenic foods in excess if hypothyroid.",
        notes: "Further thyroid panel (Free T3, Free T4, antibodies) recommended.",
        indications: "TSH > 4.5 mIU/L"
      },
      {
        category: "Labs",
        subcategory: "Nutrient Status",
        historyInput: null,
        labInput: "Vitamin D (25-OH) < 75 nmol/L",
        condition: "Vitamin D Deficiency (<75)",
        recommendation: "Increase sun exposure (safely) and consume vitamin D-rich foods or supplement as advised by a healthcare provider.",
        notes: null,
        indications: "Vitamin D (25-OH) < 75 nmol/L"
      },
      {
        category: "Labs",
        subcategory: "Nutrient Status",
        historyInput: null,
        labInput: "Ferritin < 30 ng/mL",
        condition: "Low Iron (Ferritin <30)",
        recommendation: "Increase intake of iron-rich foods (e.g., red meat, lentils, spinach) and consider supplementation if necessary, under medical guidance.",
        notes: null,
        indications: "Ferritin < 30 ng/mL"
      }
    ]
  };
}
