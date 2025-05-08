import React, { useState, useEffect } from 'react';

// Main application component
const LifestyleIntakeQuestionnaire = () => {
  // Application state
  const [step, setStep] = useState('intro'); // intro, questionnaire, labs, report
  const [patientData, setPatientData] = useState({
    history: {},
    labs: {}
  });
  const [mappingData, setMappingData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [reportData, setReportData] = useState({
    conditions: [],
    recommendations: [],
    scores: {}
  });
  const [categoryScores, setCategoryScores] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Lifecycle - Load the data from the database
  useEffect(() => {
    // In a real app, this would fetch from a backend
    // Here we're using a simplified in-memory representation
    const data = getMicrohabitsData();
    
    // Set the application data
    setMappingData(data.mappingData);
    
    // Extract categories and subcategories
    const cats = Array.from(new Set(data.mappingData
      .filter(item => item.category)
      .map(item => item.category)));
    setCategories(cats);
    
    const subCats = {};
    cats.forEach(cat => {
      subCats[cat] = Array.from(new Set(data.mappingData
        .filter(item => item.category === cat && item.subcategory)
        .map(item => item.subcategory)));
    });
    
    // Add the undefined category items
    const undefinedCats = Array.from(new Set(data.mappingData
      .filter(item => !item.category && item.subcategory)
      .map(item => item.subcategory)));
    
    if (undefinedCats.length > 0) {
      subCats['Lifestyle'] = [
        ...new Set([...(subCats['Lifestyle'] || []), ...undefinedCats])
      ];
    }
    
    setSubcategories(subCats);
    setDataLoaded(true);
  }, []);
  
  // Handle the patient history input changes
  const handleHistoryChange = (input, value) => {
    setPatientData(prev => ({
      ...prev,
      history: {
        ...prev.history,
        [input]: value
      }
    }));
  };
  
  // Handle the lab input changes
  const handleLabChange = (input, value) => {
    setPatientData(prev => ({
      ...prev,
      labs: {
        ...prev.labs,
        [input]: value
      }
    }));
  };
  
  // Generate the report based on patient data
  const generateReport = () => {
    const conditionMap = new Map();
    const recommendationMap = new Map();
    const matchedEntries = [];
    const scores = {};
    
    // Process each mapping entry
    mappingData.forEach(entry => {
      let match = false;
      
      // Generate a unique key for this entry
      const entryKey = `${entry.historyInput || ''}|${entry.labInput || ''}`;
      
      // Check if history input matches
      if (entry.historyInput && patientData.history[entry.historyInput]) {
        match = true;
      }
      
      // Check if lab input matches
      if (entry.labInput && patientData.labs[entry.labInput]) {
        match = true;
      }
      
      // If we have a match, add the condition and recommendation
      if (match) {
        const category = entry.category || 'Lifestyle';
        const subcategory = entry.subcategory || 'General';
        
        if (!scores[category]) {
          scores[category] = {};
        }
        
        if (!scores[category][subcategory]) {
          scores[category][subcategory] = 0;
        }
        
        scores[category][subcategory]++;
        
        // Add this entry to our matched entries
        matchedEntries.push({
          ...entry,
          key: entryKey
        });
        
        // Add condition using Map to avoid duplicates
        if (entry.condition) {
          conditionMap.set(entry.condition, {
            name: entry.condition,
            category,
            subcategory,
            source: entry.historyInput || entry.labInput
          });
        }
        
        // Add recommendation using Map to avoid duplicates
        // Use a composite key of recommendation text + condition to ensure 
        // we maintain direct mapping between input and recommendation
        const recKey = `${entry.recommendation}|${entry.condition}`;
        if (entry.recommendation && !recommendationMap.has(recKey)) {
          recommendationMap.set(recKey, {
            text: entry.recommendation,
            category,
            subcategory,
            condition: entry.condition,
            notes: entry.notes,
            indications: entry.indications,
            source: entry.historyInput || entry.labInput  // Add source for traceability
          });
        }
      }
    });
    
    // Calculate category scores
    const catScores = {};
    Object.keys(scores).forEach(category => {
      catScores[category] = Object.values(scores[category]).reduce((sum, count) => sum + count, 0);
    });
    
    // Convert maps to arrays
    const conditions = Array.from(conditionMap.values());
    const recommendations = Array.from(recommendationMap.values());
    
    setReportData({ 
      conditions, 
      recommendations, 
      scores,
      matchedEntries 
    });
    setCategoryScores(catScores);
    setStep('report');
  };
  
  // Restart the questionnaire
  const restartQuestionnaire = () => {
    setPatientData({
      history: {},
      labs: {}
    });
    setReportData({
      conditions: [],
      recommendations: [],
      scores: {}
    });
    setCategoryScores({});
    setStep('intro');
  };
  
  // Render the appropriate step
  const renderStep = () => {
    switch (step) {
      case 'intro':
        return (
          <IntroScreen 
            onStart={() => setStep('questionnaire')}
          />
        );
      
      case 'questionnaire':
        return (
          <QuestionnaireForm
            mappingData={mappingData}
            patientData={patientData}
            categories={categories}
            subcategories={subcategories}
            onHistoryChange={handleHistoryChange}
            onNext={() => setStep('labs')}
            onBack={() => setStep('intro')}
          />
        );
      
      case 'labs':
        return (
          <LabsForm
            mappingData={mappingData}
            patientData={patientData}
            onLabChange={handleLabChange}
            onGenerate={generateReport}
            onBack={() => setStep('questionnaire')}
          />
        );
      
      case 'report':
        return (
          <ReportCard
            reportData={reportData}
            categoryScores={categoryScores}
            patientData={patientData}
            onRestart={restartQuestionnaire}
          />
        );
      
      default:
        return <div>Loading...</div>;
    }
  };
  
  // Main render
  return (
    <div className="min-h-screen bg-gray-50">
      {dataLoaded ? (
        <div className="container mx-auto px-4 py-8">
          {renderStep()}
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Loading...</h2>
            <p>Preparing your lifestyle questionnaire</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Report card component
const ReportCard = ({ reportData, categoryScores, patientData, onRestart }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const { conditions, recommendations, matchedEntries } = reportData;
  
  // Group recommendations by category and subcategory
  const groupedRecommendations = {};
  
  recommendations.forEach(rec => {
    const category = rec.category || 'Lifestyle';
    const subcategory = rec.subcategory || 'General';
    
    if (!groupedRecommendations[category]) {
      groupedRecommendations[category] = {};
    }
    
    if (!groupedRecommendations[category][subcategory]) {
      groupedRecommendations[category][subcategory] = [];
    }
    
    groupedRecommendations[category][subcategory].push(rec);
  });
  
  // Calculate the top categories
  const sortedCategories = Object.entries(categoryScores)
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category);
    
  // Count total selected items
  const totalSelected = Object.keys(patientData.history).length + Object.keys(patientData.labs).length;
  
  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="p-6 bg-indigo-700 rounded-t-lg">
        <h2 className="text-2xl font-bold text-white mb-2">Your Personalized Health Report</h2>
        <p className="text-indigo-100">
          Based on your {totalSelected} selected items, we've identified specific areas for improvement with tailored recommendations.
        </p>
      </div>
      
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'summary' 
                ? 'border-b-2 border-indigo-500 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
          <button
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'conditions' 
                ? 'border-b-2 border-indigo-500 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('conditions')}
          >
            Identified Conditions
          </button>
          <button
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'recommendations' 
                ? 'border-b-2 border-indigo-500 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('recommendations')}
          >
            Detailed Recommendations
          </button>
          <button
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'direct' 
                ? 'border-b-2 border-indigo-500 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('direct')}
          >
            Input → Recommendation
          </button>
        </nav>
      </div>
      
      <div className="p-8">
        {activeTab === 'summary' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Health Overview</h3>
            
            {recommendations.length > 0 ? (
              <>
                <p className="mb-6">
                  Based on your assessment, we've identified {conditions.length} conditions 
                  and {recommendations.length} targeted recommendations across {Object.keys(groupedRecommendations).length} categories.
                </p>
                
                <h4 className="text-lg font-semibold mb-3">Top Focus Areas</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {sortedCategories.slice(0, 4).map(category => {
                    const score = categoryScores[category];
                    const percent = Math.min(100, Math.max(10, (score / 10) * 100));
                    
                    return (
                      <div key={category} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{category}</span>
                          <span className="text-indigo-600 font-semibold">{score} items</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-indigo-600 h-2.5 rounded-full" 
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <h4 className="text-lg font-semibold mb-3">Key Recommendations</h4>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  {recommendations.slice(0, 5).map((rec, index) => (
                    <li key={index}>{rec.text}</li>
                  ))}
                </ul>
                
                <p className="text-gray-600 italic">
                  See the "Input → Recommendation" tab for a direct mapping between your selections and personalized recommendations.
                </p>
              </>
            ) : (
              <p className="text-gray-600">
                No significant issues were identified based on your responses. Continue with your current healthy habits!
              </p>
            )}
          </div>
        )}
        
        {activeTab === 'conditions' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Identified Conditions & Triggers</h3>
            
            {conditions.length > 0 ? (
              <div className="space-y-6">
                {conditions.map((condition, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <h4 className="font-semibold text-indigo-700">{condition.name}</h4>
                    <div className="mt-2 text-sm">
                      <div className="text-gray-500 flex items-center gap-1">
                        <span className="font-medium">Category:</span> {condition.category} {condition.subcategory && `/ ${condition.subcategory}`}
                      </div>
                      {condition.source && (
                        <div className="text-gray-500 flex items-center gap-1 mt-1">
                          <span className="font-medium">Identified from:</span> {condition.source}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                No conditions or triggers were identified based on your responses.
              </p>
            )}
          </div>
        )}
        
        {activeTab === 'recommendations' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Detailed Recommendations</h3>
            
            {recommendations.length > 0 ? (
              <div className="space-y-8">
                {Object.entries(groupedRecommendations).map(([category, subcats]) => (
                  <div key={category} className="border-b border-gray-200 pb-6 last:border-0">
                    <h4 className="text-lg font-semibold text-indigo-700 mb-4">{category}</h4>
                    
                    {Object.entries(subcats).map(([subcategory, recs]) => (
                      <div key={subcategory} className="mb-6 last:mb-0">
                        <h5 className="font-medium text-gray-800 mb-3">{subcategory}</h5>
                        
                        <div className="space-y-4 pl-4">
                          {recs.map((rec, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4">
                              <div className="font-medium">{rec.text}</div>
                              
                              {rec.condition && (
                                <div className="text-sm text-gray-600 mt-2">
                                  <span className="font-medium">For:</span> {rec.condition}
                                </div>
                              )}
                              
                              {rec.notes && (
                                <div className="text-sm text-gray-600 mt-1">
                                  <span className="font-medium">Notes:</span> {rec.notes}
                                </div>
                              )}
                              
                              {rec.indications && (
                                <div className="text-sm text-gray-600 mt-1">
                                  <span className="font-medium">Indications:</span> {rec.indications}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                No specific recommendations were generated based on your responses.
              </p>
            )}
          </div>
        )}
        
        {activeTab === 'direct' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Direct Mapping: Inputs to Recommendations</h3>
            
            {matchedEntries && matchedEntries.length > 0 ? (
              <div className="space-y-6">
                {matchedEntries.map((entry, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="md:col-span-2">
                        <h5 className="font-medium text-indigo-700 mb-2">Input</h5>
                        <div className="p-3 bg-indigo-50 rounded-lg">
                          {entry.historyInput && (
                            <div className="mb-1">
                              <span className="text-gray-600 text-sm">Patient History:</span> {entry.historyInput}
                            </div>
                          )}
                          {entry.labInput && (
                            <div className="mb-1">
                              <span className="text-gray-600 text-sm">Lab Value:</span> {entry.labInput}
                            </div>
                          )}
                          {entry.condition && (
                            <div className="mt-2 text-sm font-medium text-gray-800">
                              Identified Condition: {entry.condition}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="md:col-span-3">
                        <h5 className="font-medium text-indigo-700 mb-2">Recommendation</h5>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="font-medium">{entry.recommendation}</div>
                          
                          {entry.notes && (
                            <div className="text-sm text-gray-600 mt-2">
                              <span className="font-medium">Notes:</span> {entry.notes}
                            </div>
                          )}
                          
                          {entry.indications && (
                            <div className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Indications:</span> {entry.indications}
                            </div>
                          )}
                          
                          <div className="mt-2 text-xs text-gray-500">
                            {entry.category} / {entry.subcategory}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                No matches were found based on your input selections.
              </p>
            )}
            
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <p className="font-medium text-yellow-800">
                Total inputs selected: {totalSelected} | Total recommendations: {matchedEntries?.length || 0}
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Each recommendation is directly tied to a specific input you provided.
              </p>
            </div>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <button
            onClick={onRestart}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Start New Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

// Data function to provide the microhabits data
function getMicrohabitsData() {
  // This would typically come from a backend API
  // Here we're using a static representation based on the Excel file
  return {
    mappingData: [
      // Stress Management
      {
        category: "Lifestyle",
        subcategory: "Stress Management",
        historyInput: "self assessed \"moderate\" level of stress",
        condition: "High stress (cortisol > 20)",
        recommendation: "Incorporate 10-15 minutes of mindfulness or meditation daily"
      },
      {
        category: "Lifestyle",
        subcategory: "Stress Management",
        historyInput: "fluctuating levels of energy during day",
        condition: "High stress (cortisol > 20)",
        recommendation: "Complete the stress cycle daily (movement, breath, social, creative, physical contact, laugh, cry)"
      },
      {
        category: "Lifestyle",
        subcategory: "Stress Management",
        historyInput: "generally low levels of energy",
        condition: "Difficulty handling stress",
        recommendation: "Journaling, yoga, or breathwork techniques (physiological sigh), PMR"
      },
      {
        category: "Lifestyle",
        subcategory: "Stress Management",
        historyInput: "insomnia",
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
        recommendation: "trial snack before bedtime (~ 250 Cal eg. tsp of raw honey, apple with nut butter)"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "waking up multiple times a night - night sweat",
        condition: "Difficulty falling asleep",
        recommendation: "Use blue-light blocking glasses in the evening, wind-down routine"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "waking up multiple times a night - to void",
        condition: "Difficulty falling asleep",
        recommendation: "Avoid stimulating activity in evening (eg. intense workout, excessive socialization, heavy work)"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "poor sleep hygiene",
        condition: "Low sleep quality",
        recommendation: "Weighted blanket or white noise machine"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "feeling unrested upon waking",
        condition: "Low sleep quality",
        recommendation: "Cool dark cave (turn down thermostat, blackout blinds, ear plugs/white noise machine at 60-68 db, humidifier)"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "trouble falling asleep",
        condition: "Circadian Rhythm dysregulation",
        recommendation: "wind down routine 90 min before bed (reading, stretching, journalling, meditation)"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "Difficult to wake up in the morning",
        condition: "Circadian Rhythm dysregulation",
        recommendation: "Early morning light exposure (to sunlight, glow light withing 30 min waking)"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "Erratic sleep schedule",
        condition: "Circadian Rhythm dysregulation",
        recommendation: "Consistent Bed and Wake time"
      },
      {
        category: "Lifestyle",
        subcategory: "Sleep",
        historyInput: "Feeling tired in the afternoon",
        condition: "Circadian Rhythm dysregulation",
        recommendation: "Nap Protocol Before 2 PM 20-30 minutes maximum"
      },
      
      // Movement
      {
        category: "Lifestyle",
        subcategory: "Movement",
        historyInput: "sedentary lifestyle",
        condition: "Low activity (exercise < 3 days/week)",
        recommendation: "Engage in moderate exercise (Zone 2) 3-5 times weekly"
      },
      {
        category: "Lifestyle",
        subcategory: "Movement",
        historyInput: "Doesn't like to exercise formally",
        condition: "Low activity (exercise < 3 days/week)",
        recommendation: "Non-Exercise Thermogenic Activity (NEAT) - extra movement incorpated into daily activities"
      },
      {
        category: "Lifestyle",
        subcategory: "Movement",
        historyInput: "Beginner at movement/Wants to increase",
        condition: "Sedentary lifestyle",
        recommendation: "Walking program (create opportunities to walk, after dinner)"
      },
      {
        category: "Lifestyle",
        subcategory: "Movement",
        historyInput: "Beginner at movement/wants to increase",
        condition: "Sedentary lifestyle",
        recommendation: "Incorporate any movement (dancing, gardening, cleaning, shopping)"
      },
      {
        category: "Lifestyle",
        subcategory: "Movement",
        historyInput: "Fatigue throughout the day",
        labInput: "DHEA < 3.5",
        condition: "Excessive Exercise",
        recommendation: "Limit prolonged cardio to 30min"
      },
      
      // Diet/Gut Health
      {
        category: "Lifestyle",
        subcategory: "Diet/Gut Health",
        historyInput: "SAD diet",
        condition: "Unhealthy diet (low protein, high sugar)",
        recommendation: "Increase protein intake (e.g., 20-30 g/meal), reduce processed sugars"
      },
      {
        category: "Lifestyle",
        subcategory: "Diet/Gut Health",
        historyInput: "Bloating/GERD/abnormal BM's/IBS",
        condition: "Gut dysbiosis",
        recommendation: "Add probiotics (30-100 billion CFU or fermented foods like kefir and sauerkraut"
      },
      {
        category: "Lifestyle",
        subcategory: "Diet/Gut Health",
        historyInput: "Bloating or food intolerance",
        labInput: "posivitve thyroid Ab",
        condition: "Bloating or food intolerance",
        recommendation: "Gluten Free protocol/ Dairy Free protocol"
      },
      {
        category: "Lifestyle",
        subcategory: "Diet/Gut Health",
        historyInput: "Constipation",
        condition: "Estrogen Dominance",
        recommendation: "ensure daily BM (hydration, Mg, movement)"
      },
      {
        category: "Lifestyle",
        subcategory: "Diet/Gut Health",
        historyInput: "High Estrogen symptoms",
        condition: "Estrogen Dominance",
        recommendation: "Inc intake of cruciferous vegetables",
        notes: "to help with estrogen metabolism"
      },
      
      // Blood Sugar Regulation
      {
        category: "Lifestyle",
        subcategory: "Blood Sugar Regulation",
        labInput: "A1C > 5.2",
        condition: "Elevated A1C",
        recommendation: "Time Restricted Eating - minimum 12 hrs"
      },
      {
        category: "Lifestyle",
        subcategory: "Blood Sugar Regulation",
        labInput: "A1C > 5.2",
        condition: "Elevated A1C",
        recommendation: "Increase dietary fiber, Food order: eat vegetables then protein then carbs"
      },
      {
        category: "Lifestyle",
        subcategory: "Blood Sugar Regulation",
        labInput: "A1C > 5.2",
        condition: "Elevated A1C",
        recommendation: "Walk after meals"
      },
      
      // Elevated Cholesterol
      {
        category: "Lifestyle",
        subcategory: "Elevated Cholesterol",
        labInput: "TG > 1.0",
        condition: "Elevated TG",
        recommendation: "Reduce Refined carbohydrates"
      },
      {
        category: "Lifestyle",
        subcategory: "Elevated Cholesterol",
        labInput: "total chol > 5.2",
        condition: "Elevated cholesterol",
        recommendation: "Red Yeast Rice (600mg BID)",
        notes: "natural statin"
      },
      
      // Basic Stack
      {
        category: "Supplements",
        subcategory: "Basic Stack",
        labInput: "Vit D < 90",
        condition: "General health support",
        recommendation: "Vitamin D3 (2,000-5,000 IU/day), Magnesium glycinate (300-400 mg), B-complex, Omega-3 (2 g EPA/DHA)"
      },
      {
        category: "Supplements",
        subcategory: "Basic Stack",
        historyInput: "hypothyroid",
        labInput: "DHEA < 5.5",
        condition: "Dysregulated cortisol/low thyroid markes",
        recommendation: "Ashwaganda (600mg daily)",
        indications: "helps with synthesis of thyroid hormones and adaptogen"
      },
      {
        category: "Supplements",
        subcategory: "Basic Stack",
        historyInput: "high cortisol symptom score",
        condition: "High cortisol",
        recommendation: "Phosphyltidyleserine 100-150mg daily",
        indications: "helps with breakdown of excess cortisol"
      },
      
      // Stress Support
      {
        category: "Supplements",
        subcategory: "Stress Support",
        labInput: "DHEA < 5.5",
        condition: "Dysregulated cortisol",
        recommendation: "Adaptogen adrenal support: Ashwagandha (500 mg) or Rhodiola rosea, or blend"
      },
      {
        category: "Supplements",
        subcategory: "Stress Support",
        historyInput: "Stress and Fatigue",
        condition: "Dysregulated cortisol + Brain Fog",
        recommendation: "Schisandra 30 drops 2x/day",
        notes: "(for liver support/cognitive support and more energy)",
        indications: "adaptogen"
      },
      {
        category: "Supplements",
        subcategory: "Stress Support",
        historyInput: "Stress and poor water intake",
        condition: "Dysregulated cortisol",
        recommendation: "Relax Matrix to sip throughout the day"
      },
      
      // Sleep Support
      {
        category: "Supplements",
        subcategory: "Sleep Support",
        historyInput: "feeling unrested upon waking",
        condition: "Poor sleep quality",
        recommendation: "Magnesium glycinate, melatonin (1-3 mg), valerian root, L-theanine"
      },
      {
        category: "Supplements",
        subcategory: "Sleep Support",
        historyInput: "trouble falling asleep/exposure to blue light",
        condition: "Circandian Rhythm regulation",
        recommendation: "Melatonin at physiological dose of 0.25 - 0.5mg sublingual"
      },
      
      // Hormonal Support
      {
        category: "Supplements",
        subcategory: "Hormonal Support",
        historyInput: "Low estrogen symptoms",
        condition: "Low estrogen",
        recommendation: "Phytoestrogens (e.g., flaxseed, soy)"
      },
      {
        category: "Supplements",
        subcategory: "Hormonal Support",
        historyInput: "Low testosterone symptoms",
        condition: "Low testosterone",
        recommendation: "Zinc (15-30 mg), Tribulus terrestris"
      },
      {
        category: "Supplements",
        subcategory: "Hormonal Support",
        historyInput: "Estrogen imbalance symptoms/constipation/xenoestrogens",
        condition: "Estrogen Dominance",
        recommendation: "Ca D glucorate 500 - 1000mg/d",
        indications: "prevents resorption of estrogen, helps with Phase II, environmental toxins"
      },
      {
        category: "Supplements",
        subcategory: "Hormonal Support",
        historyInput: "Estrogen imbalance symptoms",
        condition: "Estrogen Dominance",
        recommendation: "DIM (150 - 300mg daily)",
        indications: "alters metabolic pathway of E metabolism (↑ 2-OH and ↓ 16-OH E), inhibits aromatase (less T to E conversion), removes excess E from cells for elimination"
      },
      {
        category: "Supplements",
        subcategory: "Hormonal Support",
        historyInput: "Low progesterone symptoms/PMS",
        condition: "Low progesterone & early perimenopause",
        recommendation: "Vitex 20-40mg/d stardarized extract or 100-400mg/d whole herb"
      },
      
      // Thyroid Support
      {
        category: "Supplements",
        subcategory: "Thyroid Support",
        historyInput: "Dx hypothryoid/on meds",
        condition: "Hypothyroidism",
        recommendation: "Selenium (200 mcg), iodine rich foods (if no Hashimoto's), L-tyrosine?, ashwagandha",
        indications: "Selenium: for synthesis of thyroid hormone, conversion to T3, lowers Ab // L-tyrosine + iodine: for synthesis // ashwaghanda: thyroid hormone synthesis"
      },
      {
        category: "Supplements",
        subcategory: "Thyroid Support",
        labInput: "TSH > 2.0/ T3 < 4.2/ T4 < 14",
        condition: "Underactive Thyroid",
        recommendation: "Iron supplement every other day (if deficient)",
        notes: "Fe metabolism creates Hepcidin which inhibits Fe absorption"
      },
      {
        category: "Supplements",
        subcategory: "Thyroid Support",
        labInput: "TSH > 2.0/ T3 < 4.2/ T4 < 14",
        condition: "Underactive Thyroid",
        recommendation: "2-3 Brazil nuts (natural source of selenium)"
      },
      {
        category: "Supplements",
        subcategory: "Thyroid Support",
        labInput: "T3 < 4.2/ T4 > 14",
        condition: "Poor thyroid conversion (T4 to T3)",
        recommendation: "Zinc (15 - 30 mg), magnesium (200-400 mg), B vitamins"
      },
      
      // Gut Health Support
      {
        category: "Supplements",
        subcategory: "Gut Health Support",
        historyInput: "Hx of bloating/GERD/abnormal BM's/IBS",
        condition: "Bloating or dysbiosis",
        recommendation: "Probiotics (lactobacillus and bifidobacterium strains), Probiotic foods (yogurt, kimchie, saurkraut), digestive enzymes"
      },
      {
        category: "Supplements",
        subcategory: "Gut Health Support",
        historyInput: "Hx of bloating/GERD/constipation/IBS",
        condition: "Bloating or dysbiosis",
        recommendation: "Hydration protocol (oz = body weight/2)"
      },
      {
        category: "Supplements",
        subcategory: "Gut Health Support",
        historyInput: "Hx of cholecystectomy/bloating",
        condition: "Bloating or dysbiosis",
        recommendation: "Bile acids",
        notes: "to be taken with the meal",
        indications: "helps to break down fats in a meal to help with digestion"
      },
      
      // Blood Sugar Support
      {
        category: "Supplements",
        subcategory: "Blood Sugar Support",
        labInput: "A1C > 5.2",
        condition: "Elevated A1C",
        recommendation: "Berberine (600mg BID)",
        notes: "activates AMPK enzyme",
        indications: "helps with insulin sensitivity, inc glycolysis/reduces absorption of LDL/TG in gut/ balances microbiome"
      },
      {
        category: "Supplements",
        subcategory: "Blood Sugar Support",
        historyInput: "PCOS",
        labInput: "A1C > 5.2",
        condition: "Elevated A1C/PCOS",
        recommendation: "Myoinositol/D chiro insositol 40:1 (PCOSense or Inosicare OM)",
        indications: "helps with glucose balance and elevated T"
      },
      
      // Metabolic Support
      {
        category: "Supplements",
        subcategory: "Metabolic Support",
        historyInput: "if on statin/family hx of CAD",
        condition: "Metabolic syndrome",
        recommendation: "CoQ 10 (200mg daily)",
        notes: "Especially if on a statin"
      },
      {
        category: "Supplements",
        subcategory: "Metabolic Support",
        labInput: "Uric acid > 327",
        condition: "Elevated Uric Acid",
        recommendation: "Vit C 500mg daily",
        notes: "helps with uric acid clearance"
      },
      
      // HRT
      {
        category: "HRT",
        subcategory: "Estrogen",
        historyInput: "Low estrogen symptoms",
        condition: "Low estrogen",
        recommendation: "Estradiol patch, Estrogel"
      },
      {
        category: "HRT",
        subcategory: "Estrogen",
        historyInput: "Low estrogen symptoms",
        condition: "Low estrogen",
        recommendation: "Compounded estrogen cream (Biest)"
      },
      {
        category: "HRT",
        subcategory: "Estrogen",
        historyInput: "Hx of vaginal dryness",
        condition: "Vaginal dryness",
        recommendation: "Compounded estriol cream 1mg"
      },
      {
        category: "HRT",
        subcategory: "Estrogen",
        historyInput: "Hx of vaginal dryness",
        condition: "Vaginal dryness",
        recommendation: "Estring, Vagifem"
      },
      
      // Progesterone
      {
        category: "HRT",
        subcategory: "Progesterone",
        historyInput: "Low progesterone symptoms",
        condition: "Low progesterone",
        recommendation: "Micronized progesterone (100-200 mg at bedtime)"
      },
      {
        category: "HRT",
        subcategory: "Progesterone",
        historyInput: "Low progesterone symptoms",
        condition: "Low progesterone",
        recommendation: "Compounded progesterone cream (20-40mg hs or BID)"
      },
      
      // Testosterone
      {
        category: "HRT",
        subcategory: "Testosterone",
        historyInput: "Low testosterone symptoms",
        condition: "Low testosterone",
        recommendation: "Low-dose testosterone cream or gel"
      },
      
      // DHEA
      {
        category: "HRT",
        subcategory: "DHEA",
        labInput: "DHEA < 5.5",
        condition: "Low DHEA",
        recommendation: "Sublingual DHEA (2.5-10 mg/day, titrate as needed)"
      },
      
      // Mindset
      {
        category: "Mindset",
        subcategory: "Persistence",
        historyInput: "Difficulty maintaining new habits",
        condition: "Low habit persistence",
        recommendation: "Habit stacking (connect new habits to existing habits)"
      },
      {
        category: "Mindset",
        subcategory: "Self Compassion",
        historyInput: "Negative self-talk",
        condition: "Low self compassion",
        recommendation: "Dr. Kristen Neff self-compassion exercises"
      },
      {
        category: "Mindset",
        subcategory: "Pefection",
        historyInput: "Perfectionism tendencies",
        condition: "Perfectionism",
        recommendation: "Focus on 'good enough' rather than perfect"
      }
    ]
  };
}

export default LifestyleIntakeQuestionnaire;

// Introduction screen component
const IntroScreen = ({ onStart }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">Lifestyle Microhabits Assessment</h1>
      <div className="text-center mb-8">
        <p className="text-lg mb-4">
          Welcome to your personalized lifestyle assessment. This questionnaire will help identify
          areas of opportunity for improving your health and wellbeing through targeted microhabits.
        </p>
        <p className="mb-6">
          You'll be asked a series of questions about your health history and lifestyle. 
          We'll also collect any lab values you may have. Based on your responses, 
          we'll generate a personalized report with recommendations.
        </p>
      </div>
      <div className="flex justify-center items-center space-x-4 mb-8">
        <div className="flex flex-col items-center p-4 bg-indigo-50 rounded-lg w-48">
          <div className="text-4xl text-indigo-500 mb-2">1</div>
          <div className="text-center font-medium">Answer Lifestyle Questions</div>
        </div>
        <div className="text-indigo-400">→</div>
        <div className="flex flex-col items-center p-4 bg-indigo-50 rounded-lg w-48">
          <div className="text-4xl text-indigo-500 mb-2">2</div>
          <div className="text-center font-medium">Enter Lab Values (if available)</div>
        </div>
        <div className="text-indigo-400">→</div>
        <div className="flex flex-col items-center p-4 bg-indigo-50 rounded-lg w-48">
          <div className="text-4xl text-indigo-500 mb-2">3</div>
          <div className="text-center font-medium">Review Personalized Recommendations</div>
        </div>
      </div>
      <div className="text-center">
        <button
          onClick={onStart}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out"
        >
          Begin Assessment
        </button>
      </div>
    </div>
  );
};

// Questionnaire form component
const QuestionnaireForm = ({ 
  mappingData, 
  patientData, 
  categories,
  subcategories,
  onHistoryChange, 
  onNext,
  onBack 
}) => {
  const [expandedCategory, setExpandedCategory] = useState('Lifestyle');
  
  // Get all unique history inputs
  const historyInputs = Array.from(new Set(
    mappingData
      .filter(item => item.historyInput)
      .map(item => ({ 
        text: item.historyInput,
        category: item.category || 'Lifestyle',
        subcategory: item.subcategory || 'General'
      }))
  ));
  
  // Group history inputs by subcategory
  const groupedInputs = {};
  
  historyInputs.forEach(input => {
    const category = input.category;
    const subcategory = input.subcategory;
    
    if (!groupedInputs[category]) {
      groupedInputs[category] = {};
    }
    
    if (!groupedInputs[category][subcategory]) {
      groupedInputs[category][subcategory] = [];
    }
    
    groupedInputs[category][subcategory].push(input.text);
  });
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700">Health History Questionnaire</h2>
      <p className="mb-6">
        Please check all that apply to your current health situation and lifestyle:
      </p>
      
      <div className="mb-6">
        {categories.map(category => (
          <div key={category} className="mb-6">
            <button
              className="w-full flex justify-between items-center py-3 px-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-left font-semibold"
              onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
            >
              <span>{category}</span>
              <span>{expandedCategory === category ? '−' : '+'}</span>
            </button>
            
            {expandedCategory === category && (subcategories[category] || []).map(subcategory => {
              const inputs = (groupedInputs[category] && groupedInputs[category][subcategory]) || [];
              
              if (inputs.length === 0) return null;
              
              return (
                <div key={subcategory} className="mt-4 mb-6 pl-4">
                  <h3 className="text-lg font-medium mb-3 text-indigo-600">{subcategory}</h3>
                  <div className="space-y-2 pl-4">
                    {inputs.map(input => (
                      <div key={input} className="flex items-start">
                        <input
                          type="checkbox"
                          id={`history-${input}`}
                          className="mt-1"
                          checked={!!patientData.history[input]}
                          onChange={(e) => onHistoryChange(input, e.target.checked)}
                        />
                        <label htmlFor={`history-${input}`} className="ml-2">
                          {input}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg"
        >
          Continue to Lab Values
        </button>
      </div>
    </div>
  );
};

// Labs form component
const LabsForm = ({ mappingData, patientData, onLabChange, onGenerate, onBack }) => {
  // Get all unique lab inputs
  const labInputs = Array.from(new Set(
    mappingData
      .filter(item => item.labInput)
      .map(item => item.labInput)
  ));
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700">Lab Values</h2>
      <p className="mb-6">
        Please check any lab values that apply based on your most recent test results:
      </p>
      
      <div className="space-y-4">
        {labInputs.map(input => (
          <div key={input} className="flex items-start">
            <input
              type="checkbox"
              id={`lab-${input}`}
              className="mt-1"
              checked={!!patientData.labs[input]}
              onChange={(e) => onLabChange(input, e.target.checked)}
            />
            <label htmlFor={`lab-${input}`} className="ml-2">
              {input}
            </label>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg"
        >
          Back
        </button>
        <button
          onClick={onGenerate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
};
