// src/App.js
import React, { useState, useEffect } from 'react';
import Logo from './components/Logo';
import IntroScreen from './components/IntroScreen';
import QuestionnaireForm from './components/QuestionnaireForm';
import LabsForm from './components/LabsForm';
import ReportCard from './components/ReportCard';
import ReportDocument from './components/ReportDocument';
import './App.css';
import getMicrohabitsData from './dataLoader';

const App = () => {
  const [step, setStep] = useState('intro');
  const [patientData, setPatientData] = useState({ name: '', history: {}, labs: {} });
  const [mappingData, setMappingData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [reportData, setReportData] = useState({ conditions: [], recommendations: [], scores: {} });
  const [categoryScores, setCategoryScores] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const data = getMicrohabitsData();
    setMappingData(data.mappingData);

    const cats = Array.from(new Set(data.mappingData.filter(item => item.category).map(item => item.category)));
    setCategories(cats);

    const subCats = {};
    cats.forEach(cat => {
      subCats[cat] = Array.from(new Set(data.mappingData.filter(item => item.category === cat && item.subcategory).map(item => item.subcategory)));
    });

    const undefinedCats = Array.from(new Set(data.mappingData.filter(item => !item.category && item.subcategory).map(item => item.subcategory)));
    if (undefinedCats.length > 0) {
      subCats['Lifestyle'] = [...new Set([...(subCats['Lifestyle'] || []), ...undefinedCats])];
    }

    setSubcategories(subCats);
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
    const scores = {};

    mappingData.forEach(entry => {
      let match = false;
      const entryKey = `${entry.historyInput || ''}|${entry.labInput || ''}`;

      if (entry.historyInput && patientData.history[entry.historyInput]) match = true;
      if (entry.labInput && patientData.labs[entry.labInput]) match = true;

      if (match) {
        const category = entry.category || 'Lifestyle';
        const subcategory = entry.subcategory || 'General';

        scores[category] = scores[category] || {};
        scores[category][subcategory] = (scores[category][subcategory] || 0) + 1;
        matchedEntries.push({ ...entry, key: entryKey });

        if (entry.condition) {
          conditionMap.set(entry.condition, { name: entry.condition, category, subcategory, source: entry.historyInput || entry.labInput });
        }

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
    setReportData({ conditions: [], recommendations: [], scores: {} });
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
        return <div>Loading...</div>;
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
