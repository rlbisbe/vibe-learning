import { useState, useEffect } from 'react';
import './FlashcardView.css';

function FlashcardView({ qaData, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  useEffect(() => {
    if (qaData && qaData.answers) {
      // Shuffle questions
      const shuffled = [...qaData.answers].sort(() => Math.random() - 0.5);
      setShuffledQuestions(shuffled);
      setCurrentIndex(0);
      setShowAnswer(false);
      setShowExplanation(false);
    }
  }, [qaData]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        toggleAnswer();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, showAnswer]);

  const goToNext = () => {
    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setShowExplanation(false);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
      setShowExplanation(false);
    }
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
    setShowExplanation(false);
  };

  const toggleExplanation = () => {
    setShowExplanation(!showExplanation);
  };

  const reshuffle = () => {
    const shuffled = [...qaData.answers].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
    setShowExplanation(false);
  };

  if (!shuffledQuestions.length) {
    return null;
  }

  const currentQuestion = shuffledQuestions[currentIndex];

  return (
    <div className="flashcard-overlay">
      <div className="flashcard-container">
        <div className="flashcard-header">
          <div className="flashcard-progress">
            {currentIndex + 1} of {shuffledQuestions.length}
          </div>
          <div className="flashcard-controls">
            <button onClick={reshuffle} className="shuffle-btn" title="Shuffle questions">
              🔀
            </button>
            <button onClick={onClose} className="close-btn" title="Close flashcards (Esc)">
              ✕
            </button>
          </div>
        </div>

        <div className="flashcard-content">
          <div className="flashcard">
            <div className="question-section">
              <h2>Question</h2>
              <p className="question-text">{currentQuestion.question}</p>
            </div>

            {showAnswer && (
              <div className="answer-section">
                <h3>Answer</h3>
                <p className="answer-text">{currentQuestion.answer}</p>
                
                <button 
                  onClick={toggleExplanation}
                  className="explanation-btn"
                >
                  {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                </button>

                {showExplanation && (
                  <div className="explanation-section">
                    <h4>Explanation</h4>
                    <p className="explanation-text">{currentQuestion.explanation}</p>
                  </div>
                )}
              </div>
            )}

            {!showAnswer && (
              <div className="reveal-section">
                <button onClick={toggleAnswer} className="reveal-btn">
                  Reveal Answer (Space)
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flashcard-navigation">
          <button 
            onClick={goToPrevious} 
            disabled={currentIndex === 0}
            className="nav-btn prev-btn"
            title="Previous question (←)"
          >
            ← Previous
          </button>
          
          <div className="progress-dots">
            {shuffledQuestions.map((_, index) => (
              <div 
                key={index}
                className={`progress-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => {
                  setCurrentIndex(index);
                  setShowAnswer(false);
                  setShowExplanation(false);
                }}
              />
            ))}
          </div>

          <button 
            onClick={goToNext} 
            disabled={currentIndex === shuffledQuestions.length - 1}
            className="nav-btn next-btn"
            title="Next question (→)"
          >
            Next →
          </button>
        </div>

        <div className="keyboard-hints">
          <span>← → Navigate</span>
          <span>Space: Reveal</span>
          <span>Esc: Close</span>
        </div>
      </div>
    </div>
  );
}

export default FlashcardView;