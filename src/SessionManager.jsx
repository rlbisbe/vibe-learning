import { useState } from 'react';
import { getSessionList, deleteSession, createNewSession } from './sessionStorage';
import './SessionManager.css';

function SessionManager({ onLoadSession, onCreateNew, onClose, currentSessionId }) {
  const [sessions, setSessions] = useState(getSessionList());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const refreshSessions = () => {
    setSessions(getSessionList());
  };

  const handleDeleteSession = (sessionId) => {
    if (deleteSession(sessionId)) {
      refreshSessions();
      setShowDeleteConfirm(null);
    }
  };

  const handleCreateNew = () => {
    const newSessionId = createNewSession();
    onCreateNew(newSessionId);
    onClose();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="session-manager-overlay">
      <div className="session-manager">
        <div className="session-header">
          <h2>Learning Sessions</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div className="session-actions">
          <button onClick={handleCreateNew} className="new-session-btn">
            📝 Create New Session
          </button>
        </div>

        <div className="sessions-list">
          {sessions.length === 0 ? (
            <div className="empty-sessions">
              <p>No learning sessions found.</p>
              <p>Create a new session to get started!</p>
            </div>
          ) : (
            sessions.map(session => (
              <div 
                key={session.id} 
                className={`session-item ${session.id === currentSessionId ? 'current' : ''}`}
              >
                <div className="session-info">
                  <div className="session-title">
                    <h3>{session.topic}</h3>
                    {session.id === currentSessionId && <span className="current-badge">Current</span>}
                  </div>
                  <div className="session-details">
                    {session.subtopic && <span className="subtopic">{session.subtopic}</span>}
                    {session.level && <span className="level">Level: {session.level}</span>}
                  </div>
                  <div className="session-meta">
                    <span className="date">Updated: {formatDate(session.updatedAt)}</span>
                    {session.hasQuestions && <span className="has-questions">📚 Has Questions</span>}
                  </div>
                </div>
                
                <div className="session-actions">
                  <button 
                    onClick={() => {
                      onLoadSession(session.id);
                      onClose();
                    }}
                    className="load-btn"
                    disabled={session.id === currentSessionId}
                  >
                    {session.id === currentSessionId ? 'Current' : 'Load'}
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(session.id)}
                    className="delete-btn"
                    title="Delete session"
                  >
                    🗑️
                  </button>
                </div>

                {showDeleteConfirm === session.id && (
                  <div className="delete-confirm">
                    <p>Delete this session?</p>
                    <div className="confirm-actions">
                      <button 
                        onClick={() => handleDeleteSession(session.id)}
                        className="confirm-delete"
                      >
                        Yes, Delete
                      </button>
                      <button 
                        onClick={() => setShowDeleteConfirm(null)}
                        className="cancel-delete"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="session-footer">
          <p className="session-count">{sessions.length} session{sessions.length !== 1 ? 's' : ''} total</p>
        </div>
      </div>
    </div>
  );
}

export default SessionManager;