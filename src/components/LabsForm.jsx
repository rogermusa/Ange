// src/components/LabsForm.jsx
import React from 'react';

const LabsForm = ({ mappingData, patientData, onLabChange, onGenerate, onBack }) => {
  const labInputs = Array.from(new Set(
    mappingData
      .filter(item => item.labInput)
      .map(item => item.labInput)
  ));

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-coral-light">
      <h2 className="text-2xl font-bold mb-6 text-coral">Lab Values</h2>
      <p className="mb-6 text-coral">
        Please check any lab values that apply based on the patient's most recent test results:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {labInputs.map(input => (
          <div key={input} className="flex items-start transition duration-200 ease-in-out hover:bg-cream-light p-3 rounded-lg">
            <input
              type="checkbox"
              id={`lab-${input}`}
              className="mt-1 h-4 w-4 text-coral focus:ring-coral rounded"
              checked={!!patientData.labs[input]}
              onChange={(e) => onLabChange(input, e.target.checked)}
            />
            <label htmlFor={`lab-${input}`} className="ml-3 text-coral-dark">
              {input}
            </label>
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
          onClick={onGenerate}
          className="bg-gradient-to-r from-coral to-coral-dark hover:from-coral-dark hover:to-coral-darker text-white font-bold py-2 px-6 rounded-xl shadow-md transition duration-300 ease-in-out"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default LabsForm;
