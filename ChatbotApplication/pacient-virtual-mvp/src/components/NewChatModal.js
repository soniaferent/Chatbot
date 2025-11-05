import React from 'react';
import { patientScenarios } from '../api/mockDatabase';

function NewChatModal({ onClose, onStartChat }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Choose a Scenario</h2>
        <p>Select the case you want to practice.</p>
        <div className="scenario-selection-list">
          {patientScenarios.map(scenario => (
            <button 
              key={scenario.id} 
              className="scenario-select-button"
              onClick={() => onStartChat(scenario.id)}
            >
              {scenario.title}
            </button>
          ))}
        </div>
        <button className="button-secondary" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default NewChatModal;