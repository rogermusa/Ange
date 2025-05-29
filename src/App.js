// src/App.js
import React, { useState, useEffect } from 'react';
import Logo from './components/Logo'; // Assuming Logo.jsx exists in ./components/
import IntroScreen from './components/IntroScreen'; // Assuming IntroScreen.jsx exists in ./components/
import QuestionnaireForm from './components/QuestionnaireForm'; // Assuming QuestionnaireForm.jsx exists in ./components/
import LabsForm from './components/LabsForm'; // Assuming LabsForm.jsx exists in ./components/
import ReportCard from './components/ReportCard'; // Assuming ReportCard.jsx exists in ./components/
// import ReportDocument from './components/ReportDocument'; // For PDF generation if re-enabled
import './App.css'; // Assuming App.css exists
import getMicrohabitsData from './dataLoader'; // This is the updated dataLoader.js

const App = () => {
  const [step, setStep] = useState('intro');
  const [patientData, setPatientData] = useState({ name: '', history: {}, labs: {} });
  const [mappingData, setMappingData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [reportData, setReportData] = useState({ conditions: [], recommendations: [], scores: {}, matchedEntries: [] });
  const [categoryScores, setCategoryScores] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    // Load the data from dataLoader.js
    const data = getMicrohabitsData();
    setMappingData(data.mappingData);

    // --- Logic for QuestionnaireForm categories/subcategories ---
    // 1. Filter for items that will appear in the questionnaire (those with a non-empty historyInput)
    const questionnaireItems = data.mappingData.filter(item => item.historyInput && String(item.historyInput).trim() !== "");

    const categoriesForQuestionnaireSet = new Set();
    const subcategoriesMapForQuestionnaire = {};

    questionnaireItems.forEach(item => {
      // Determine effective category: use item.category or default to 'Lifestyle'
      const effectiveCategory = (item.category && String(item.category).trim() !== "") ? String(item.category).trim() : 'Lifestyle';
      // Determine effective subcategory: use item.subcategory or default to 'General'
      const effectiveSubcategory = (item.subcategory && String(item.subcategory).trim() !== "") ? String(item.subcategory).trim() : 'General';

      categoriesForQuestionnaireSet.add(effectiveCategory);

      if (!subcategoriesMapForQuestionnaire[effectiveCategory]) {
        subcategoriesMapForQuestionnaire[effectiveCategory] = new Set();
      }
      subcategoriesMapForQuestionnaire[effectiveCategory].add(effectiveSubcategory);
    });

    let finalCategories = Array.from(categoriesForQuestionnaireSet);
    
    // Ensure 'Lifestyle' is present if there are questionnaire items but it wasn't explicitly derived
    // (though the defaulting logic above should handle this)
    if (questionnaireItems.length > 0 && !categoriesForQuestionnaireSet.has('Lifestyle') && finalCategories.every(cat => cat !== 'Lifestyle')) {
        const hasDefaultedToLifestyle = questionnaireItems.some(item => (!item.category || String(item.category).trim() === ""));
        if (hasDefaultedToLifestyle) {
            finalCategories.push('Lifestyle');
        }
    }
    // If after all processing, no categories are found but there are items, default to Lifestyle
    if (questionnaireItems.length > 0 && finalCategories.length === 0) {
        finalCategories.push('Lifestyle');
    }
    
    finalCategories.sort(); 
    setCategories(finalCategories);

    const finalSubcategories = {};
    finalCategories.forEach(cat => {
      const subs = subcategoriesMapForQuestionnaire[cat] ? Array.from(subcategoriesMapForQuestionnaire[cat]) : [];
      finalSubcategories[cat] = (subs.length > 0 ? subs : ['General']).sort();
    });
    setSubcategories(finalSubcategories);
    // --- End of QuestionnaireForm specific logic ---

    setDataLoaded(true);
    // console.log('App.js - Categories Loaded:', finalCategories);
    // console.log('App.js - Subcategories Loaded:', finalSubcategories);
    // console.log('App.js - Questionnaire Items Count:', questionnaireItems.length);

  }, []);

  const handlePatientNameChange = (value) => {
    setPatientData(prev => ({ ...prev, name: value }));
  };

  const handleHistoryChange = (input, value) => {
    setPatientData(prev => ({ ...prev, history: { ...prev.history, [input]: value } }));
  };

  const handleLabChange = (input, value) => {
    setPatientData(prev => ({ ...prev, labs: { ...prev.labs, [input]: value } }));
  };

  const generateReport = () => {
    const conditionMap = new Map();
    const recommendationMap = new Map();
    const matchedEntries = [];
    const scores = {}; // Scores per category and subcategory: scores[category][subcategory] = count

    mappingData.forEach(entry => {
      let match = false;
      
      // Check history inputs
      if (entry.historyInput && patientData.history[entry.historyInput]) {
        match = true;
      }
      // Check lab inputs
      if (entry.labInput && patientData.labs[entry.labInput]) {
        match = true;
      }

      if (match) {
        const category = (entry.category && String(entry.category).trim() !== "") ? String(entry.category).trim() : 'Lifestyle';
        const subcategory = (entry.subcategory && String(entry.subcategory).trim() !== "") ? String(entry.subcategory).trim() : 'General';

        // Increment scores
        if (!scores[category]) {
          scores[category] = {};
        }
        scores[category][subcategory] = (scores[category][subcategory] || 0) + 1;
        
        const matchedInputIdentifier = entry.historyInput && patientData.history[entry.historyInput] 
                                      ? entry.historyInput 
                                      : (entry.labInput && patientData.labs[entry.labInput] ? entry.labInput : 'N/A');
        
        matchedEntries.push({ ...entry, matchedInput: matchedInputIdentifier });

        if (entry.condition) {
          const conditionKey = entry.condition; 
          if (!conditionMap.has(conditionKey)) {
            conditionMap.set(conditionKey, { 
              name: entry.condition, 
              category, 
              subcategory, 
              source: matchedInputIdentifier,
              originalEntry: entry 
            });
          } else {
            // Optionally, if a condition can be triggered by multiple inputs, append sources
            const existingCond = conditionMap.get(conditionKey);
            if (!String(existingCond.source).includes(matchedInputIdentifier)) {
                existingCond.source += `, ${matchedInputIdentifier}`;
            }
          }
        }

        if (entry.recommendation) {
           const recKey = `${entry.recommendation}|${entry.condition || 'General Advice'}`;
          if (!recommendationMap.has(recKey)) {
            recommendationMap.set(recKey, {
              text: entry.recommendation,
              category,
              subcategory,
              condition: entry.condition,
              notes: entry.notes,
              indications: entry.indications,
              source: matchedInputIdentifier,
              originalEntry: entry
            });
          }
        }
      }
    });

    const catScores = {};
    Object.keys(scores).forEach(category => {
      catScores[category] = Object.values(scores[category]).reduce((sum, count) => sum + count, 0);
    });

    const conditions = Array.from(conditionMap.values());
    const recommendations = Array.from(recommendationMap.values());

    setReportData({ conditions, recommendations, scores, matchedEntries });
    setCategoryScores(catScores);
    setStep('report');
  };
  
  const restartQuestionnaire = () => {
    setPatientData({ name: '', history: {}, labs: {} });
    setReportData({ conditions: [], recommendations: [], scores: {}, matchedEntries: [] });
    setCategoryScores({});
    setStep('intro');
  };

  const renderStep = () => {
    switch (step) {
      case 'intro':
        return <IntroScreen patientName={patientData.name} onPatientNameChange={handlePatientNameChange} onStart={() => setStep('questionnaire')} />;
      case 'questionnaire':
        // Pass only the relevant part of mappingData if QuestionnaireForm doesn't need all of it
        return <QuestionnaireForm 
                  mappingData={mappingData.filter(item => item.historyInput && String(item.historyInput).trim() !== "")} 
                  patientData={patientData} 
                  categories={categories} 
                  subcategories={subcategories} 
                  onHistoryChange={handleHistoryChange} 
                  onNext={() => setStep('labs')} 
                  onBack={() => setStep('intro')} 
                />;
      case 'labs':
        // Pass only the relevant part of mappingData if LabsForm doesn't need all of it
        return <LabsForm 
                  mappingData={mappingData.filter(item => item.labInput && String(item.labInput).trim() !== "")} 
                  patientData={patientData} 
                  onLabChange={handleLabChange} 
                  onGenerate={generateReport} 
                  onBack={() => setStep('questionnaire')} 
                />;
      case 'report':
        return <ReportCard 
                  reportData={reportData} 
                  categoryScores={categoryScores} 
                  patientData={patientData} 
                  onRestart={restartQuestionnaire} 
                />;
      default:
        return <div>Loading report generation step...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
      {dataLoaded ? (
        <div className="container mx-auto px-4 py-6">
          <Logo />
          {renderStep()}
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <Logo />
            <h2 className="text-2xl font-bold mb-4 text-coral">Loading...</h2>
            <p className="text-coral-light">Preparing your lifestyle questionnaire</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

// src/components/QuestionnaireForm.jsx
import React, { useState, useEffect } from 'react';

const QuestionnaireForm = ({ 
  mappingData, // This will now be pre-filtered by App.js to only include historyInput items
  patientData, 
  categories,
  subcategories,
  onHistoryChange, 
  onNext,
  onBack 
}) => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Effect to set the initial expanded category once categories are loaded
  useEffect(() => {
    if (categories && categories.length > 0 && expandedCategory === null) {
      setExpandedCategory(categories[0]);
    }
  }, [categories, expandedCategory]);


  // Prepare inputs for the questionnaire.
  // mappingData is already filtered for historyInput items by App.js
  const historyQuestionnaireItems = mappingData.map(item => {
    let displayText = String(item.historyInput).trim(); // Ensure it's a string and trim
    if (displayText.length > 0) {
      displayText = displayText.charAt(0).toUpperCase() + displayText.slice(1);
    }
    return { 
      text: String(item.historyInput).trim(), // The original value for state key
      displayText: displayText, // For display
      // Effective category/subcategory determination is now primarily handled in App.js
      // but we can use the same defaults here for consistency if mappingData items were somehow malformed
      // (though App.js filtering should prevent that)
      category: (item.category && String(item.category).trim() !== "") ? String(item.category).trim() : 'Lifestyle', 
      subcategory: (item.subcategory && String(item.subcategory).trim() !== "") ? String(item.subcategory).trim() : 'General'
    };
  });

  // Group these history inputs by their effective category and subcategory
  const groupedInputs = {};
  historyQuestionnaireItems.forEach(input => {
    const category = input.category;
    const subcategory = input.subcategory;

    if (!groupedInputs[category]) {
      groupedInputs[category] = {};
    }
    if (!groupedInputs[category][subcategory]) {
      groupedInputs[category][subcategory] = [];
    }
    
    // Avoid adding duplicate input objects if the text value is the same within the same cat/subcat
    if (!groupedInputs[category][subcategory].some(i => i.value === input.text)) {
        groupedInputs[category][subcategory].push({
            value: input.text,
            display: input.displayText
        });
    }
  });
  
  // `categories` prop from App.js should be the definitive list of categories to display
  const displayCategories = Array.isArray(categories) ? categories : [];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-coral-light">
      <h2 className="text-2xl font-bold mb-6 text-coral">Health History Questionnaire</h2>
      <p className="mb-6 text-coral">
        Please check all that apply to your current health situation and lifestyle:
      </p>

      <div className="mb-6">
        {displayCategories.length === 0 && <p className="text-coral-dark">No questionnaire items available. Please check data source.</p>}
        {displayCategories.map(category => (
          <div key={category} className="mb-6">
            <button
              className={`w-full flex justify-between items-center py-3 px-4 ${
                expandedCategory === category ? 'bg-cream' : 'bg-cream-light'
              } hover:bg-cream rounded-xl text-left font-semibold text-coral-dark shadow-sm transition duration-200 ease-in-out border border-coral-light`}
              onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
            >
              <span>{category}</span>
              <span className="text-coral text-xl">{expandedCategory === category ? '−' : '+'}</span>
            </button>

            {expandedCategory === category && 
             subcategories && // Ensure subcategories object exists
             Array.isArray(subcategories[category]) && 
             subcategories[category].map(subcategory => {
              // Use the groupedInputs derived from historyQuestionnaireItems
              const inputsToRender = (groupedInputs[category] && groupedInputs[category][subcategory]) || [];
              if (inputsToRender.length === 0) return null;

              return (
                <div key={`${category}-${subcategory}`} className="mt-4 mb-6 pl-4">
                  <h3 className="text-lg font-medium mb-3 text-coral-dark border-b border-coral-light pb-1">{subcategory}</h3>
                  <div className="space-y-3 pl-4">
                    {inputsToRender.map(inputObj => {
                      const inputValue = inputObj.value; 
                      const displayText = inputObj.display;
                      // Create a more robust ID for HTML elements
                      const inputId = `history-${category}-${subcategory}-${inputValue}`.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
                      return (
                        <div key={inputId} className="flex items-start transition duration-200 ease-in-out hover:bg-cream-light p-2 rounded-lg">
                          <input
                            type="checkbox"
                            id={inputId}
                            className="mt-1 h-4 w-4 text-coral focus:ring-coral rounded"
                            checked={!!patientData.history[inputValue]} // inputValue is the key for patientData.history
                            onChange={(e) => onHistoryChange(inputValue, e.target.checked)}
                          />
                          <label htmlFor={inputId} className="ml-3 text-coral-dark">
                            {displayText}
                          </label>
                        </div>
                      );
                    })}
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
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-xl shadow-md transition duration-300 ease-in-out"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="bg-gradient-to-r from-coral to-coral-dark hover:from-coral-dark hover:to-coral-darker text-white font-bold py-2 px-6 rounded-xl shadow-md transition duration-300 ease-in-out"
        >
          Continue to Lab Values
        </button>
      </div>
    </div>
  );
};

export default QuestionnaireForm;

// --- Ensure you have these other component files in ./components/ ---
// components/Logo.jsx
// components/IntroScreen.jsx
// components/LabsForm.jsx
// components/ReportCard.jsx
// components/ReportDocument.jsx (if used)

// Example for components/Logo.jsx (if you don't have it)
// const Logo = () => <div className="text-center py-4"><h1 className="text-4xl font-bold text-coral">AppLogo</h1></div>;
// export default Logo;

// Example for components/IntroScreen.jsx (basic structure)
// const IntroScreen = ({ patientName, onPatientNameChange, onStart }) => (
//   <div>
//     <h1>Intro</h1>
//     <input type="text" value={patientName} onChange={e => onPatientNameChange(e.target.value)} placeholder="Patient Name" />
//     <button onClick={onStart} disabled={!patientName.trim()}>Start</button>
//   </div>
// );
// export default IntroScreen;

// Example for components/LabsForm.jsx (basic structure)
// const LabsForm = ({ mappingData, patientData, onLabChange, onGenerate, onBack }) => {
//   const labItems = mappingData.filter(item => item.labInput && String(item.labInput).trim() !== "");
//   return (
//     <div>
//       <h2>Labs</h2>
//       {labItems.map(item => (
//         <div key={item.labInput}>
//           <input type="checkbox" id={item.labInput} checked={!!patientData.labs[item.labInput]} onChange={e => onLabChange(item.labInput, e.target.checked)} />
//           <label htmlFor={item.labInput}>{item.labInput}</label>
//         </div>
//       ))}
//       <button onClick={onBack}>Back</button>
//       <button onClick={onGenerate}>Generate Report</button>
//     </div>
//   );
// };
// export default LabsForm;

// Example for components/ReportCard.jsx (basic structure)
// const ReportCard = ({ reportData, patientData, onRestart }) => (
//   <div>
//     <h1>Report for {patientData.name}</h1>
//     <button onClick={onRestart}>Restart</button>
//   </div>
// );
// export default ReportCard;

