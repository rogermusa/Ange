// src/components/ReportCard.jsx
import React, { useState } from 'react';

const ReportCard = ({ reportData, categoryScores, patientData, onRestart }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const { conditions, recommendations, matchedEntries } = reportData;

  const groupedRecommendations = {};
  recommendations.forEach(rec => {
    const category = rec.category || 'Lifestyle';
    const subcategory = rec.subcategory || 'General';
    if (!groupedRecommendations[category]) groupedRecommendations[category] = {};
    if (!groupedRecommendations[category][subcategory]) groupedRecommendations[category][subcategory] = [];
    groupedRecommendations[category][subcategory].push(rec);
  });

  const sortedCategories = Object.entries(categoryScores)
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category);

  const totalSelected = Object.keys(patientData.history).length + Object.keys(patientData.labs).length;

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-coral-light">
      <div className="p-6 bg-gradient-to-r from-coral to-coral-dark rounded-t-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h2 className="text-2xl font-bold text-white mb-2">Personalized Health Report</h2>
          <div className="text-white text-sm md:text-base">
            Patient: <span className="font-semibold">{patientData.name}</span> | Date: {new Date().toLocaleDateString()}
          </div>
        </div>
        <p className="text-white opacity-90">
          Based on {totalSelected} selected items, we've identified specific areas for improvement with tailored recommendations.
        </p>
      </div>

      <div className="border-b border-coral-light">
        <nav className="flex overflow-x-auto">
          {['summary', 'conditions', 'recommendations', 'direct'].map(tab => (
            <button
              key={tab}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === tab 
                  ? 'border-b-2 border-coral text-coral bg-cream-light' 
                  : 'text-gray-500 hover:text-coral hover:bg-cream-light'
              } transition duration-200 ease-in-out`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-8">
        {activeTab === 'summary' && (
          <div>
            <h3 className="text-xl font-bold mb-4 text-coral">Health Overview</h3>
            <p className="mb-4 text-coral-dark">
              {conditions.length} conditions and {recommendations.length} recommendations across {Object.keys(groupedRecommendations).length} categories.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedCategories.slice(0, 4).map(category => (
                <div key={category} className="bg-cream-light p-4 rounded-xl shadow-md">
                  <div className="font-bold text-coral-dark mb-2">{category}</div>
                  <div className="text-sm">{categoryScores[category]} items matched</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'conditions' && (
          <div>
            <h3 className="text-xl font-bold mb-4 text-coral">Conditions</h3>
            {conditions.map((cond, idx) => (
              <div key={idx} className="bg-cream-light mb-4 p-4 rounded-xl shadow">
                <strong>{cond.name}</strong><br />
                Category: {cond.category} / {cond.subcategory}<br />
                Identified from: {cond.source}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div>
            <h3 className="text-xl font-bold mb-4 text-coral">Recommendations</h3>
            {Object.entries(groupedRecommendations).map(([category, subcats]) => (
              <div key={category} className="mb-6">
                <h4 className="text-lg font-semibold text-coral-dark mb-2">{category}</h4>
                {Object.entries(subcats).map(([subcategory, recs]) => (
                  <div key={subcategory} className="ml-4 mb-4">
                    <div className="font-medium text-coral-dark mb-1">{subcategory}</div>
                    <ul className="list-disc list-inside text-sm">
                      {recs.map((rec, idx) => (
                        <li key={idx}>{rec.text}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'direct' && (
          <div>
            <h3 className="text-xl font-bold mb-4 text-coral">Input → Recommendation</h3>
            {matchedEntries.map((entry, idx) => (
              <div key={idx} className="bg-cream-light p-4 mb-3 rounded-xl shadow-sm">
                <div><strong>Input:</strong> {entry.historyInput || entry.labInput}</div>
                <div><strong>Condition:</strong> {entry.condition}</div>
                <div><strong>Recommendation:</strong> {entry.recommendation}</div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={onRestart}
            className="bg-gradient-to-r from-coral to-coral-dark hover:from-coral-dark hover:to-coral-darker text-white font-bold py-3 px-8 rounded-xl shadow-lg transition duration-300 ease-in-out"
          >
            Start New Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;