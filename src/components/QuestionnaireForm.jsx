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

