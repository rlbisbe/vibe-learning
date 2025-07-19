import './LearningPathDisplay.css';
import QADisplay from './QADisplay.jsx';

function LearningPathDisplay({ parsedResponse, qaData, isCompact, isGenerating, onRegenerateQuestions, onStartFlashcards }) {
  if (!parsedResponse) {
    return (
      <div className="learning-path-display">
        <div className="welcome-message">
          <h2>Welcome to Vibe Learning</h2>
          <p>Start a conversation in the chat to analyze your learning path!</p>
        </div>
      </div>
    );
  }

  if (!parsedResponse.success) {
    return (
      <div className="learning-path-display">
        <div className="error-display">
          <h3>Error parsing response</h3>
          <p>{parsedResponse.error}</p>
          <details>
            <summary>Raw response</summary>
            <pre>{parsedResponse.rawResponse}</pre>
          </details>
        </div>
      </div>
    );
  }

  const { data } = parsedResponse;

  return (
    <div className={`learning-path-display ${isCompact ? 'compact' : ''}`}>
      {!isCompact && <h2>Learning Path Analysis</h2>}
      
      {data.learningPath && (
        <div className="learning-path-info">
          <h3>{isCompact ? 'Learning Path' : 'Current Information'}</h3>
          <div className="path-details">
            {data.learningPath.topic && (
              <div className="path-item">
                <span className="label">Topic:</span>
                <span className="value">{data.learningPath.topic}</span>
              </div>
            )}
            {data.learningPath.subtopic && (
              <div className="path-item">
                <span className="label">Subtopic:</span>
                <span className="value">{data.learningPath.subtopic}</span>
              </div>
            )}
            {data.learningPath.level && (
              <div className="path-item">
                <span className="label">Level:</span>
                <span className="value">{data.learningPath.level}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {(qaData || isGenerating) && (
        <QADisplay 
          qaData={qaData} 
          isGenerating={isGenerating}
          onRegenerateQuestions={onRegenerateQuestions}
          onStartFlashcards={onStartFlashcards}
        />
      )}

      {parsedResponse.isComplete && !qaData && (
        <div className="completion-section">
          <h3>✅ Learning Path Complete!</h3>
          <p>Generating questions and answers...</p>
        </div>
      )}
    </div>
  );
}

export default LearningPathDisplay;