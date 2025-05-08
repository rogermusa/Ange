import React, { useState, useEffect } from 'react';

// Main application component
const LifestyleIntakeQuestionnaire = () => {
  // Application state
  const [step, setStep] = useState('intro');
  const [patientData, setPatientData] = useState({
    name: '',
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
  
  // Load the data
  useEffect(() => {
    const data = getMicrohabitsData();
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
    
    // Add items without categories
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
  
  // Handle the patient name input
  const handleNameChange = (name) => {
    setPatientData(prev => ({
      ...prev,
      name
    }));
  };
  
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
        const recKey = `${entry.recommendation}|${entry.condition}`;
        if (entry.recommendation && !recommendationMap.has(recKey)) {
          recommendationMap.set(recKey, {
            text: entry.recommendation,
            category,
            subcategory,
            condition: entry.condition,
            notes: entry.notes,
            indications: entry.indications,
            source: entry.historyInput || entry.labInput
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
      name: '',
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
            onStart={() => setStep('patient-info')}
          />
        );
      
      case 'patient-info':
        return (
          <PatientInfoForm
            patientName={patientData.name}
            onNameChange={handleNameChange}
            onNext={() => setStep('questionnaire')}
            onBack={() => setStep('intro')}
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
            onBack={() => setStep('patient-info')}
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
    <div className="min-h-screen bg-[#FDF6ED]">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap');
        .font-script {
          font-family: 'Dancing Script', cursive;
        }
      `}</style>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        
        {dataLoaded ? (
          <div>{renderStep()}</div>
        ) : (
          <div className="flex justify-center items-center min-h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-[#E19393]">Loading...</h2>
              <p className="text-gray-800">Preparing your lifestyle questionnaire</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Logo component
const Logo = () => (
  <div className="text-center mx-auto mb-8">
    <div className="w-72 h-72 relative mx-auto">
      {/* Sunburst rays */}
      {Array.from({ length: 36 }).map((_, i) => (
        <div 
          key={i} 
          style={{ 
            transform: `rotate(${i * 10}deg)`,
            background: '#F8E7CF',
            position: 'absolute',
            width: '2px',
            height: i % 2 === 0 ? '130px' : '115px',
            top: 'calc(50% - ' + (i % 2 === 0 ? '65px' : '57.5px') + ')',
            left: 'calc(50% - 1px)'
          }}
        ></div>
      ))}
      
      {/* Center circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-[#FDF6ED] opacity-80"></div>
      </div>
      
      {/* Text overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="font-script text-5xl text-[#E19393] z-10 whitespace-nowrap" style={{transform: "translateY(25px)"}}>
          Dr. Angelina Yee MD
        </h1>
      </div>
    </div>
    <p className="text-gray-800 text-lg -mt-12">Lifestyle & Functional Medicine</p>
  </div>
);

// Introduction screen component
const IntroScreen = ({ onStart }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 border border-gray-200">
      <h1 className="text-3xl font-bold text-center mb-6 text-[#E19393]">Lifestyle Microhabits Assessment</h1>
      <div className="text-center mb-8">
        <p className="text-lg mb-4 text-gray-800">
          Welcome to your personalized lifestyle assessment. This questionnaire will help identify
          areas of opportunity for improving your health and wellbeing through targeted microhabits.
        </p>
        <p className="mb-6 text-gray-800">
          You'll be asked a series of questions about your health history and lifestyle. 
          We'll also collect any lab values you may have. Based on your responses, 
          we'll generate a personalized report with recommendations.
        </p>
      </div>
      <div className="flex justify-center items-center space-x-4 mb-8">
        <div className="flex flex-col items-center p-4 bg-[#FDF6ED] rounded-lg w-40 border border-[#E19393] shadow-sm">
          <div className="text-3xl text-[#E19393] mb-2">1</div>
          <div className="text-center font-medium text-gray-800">Patient Info</div>
        </div>
        <div className="text-[#E19393]">→</div>
        <div className="flex flex-col items-center p-4 bg-[#FDF6ED] rounded-lg w-40 border border-[#E19393] shadow-sm">
          <div className="text-3xl text-[#E19393] mb-2">2</div>
          <div className="text-center font-medium text-gray-800">Health History</div>
        </div>
        <div className="text-[#E19393]">→</div>
        <div className="flex flex-col items-center p-4 bg-[#FDF6ED] rounded-lg w-40 border border-[#E19393] shadow-sm">
          <div className="text-3xl text-[#E19393] mb-2">3</div>
          <div className="text-center font-medium text-gray-800">Lab Values</div>
        </div>
        <div className="text-[#E19393]">→</div>
        <div className="flex flex-col items-center p-4 bg-[#FDF6ED] rounded-lg w-40 border border-[#E19393] shadow-sm">
          <div className="text-3xl text-[#E19393] mb-2">4</div>
          <div className="text-center font-medium text-gray-800">Recommendations</div>
        </div>
      </div>
      <div className="text-center">
        <button
          onClick={onStart}
          className="bg-[#E19393] hover:bg-[#d78080] text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out"
        >
          Begin Assessment
        </button>
      </div>
    </div>
  );
};

// Patient info form component
const PatientInfoForm = ({ patientName, onNameChange, onNext, onBack }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-[#E19393]">Patient Information</h2>
      
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2" htmlFor="patient-name">
          Full Name
        </label>
        <input
          type="text"
          id="patient-name"
          className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-[#E19393]"
          value={patientName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter your full name"
        />
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
          className="bg-[#E19393] hover:bg-[#d78080] text-white font-bold py-2 px-6 rounded-lg"
          disabled={!patientName.trim()}
        >
          Continue
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
  
  // Helper function to properly format text
  const formatText = (text) => {
    // Capitalize first letter
    let formattedText = text.charAt(0).toUpperCase() + text.slice(1);
    
    // Replace abbreviations
    formattedText = formattedText
      .replace(/BM's/g, "bowel movements")
      .replace(/GERD/g, "acid reflux")
      .replace(/IBS/g, "irritable bowel syndrome")
      .replace(/SAD diet/g, "Standard American Diet")
      .replace(/Dx/g, "Diagnosed")
      .replace(/Hx/g, "History")
      .replace(/PMR/g, "Progressive Muscle Relaxation");
      
    return formattedText;
  };

  // Get all unique history inputs
  const historyInputs = Array.from(new Set(
    mappingData
      .filter(item => item.historyInput)
      .map(item => ({ 
        text: formatText(item.historyInput),
        originalText: item.historyInput,
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
      <h2 className="text-2xl font-bold mb-6 text-[#E19393]">Health History Questionnaire</h2>
      <p className="mb-6">
        Please check all that apply to your current health situation and lifestyle:
      </p>
      
      <div className="mb-6">
        {categories.map(category => (
          <div key={category} className="mb-6">
            <button
              className="w-full flex justify-between items-center py-3 px-4 bg-[#FDF6ED] hover:bg-[#f5ede3] rounded-lg text-left font-semibold text-gray-800 border border-[#E19393] shadow-sm"
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
                  <h3 className="text-lg font-medium mb-3 text-[#E19393]">{subcategory}</h3>
                  <div className="space-y-2 pl-4">
                    {inputs.map(input => (
                      <div key={input} className="flex items-start">
                        <input
                          type="checkbox"
                          id={`history-${input}`}
                          className="mt-1"
                          checked={!!patientData.history[input.originalText]}
                          onChange={(e) => onHistoryChange(input.originalText, e.target.checked)}
                        />
                        <label htmlFor={`history-${input}`} className="ml-2 text-gray-800">
                          {input.text}
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
          className="bg-[#E19393] hover:bg-[#d78080] text-white font-bold py-2 px-6 rounded-lg"
        >
          Continue to Lab Values
        </button>
      </div>
    </div>
  );
};

// Labs form component
const LabsForm = ({ mappingData, patientData, onLabChange, onGenerate, onBack }) => {
  // Helper function to properly format text
  const formatLabText = (text) => {
    // Make first letter uppercase
    let formattedText = text.charAt(0).toUpperCase() + text.slice(1);
    
    // Replace abbreviations and expand
    formattedText = formattedText
      .replace(/Vit D/g, "Vitamin D")
      .replace(/DHEA/g, "DHEA (Dehydroepiandrosterone)")
      .replace(/A1C/g, "Hemoglobin A1C")
      .replace(/TSH/g, "Thyroid Stimulating Hormone")
      .replace(/TG/g, "Triglycerides")
      .replace(/total chol/g, "Total Cholesterol");
      
    return formattedText;
  };
  
  // Get all unique lab inputs
  const labInputs = Array.from(new Set(
    mappingData
      .filter(item => item.labInput)
      .map(item => ({
        text: formatLabText(item.labInput),
        originalText: item.labInput
      }))
  ));
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-[#E19393]">Lab Values</h2>
      <p className="mb-6 text-gray-800">
        Please check any lab values that apply based on your most recent test results:
      </p>
      
      <div className="space-y-4">
        {labInputs.map(input => (
          <div key={input.originalText} className="flex items-start">
            <input
              type="checkbox"
              id={`lab-${input.originalText}`}
              className="mt-1"
              checked={!!patientData.labs[input.originalText]}
              onChange={(e) => onLabChange(input.originalText, e.target.checked)}
            />
            <label htmlFor={`lab-${input.originalText}`} className="ml-2 text-gray-800">
              {input.text}
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
          className="bg-[#E19393] hover:bg-[#d78080] text-white font-bold py-2 px-6 rounded-lg"
        >
          Generate Report
        </button>
      </div>
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
      <div className="p-6 bg-[#E19393] rounded-t-lg">
        <h2 className="text-2xl font-bold text-white mb-2">
          {patientData.name}'s Personalized Health Report
        </h2>
        <p className="text-white opacity-90">
          Based on your {totalSelected} selected items, we've identified specific areas for improvement with tailored recommendations.
        </p>
      </div>
      
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'summary' 
                ? 'border-b-2 border-[#E19393] text-[#E19393]' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
          <button
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'conditions' 
                ? 'border-b-2 border-[#E19393] text-[#E19393]' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('conditions')}
          >
            Identified Conditions
          </button>
          <button
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'recommendations' 
                ? 'border-b-2 border-[#E19393] text-[#E19393]' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('recommendations')}
          >
            Recommendations
          </button>
          <button
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'direct' 
                ? 'border-b-2 border-[#E19393] text-[#E19393]' 
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
            <h3 className="text-xl font-bold mb-4 text-[#E19393]">Health Overview</h3>
            
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
                      <div key={category} className="bg-[#FDF6ED] rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{category}</span>
                          <span className="text-[#E19393] font-semibold">{score} items</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-[#E19393] h-2.5 rounded-full" 
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
            <h3 className="text-xl font-bold mb-4 text-[#E19393]">Identified Conditions & Triggers</h3>
            
            {conditions.length > 0 ? (
              <div className="space-y-6">
                {conditions.map((condition, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-200 rounded-lg p-4 hover:bg-[#FDF6ED]"
                  >
                    <h4 className="font-semibold text-[#E19393]">{condition.name}</h4>
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
            <h3 className="text-xl font-bold mb-4 text-[#E19393]">Detailed Recommendations</h3>
            
            {recommendations.length > 0 ? (
              <div className="space-y-8">
                {Object.entries(groupedRecommendations).map(([category, subcats]) => (
                  <div key={category} className="border-b border-gray-200 pb-6 last:border-0">
                    <h4 className="text-lg font-semibold text-[#E19393] mb-4">{category}</h4>
                    
                    {Object.entries(subcats).map(([subcategory, recs]) => (
                      <div key={subcategory} className="mb-6 last:mb-0">
                        <h5 className="font-medium text-gray-800 mb-3">{subcategory}</h5>
                        
                        <div className="space-y-4 pl-4">
                          {recs.map((rec, index) => (
                            <div key={index} className="bg-[#FDF6ED] rounded-lg p-4">
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
            <h3 className="text-xl font-bold mb-4 text-[#E19393]">Direct Mapping: Inputs to Recommendations</h3>
            
            {matchedEntries && matchedEntries.length > 0 ? (
              <div className="space-y-6">
                {matchedEntries.map((entry, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-200 rounded-lg p-4 hover:bg-[#FDF6ED]"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="md:col-span-2">
                        <h5 className="font-medium text-[#E19393] mb-2">Input</h5>
                        <div className="p-3 bg-[#FDF6ED] rounded-lg">
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
                        <h5 className="font-medium text-[#E19393] mb-2">Recommendation</h5>
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
            
            <div className="mt-6 p-4 bg-[#FDF6ED] rounded-lg">
              <p className="font-medium text-[#E19393]">
                Total inputs selected: {totalSelected} | Total recommendations: {matchedEntries?.length || 0}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                Each recommendation is directly tied to a specific input you provided.
              </p>
            </div>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <button
            onClick={onRestart}
            className="bg-[#E19393] hover:bg-[#d78080] text-white font-bold py-2 px-6 rounded-lg"
          >
            Start New Assessment
          </button>
          <button
            onClick={() => window.print()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg ml-4"
          >
            Print Report
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
      
      // Basic Stack
      {
        category: "Supplements",
        subcategory: "Basic Stack",
        labInput: "Vit D < 90",
        condition: "General health support",
        recommendation: "Vitamin D3 (2,000-5,000 IU/day), Magnesium glycinate (300-400 mg), B-complex, Omega-3 (2 g EPA/DHA)"
      },
      
      // Stress Support
      {
        category: "Supplements",
        subcategory: "Stress Support",
        labInput: "DHEA < 5.5",
        condition: "Dysregulated cortisol",
        recommendation: "Adaptogen adrenal support: Ashwagandha (500 mg) or Rhodiola rosea, or blend"
      },
      
      // Sleep Support
      {
        category: "Supplements",
        subcategory: "Sleep Support",
        historyInput: "feeling unrested upon waking",
        condition: "Poor sleep quality",
        recommendation: "Magnesium glycinate, melatonin (1-3 mg), valerian root, L-theanine"
      },
      
      // Hormonal Support
      {
        category: "Supplements",
        subcategory: "Hormonal Support",
        historyInput: "Low estrogen symptoms",
        condition: "Low estrogen",
        recommendation: "Phytoestrogens (e.g., flaxseed, soy)"
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
      }
    ]
  };
}

export default LifestyleIntakeQuestionnaire;
