import { useState } from 'react';
import './QADisplay.css';

function QADisplay({ qaData, onRegenerateQuestions, isGenerating, onStartFlashcards }) {
  const [expandedAnswer, setExpandedAnswer] = useState(null);
  const [expandedExplanation, setExpandedExplanation] = useState(null);

  const toggleAnswer = (index) => {
    setExpandedAnswer(expandedAnswer === index ? null : index);
    setExpandedExplanation(null);
  };

  const toggleExplanation = (index) => {
    setExpandedExplanation(expandedExplanation === index ? null : index);
  };

  if (!qaData || !qaData.answers) {
    return null;
  }

  if (isGenerating) {
    return (
      <div className="qa-display">
        <div className="generating-indicator">
          <div className="loading-spinner"></div>
          <h2>Generating Practice Questions...</h2>
          <p>This may take a few seconds. Please wait while we create personalized questions for your learning path.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="qa-display">
      <div className="qa-header">
        <div>
          <h2>Practice Questions</h2>
          <p className="qa-instructions">Click on a question to reveal the answer, then click "Show Explanation" for more details.</p>
        </div>
        <div className="qa-actions">
          <button onClick={onStartFlashcards} className="flashcard-btn">
            🎴 Flashcard Mode
          </button>
          <button onClick={onRegenerateQuestions} className="regenerate-btn">
            🔄 Regenerate Questions
          </button>
        </div>
      </div>
      
      <div className="questions-container">
        {qaData.answers.map((item, index) => (
          <div key={index} className="qa-item">
            <div 
              className="question-header"
              onClick={() => toggleAnswer(index)}
            >
              <span className="question-number">{index + 1}</span>
              <span className="question-text">{item.question}</span>
              <span className="toggle-icon">
                {expandedAnswer === index ? '▼' : '▶'}
              </span>
            </div>
            
            {expandedAnswer === index && (
              <div className="answer-section">
                <div className="answer">
                  <strong>Answer:</strong> {item.answer}
                </div>
                
                <button 
                  className="explanation-toggle"
                  onClick={() => toggleExplanation(index)}
                >
                  {expandedExplanation === index ? 'Hide Explanation' : 'Show Explanation'}
                </button>
                
                {expandedExplanation === index && (
                  <div className="explanation">
                    <strong>Explanation:</strong> {item.explanation}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default QADisplay;