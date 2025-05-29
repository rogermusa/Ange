// src/App.js
import React, { useState, useEffect } from 'react';
import Logo from './components/Logo';
import IntroScreen from './components/IntroScreen';
import QuestionnaireForm from './components/QuestionnaireForm';
import LabsForm from './components/LabsForm';
import ReportCard from './components/ReportCard';
// import ReportDocument from './components/ReportDocument'; // ReportDocument can be used if PDF generation is re-enabled
import './App.css';
import getMicrohabitsData from './dataLoader';

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
    const data = getMicrohabitsData();
    setMappingData(data.mappingData);

    // Filter for items relevant to QuestionnaireForm (those with historyInput)
    // and derive categories/subcategories based on how QuestionnaireForm will interpret them.
    const historyMappingData = data.mappingData.filter(item => item.historyInput);

    const effectiveCategories = new Set();
    const effectiveSubcategoriesMap = {};

    historyMappingData.forEach(item => {
      const category = item.category || 'Lifestyle'; // Default category
      const subcategory = item.subcategory || 'General'; // Default subcategory

      effectiveCategories.add(category);

      if (!effectiveSubcategoriesMap[category]) {
        effectiveSubcategoriesMap[category] = new Set();
      }
      effectiveSubcategoriesMap[category].add(subcategory);
    });

    const finalCategories = Array.from(effectiveCategories);
    if (finalCategories.length === 0 && data.mappingData.some(item => item.historyInput)) {
      // If there are history inputs but no explicit categories, ensure 'Lifestyle' is present
      finalCategories.push('Lifestyle');
    }


    const finalSubcategories = {};
    finalCategories.forEach(cat => {
      finalSubcategories[cat] = Array.from(effectiveSubcategoriesMap[cat] || new Set(['General']));
      if (finalSubcategories[cat].length === 0 && data.mappingData.some(item => (item.category || 'Lifestyle') === cat && item.historyInput)) {
        // If a category exists for history inputs but no subcategories were explicitly found,
        // ensure 'General' is present as a subcategory for it.
        finalSubcategories[cat].push('General');
      }
    });
    
    // Ensure 'Lifestyle' category exists if there are any history inputs at all,
    // and it has at least a 'General' subcategory if not otherwise specified.
    if (historyMappingData.length > 0 && !finalCategories.includes('Lifestyle')) {
        finalCategories.push('Lifestyle');
    }
    if (finalCategories.includes('Lifestyle') && (!finalSubcategories['Lifestyle'] || finalSubcategories['Lifestyle'].length === 0)) {
        finalSubcategories['Lifestyle'] = Array.from(new Set([...(finalSubcategories['Lifestyle'] || []), 'General']));
    }


    setCategories(finalCategories.sort()); // Sort for consistent order
    
    // Sort subcategories for consistent order
    for (const cat in finalSubcategories) {
      finalSubcategories[cat].sort();
    }
    setSubcategories(finalSubcategories);

    setDataLoaded(true);
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
      // Unique key for an entry based on its inputs.
      // Consider if an entry could be matched by history AND lab for different purposes.
      // For now, any match makes the entry relevant.
      const entryKey = `${entry.category || 'N/A'}-${entry.subcategory || 'N/A'}-${entry.historyInput || 'N/A'}-${entry.labInput || 'N/A'}`;

      // Check history inputs
      if (entry.historyInput && patientData.history[entry.historyInput]) {
        match = true;
      }
      // Check lab inputs
      if (entry.labInput && patientData.labs[entry.labInput]) {
        match = true;
      }

      if (match) {
        const category = entry.category || 'Lifestyle'; // Defaulting
        const subcategory = entry.subcategory || 'General'; // Defaulting

        // Increment scores
        if (!scores[category]) {
          scores[category] = {};
        }
        scores[category][subcategory] = (scores[category][subcategory] || 0) + 1;
        
        // Store the matched entry details
        // Use a more robust key for matchedEntries if needed, or ensure data structure handles it
        matchedEntries.push({ ...entry, key: entryKey, matchedInput: entry.historyInput && patientData.history[entry.historyInput] ? entry.historyInput : entry.labInput });


        if (entry.condition) {
          // Use a composite key for conditionMap if a condition can appear in multiple cats/subcats
          // For simplicity, assume condition name is unique enough for now or handled by source.
          const conditionKey = entry.condition; // Or `${entry.condition}|${category}|${subcategory}`
          if (!conditionMap.has(conditionKey)) {
            conditionMap.set(conditionKey, { 
              name: entry.condition, 
              category, 
              subcategory, 
              // Differentiate source if an entry has both history and lab, and both are checked
              source: entry.historyInput && patientData.history[entry.historyInput] ? entry.historyInput : (entry.labInput && patientData.labs[entry.labInput] ? entry.labInput : 'N/A'),
              originalEntry: entry // Keep reference to original data
            });
          }
        }

        if (entry.recommendation) {
          // Key recommendations by their text and related condition to avoid duplicates for the same advice on the same issue
           const recKey = `${entry.recommendation}|${entry.condition || 'General Advice'}`;
          if (!recommendationMap.has(recKey)) {
            recommendationMap.set(recKey, {
              text: entry.recommendation,
              category,
              subcategory,
              condition: entry.condition,
              notes: entry.notes,
              indications: entry.indications,
              source: entry.historyInput && patientData.history[entry.historyInput] ? entry.historyInput : (entry.labInput && patientData.labs[entry.labInput] ? entry.labInput : 'N/A'),
              originalEntry: entry // Keep reference to original data
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
        return <QuestionnaireForm mappingData={mappingData} patientData={patientData} categories={categories} subcategories={subcategories} onHistoryChange={handleHistoryChange} onNext={() => setStep('labs')} onBack={() => setStep('intro')} />;
      case 'labs':
        return <LabsForm mappingData={mappingData} patientData={patientData} onLabChange={handleLabChange} onGenerate={generateReport} onBack={() => setStep('questionnaire')} />;
      case 'report':
        return <ReportCard reportData={reportData} categoryScores={categoryScores} patientData={patientData} onRestart={restartQuestionnaire} />;
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
