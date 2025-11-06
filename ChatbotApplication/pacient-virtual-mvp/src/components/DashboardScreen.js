import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getScenarioById } from '../api/mockDatabase';
import NewChatModal from './NewChatModal';

function DashboardScreen() {
  const [sessions, setSessions] = useLocalStorage('chatSessions', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // --- CRUD Operations ---

  // CREATE: Called from the modal
  const handleCreateChat = (scenarioId) => {
    const scenario = getScenarioById(scenarioId);
    if (!scenario) return;

    // Create a unique ID for the new chat
    const newSessionId = `session_${Date.now()}`;
    
    // Create the new chat session
    const newSession = {
      id: newSessionId,
      scenarioId: scenario.id,
      status: 'active',
      // Add the first message (from the patient)
      messages: [
        { sender: 'patient', text: scenario.initialMessage }
      ],
      startTime: new Date().toISOString()
    };

    // Add the new session to the existing list
    setSessions(prevSessions => [...prevSessions, newSession]);
    setIsModalOpen(false);
    
    // Navigate to the chat screen
    navigate(`/chat/${newSessionId}`);
  };

  // DELETE: Deletes a chat
  const handleDeleteChat = (sessionId) => {
    // Use a simple confirm (in production, you'd use a nicer modal)
    if (window.confirm("Are you sure you want to delete this chat session?")) {
      setSessions(prevSessions => prevSessions.filter(s => s.id !== sessionId));
    }
  };

  // --- READ (for stats and lists) ---
  const activeSessions = sessions.filter(s => s.status === 'active');
  const completedSessions = sessions.filter(s => s.status === 'completed');

  // Calculate stats
  const totalCompleted = completedSessions.length;
  const correctDiagnoses = completedSessions.filter(s => s.isCorrect).length;
  const accuracy = totalCompleted > 0 ? ((correctDiagnoses / totalCompleted) * 100).toFixed(0) : 0;
  
  const totalQuestions = completedSessions.reduce((acc, s) => acc + (s.questionCount || 0), 0);
  const avgQuestions = totalCompleted > 0 ? (totalQuestions / totalCompleted).toFixed(1) : 0;

  return (
    <div className="dashboard">
      
      {/* Statistics Section */}
      <section className="dashboard-stats">
        <h2>Statistics</h2>
        <div className="stats-container">
          <div className="stat-card">
            <h3>Cases Completed</h3>
            <span>{totalCompleted}</span>
          </div>
          <div className="stat-card">
            <h3>Diagnosis Accuracy</h3>
            <span>{accuracy}%</span>
          </div>
          <div className="stat-card">
            <h3>Avg. Questions</h3>
            <span>{avgQuestions}</span>
          </div>
        </div>
      </section>

      {/* CREATE Button */}
      <div className="dashboard-actions">
        <button className="cta-button" onClick={() => setIsModalOpen(true)}>
          + Start a New Case 
        </button>
      </div>

      {/* Active Chats Section (with DELETE) */}
      <section className="session-list">
        <h3>Active Chats</h3>
        {activeSessions.length === 0 ? (
          <p>No active chats. Start a new case!</p>
        ) : (
          activeSessions.map(session => {
            const scenario = getScenarioById(session.scenarioId);
            return (
              <div key={session.id} className="session-card active">
                <div className="session-info">
                  <strong>{scenario.title}</strong>
                  <small>Started: {new Date(session.startTime).toLocaleString()}</small>
                </div>
                <div className="session-actions">
                  <button onClick={() => navigate(`/chat/${session.id}`)} className="button-continue">
                    Continue
                  </button>
                  <button onClick={() => handleDeleteChat(session.id)} className="button-delete">
                    Delete (DELETE)
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Completed Chats Section */}
      <section className="session-list">
        <h3>Completed Chats </h3>
        {completedSessions.length === 0 ? (
          <p>No completed chats yet.</p>
        ) : (
          completedSessions.map(session => {
            const scenario = getScenarioById(session.scenarioId);
            const resultClass = session.isCorrect ? 'correct' : 'incorrect';
            return (
              <div key={session.id} className={`session-card completed ${resultClass}`}>
                <strong>{scenario.title}</strong>
                <span>Diagnosis: {session.finalDiagnosis} ({session.isCorrect ? 'Correct' : 'Incorrect'})</span>
                <span>{session.questionCount} questions</span>
              </div>
            );
          })
        )}
      </section>

      {/* Modal for creating a new chat */}
      {isModalOpen && (
        <NewChatModal 
          onClose={() => setIsModalOpen(false)}
          onStartChat={handleCreateChat}
        />
      )}
    </div>
  );
}

export default DashboardScreen;