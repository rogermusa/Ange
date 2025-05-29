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
