import { useState } from 'react';
import Chat from './Chat.jsx';
import LearningPathDisplay from './LearningPathDisplay.jsx';
import FlashcardView from './FlashcardView.jsx';
import SessionManager from './SessionManager.jsx';
import { useChatStateMachine } from './useChatStateMachine.js';

function App() {
  const { 
    state, 
    messages, 
    handleUserMessage, 
    parsedResponse, 
    qaData, 
    isGeneratingQA,
    currentSessionId,
    regenerateQuestions,
    createNewSession,
    loadSession,
    STATES 
  } = useChatStateMachine();

  const [showFlashcards, setShowFlashcards] = useState(false);
  const [showSessionManager, setShowSessionManager] = useState(false);

  const handleStartFlashcards = () => {
    if (qaData && qaData.answers) {
      setShowFlashcards(true);
    }
  };

  const handleSessionAction = () => {
    setShowSessionManager(true);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '70%', overflow: 'auto' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ margin: 0, color: '#2563eb' }}>Vibe Learning</h1>
            <button 
              onClick={handleSessionAction}
              style={{
                background: '#6b7280',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              📁 Sessions
            </button>
          </div>
        </div>
        <LearningPathDisplay 
          parsedResponse={parsedResponse} 
          qaData={qaData}
          isCompact={!!qaData}
          isGenerating={isGeneratingQA}
          onRegenerateQuestions={regenerateQuestions}
          onStartFlashcards={handleStartFlashcards}
        />
      </div>
      <Chat 
        state={state} 
        messages={messages} 
        onSendMessage={handleUserMessage}
        STATES={STATES}
      />
      
      {showFlashcards && (
        <FlashcardView 
          qaData={qaData}
          onClose={() => setShowFlashcards(false)}
        />
      )}
      
      {showSessionManager && (
        <SessionManager
          onLoadSession={loadSession}
          onCreateNew={createNewSession}
          onClose={() => setShowSessionManager(false)}
          currentSessionId={currentSessionId}
        />
      )}
    </div>
  );
}

export default App;