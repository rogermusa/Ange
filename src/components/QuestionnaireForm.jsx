// src/components/QuestionnaireForm.jsx
import React, { useState } from 'react';

const QuestionnaireForm = ({ 
  mappingData, 
  patientData, 
  categories,
  subcategories,
  onHistoryChange, 
  onNext,
  onBack 
}) => {
  const [expandedCategory, setExpandedCategory] = useState(categories.length > 0 ? categories[0] : null); // Default to first category or null

  // Prepare inputs for the questionnaire, only using items with historyInput
  const historyInputs = mappingData
    .filter(item => item.historyInput)
    .map(item => {
      let displayText = item.historyInput;
      if (typeof displayText === 'string' && displayText.length > 0) {
        displayText = displayText.charAt(0).toUpperCase() + displayText.slice(1);
      } else if (typeof displayText !== 'string') {
        displayText = String(displayText); // Ensure it's a string
      }
      return { 
        text: item.historyInput, // The original value for state key
        displayText: displayText, // For display
        category: item.category || 'Lifestyle', // Default if not provided
        subcategory: item.subcategory || 'General' // Default if not provided
      };
    });

  // Group these history inputs by their effective category and subcategory
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
    // Avoid duplicates if the exact same input text under same cat/subcat (though mappingData should ideally be unique)
    if (!groupedInputs[category][subcategory].some(i => i.value === input.text)) {
        groupedInputs[category][subcategory].push({
            value: input.text,
            display: input.displayText
        });
    }
  });
  
  // Ensure categories prop is an array
  const displayCategories = Array.isArray(categories) ? categories : [];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-coral-light">
      <h2 className="text-2xl font-bold mb-6 text-coral">Health History Questionnaire</h2>
      <p className="mb-6 text-coral">
        Please check all that apply to your current health situation and lifestyle:
      </p>

      <div className="mb-6">
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
             Array.isArray(subcategories[category]) && 
             subcategories[category].map(subcategory => {
              const inputsToRender = (groupedInputs[category] && groupedInputs[category][subcategory]) || [];
              if (inputsToRender.length === 0) return null;

              return (
                <div key={subcategory} className="mt-4 mb-6 pl-4">
                  <h3 className="text-lg font-medium mb-3 text-coral-dark border-b border-coral-light pb-1">{subcategory}</h3>
                  <div className="space-y-3 pl-4">
                    {inputsToRender.map(inputObj => {
                      const inputValue = inputObj.value; 
                      const displayText = inputObj.display;
                      return (
                        <div key={inputValue} className="flex items-start transition duration-200 ease-in-out hover:bg-cream-light p-2 rounded-lg">
                          <input
                            type="checkbox"
                            id={`history-${inputValue}`} // Ensure inputValue is a safe string for ID
                            className="mt-1 h-4 w-4 text-coral focus:ring-coral rounded"
                            checked={!!patientData.history[inputValue]}
                            onChange={(e) => onHistoryChange(inputValue, e.target.checked)}
                          />
                          <label htmlFor={`history-${inputValue}`} className="ml-3 text-coral-dark">
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
