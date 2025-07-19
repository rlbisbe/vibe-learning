const STORAGE_KEY = 'vibeLearningSessions';
const CURRENT_SESSION_KEY = 'vibeCurrentSession';

export function saveLearningSession(sessionData) {
  try {
    const sessions = getAllSessions();
    const sessionId = sessionData.id || generateSessionId();
    const timestamp = new Date().toISOString();
    
    const session = {
      ...sessionData,
      id: sessionId,
      createdAt: sessionData.createdAt || timestamp,
      updatedAt: timestamp
    };
    
    sessions[sessionId] = session;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    localStorage.setItem(CURRENT_SESSION_KEY, sessionId);
    
    return sessionId;
  } catch (error) {
    console.error('Error saving learning session:', error);
    return null;
  }
}

export function getAllSessions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading sessions:', error);
    return {};
  }
}

export function getSession(sessionId) {
  try {
    const sessions = getAllSessions();
    return sessions[sessionId] || null;
  } catch (error) {
    console.error('Error loading session:', error);
    return null;
  }
}

export function getCurrentSession() {
  try {
    const currentSessionId = localStorage.getItem(CURRENT_SESSION_KEY);
    if (!currentSessionId) return null;
    
    return getSession(currentSessionId);
  } catch (error) {
    console.error('Error loading current session:', error);
    return null;
  }
}

export function setCurrentSession(sessionId) {
  try {
    localStorage.setItem(CURRENT_SESSION_KEY, sessionId);
  } catch (error) {
    console.error('Error setting current session:', error);
  }
}

export function deleteSession(sessionId) {
  try {
    const sessions = getAllSessions();
    delete sessions[sessionId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    
    // If this was the current session, clear it
    const currentSessionId = localStorage.getItem(CURRENT_SESSION_KEY);
    if (currentSessionId === sessionId) {
      localStorage.removeItem(CURRENT_SESSION_KEY);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting session:', error);
    return false;
  }
}

export function createNewSession() {
  try {
    // Clear current session
    localStorage.removeItem(CURRENT_SESSION_KEY);
    return generateSessionId();
  } catch (error) {
    console.error('Error creating new session:', error);
    return null;
  }
}

export function getSessionList() {
  try {
    const sessions = getAllSessions();
    return Object.values(sessions)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .map(session => ({
        id: session.id,
        topic: session.learningPath?.topic || 'Unknown Topic',
        subtopic: session.learningPath?.subtopic || '',
        level: session.learningPath?.level || '',
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        hasQuestions: !!(session.qaData && session.qaData.answers)
      }));
  } catch (error) {
    console.error('Error getting session list:', error);
    return [];
  }
}

function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

export function exportSession(sessionId) {
  try {
    const session = getSession(sessionId);
    if (!session) return null;
    
    const exportData = {
      ...session,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting session:', error);
    return null;
  }
}

export function importSession(jsonData) {
  try {
    const sessionData = JSON.parse(jsonData);
    
    // Generate new ID to avoid conflicts
    const newSessionId = generateSessionId();
    const importedSession = {
      ...sessionData,
      id: newSessionId,
      importedAt: new Date().toISOString()
    };
    
    return saveLearningSession(importedSession);
  } catch (error) {
    console.error('Error importing session:', error);
    return null;
  }
}