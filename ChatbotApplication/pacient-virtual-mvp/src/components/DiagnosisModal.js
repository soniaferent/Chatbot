import React, { useState } from 'react';

function DiagnosisModal({ diagnoses, onClose, onSubmit }) {
  const [selected, setSelected] = useState(null);

  const handleSubmit = () => {
    if (selected) {
      onSubmit(selected);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Enter Final Diagnosis</h2>
        <p>Based on the anamnesis, what do you believe is the correct diagnosis?</p>
        
        <div className="diagnosis-options-list">
          {(diagnoses || []).map((diag, index) => (
            <label key={index} className={`diagnosis-option ${selected === diag ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="diagnosis"
                value={diag}
                checked={selected === diag}
                onChange={() => setSelected(diag)}
              />
              {diag}
            </label>
          ))}
        </div>

        <div className="modal-actions">
          <button className="button-secondary" onClick={onClose}>Cancel</button>
          <button 
            className="cta-button" 
            onClick={handleSubmit}
            disabled={!selected}
          >
            Confirm Diagnosis
          </button>
        </div>
      </div>
    </div>
  );
}

export default DiagnosisModal;