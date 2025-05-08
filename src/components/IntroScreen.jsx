// src/components/IntroScreen.jsx
import React from 'react';

const IntroScreen = ({ patientName, onPatientNameChange, onStart }) => (
  <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-coral-light">
    <h1 className="text-3xl font-bold text-center mb-6 text-coral">Lifestyle Microhabits Assessment</h1>
    <div className="text-center mb-8">
      <p className="text-lg mb-4 text-coral-dark">
        Welcome to your personalized lifestyle assessment. This questionnaire will help identify
        areas of opportunity for improving your health and wellbeing through targeted microhabits.
      </p>
      <p className="mb-6 text-coral">
        You'll be asked questions about your health history and labs. Then we'll generate a personalized report.
      </p>
    </div>
    <div className="mb-6">
      <label htmlFor="patientName" className="block text-coral-dark font-medium mb-2">Patient Name:</label>
      <input
        type="text"
        id="patientName"
        className="w-full px-4 py-2 rounded-xl border border-coral-light focus:outline-none focus:ring-2 focus:ring-coral"
        placeholder="Enter patient name"
        value={patientName}
        onChange={(e) => onPatientNameChange(e.target.value)}
      />
    </div>
    <div className="text-center">
      <button
        onClick={onStart}
        disabled={!patientName.trim()}
        className={`bg-gradient-to-r from-coral to-coral-dark text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:scale-105 transition-all ${!patientName.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Begin Assessment
      </button>
    </div>
  </div>
);

export default IntroScreen;
