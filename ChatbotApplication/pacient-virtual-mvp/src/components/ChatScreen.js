import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getScenarioById, getMockedResponse } from '../api/mockDatabase';
import { useLocalStorage } from '../hooks/useLocalStorage';
import DiagnosisModal from './DiagnosisModal';

function ChatScreen() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [sessions, setSessions] = useLocalStorage('chatSessions', []);
  const [input, setInput] = useState('');
  const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);

  // Find the current session and scenario data
  const currentSession = sessions.find(s => s.id === sessionId);
  const scenarioData = currentSession ? getScenarioById(currentSession.scenarioId) : null;

  // Ref for auto-scroll
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  // If session doesn't exist, go back to dashboard
  useEffect(() => {
    if (!currentSession) {
      navigate('/');
    }
  }, [currentSession, navigate]);
  
  // --- CRUD: UPDATE (add message) ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || !currentSession || currentSession.status === 'completed') return;

    const userMessage = { sender: 'user', text: input };
    const responseText = getMockedResponse(currentSession.scenarioId, input);
    const botMessage = { sender: 'patient', text: responseText };

    // Create the updated sessions state
    const updatedSessions = sessions.map(session => {
      if (session.id === sessionId) {
        // Only update the current session
        return {
          ...session,
          messages: [...session.messages, userMessage, botMessage]
        };
      }
      return session;
    });

    setSessions(updatedSessions);
    setInput('');
  };

  // --- CRUD: UPDATE (finalize diagnosis) ---
  const handleFinalizeDiagnosis = (selectedDiagnosis) => {
    if (!scenarioData) return;

    const userMessageCount = currentSession.messages.filter(m => m.sender === 'user').length;
    const isCorrect = selectedDiagnosis === scenarioData.correctDiagnosis;

    // Update the session with the results
    const updatedSessions = sessions.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          status: 'completed',
          questionCount: userMessageCount,
          finalDiagnosis: selectedDiagnosis,
          isCorrect: isCorrect,
          endTime: new Date().toISOString()
        };
      }
      return session;
    });

    setSessions(updatedSessions);
    setIsDiagnosisModalOpen(false);
    
    // Send the user back to the Dashboard
    navigate('/');
  };

  if (!currentSession || !scenarioData) {
    return <div>Loading...</div>;
  }
  
  const isCompleted = currentSession.status === 'completed';

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div>
          <h3>Case: {scenarioData.title}</h3>
          <Link to="/" className="back-link">← Back to Dashboard</Link>
        </div>
        {!isCompleted && (
          <button 
            className="cta-button" 
            onClick={() => setIsDiagnosisModalOpen(true)}
          >
            Finalize Diagnosis
          </button>
        )}
      </div>
      
      {/* CRUD: Read - Displaying messages */}
      <div className="chat-messages">
        {currentSession.messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === 'user' ? 'user-message' : 'patient-message'}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        
        {isCompleted && (
           <div className={`diagnostic-result ${currentSession.isCorrect ? 'correct' : 'incorrect'}`}>
              <h4>Case Completed</h4>
              <p>Your diagnosis: <strong>{currentSession.finalDiagnosis}</strong></p>
              <p>Result: <strong>{currentSession.isCorrect ? 'Correct' : 'Incorrect'}</strong></p>
              <p>(The correct diagnosis was: {scenarioData.correctDiagnosis})</p>
           </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* UPDATE Form (add message) */}
      {!isCompleted && (
        <form onSubmit={handleSubmit} className="chat-input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here..."
            disabled={isCompleted}
          />
          <button type="submit" disabled={isCompleted}>Send</button>
        </form>
      )}

      {/* Modal for finalizing diagnosis */}
      {isDiagnosisModalOpen && (
        <DiagnosisModal 
          diagnoses={scenarioData.diagnoses}
          onClose={() => setIsDiagnosisModalOpen(false)}
          onSubmit={handleFinalizeDiagnosis}
        />
      )}
    </div>
  );
}

export default ChatScreen;