import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { loadPromptTemplate, buildFullPrompt, loadQATemplate, buildQAPrompt } from './promptTemplate';
import { parseGeminiResponse, buildFollowUpPrompt, parseQAResponse } from './responseParser';
import { saveLearningSession, getCurrentSession, getSession, setCurrentSession } from './sessionStorage';

const STATES = {
  INITIAL: 'initial',
  PROCESSING: 'processing',
  READY: 'ready',
  WAITING_FOR_ANSWERS: 'waiting_for_answers',
  GENERATING_QA: 'generating_qa'
};

export function useChatStateMachine() {
  const [state, setState] = useState(STATES.INITIAL);
  const [messages, setMessages] = useState([]);
  const [promptTemplate, setPromptTemplate] = useState(null);
  const [qaTemplate, setQATemplate] = useState(null);
  const [parsedResponse, setParsedResponse] = useState(null);
  const [qaData, setQAData] = useState(null);
  const [isGeneratingQA, setIsGeneratingQA] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [collectedAnswers, setCollectedAnswers] = useState([]);

  useEffect(() => {
    loadPromptTemplate().then(template => {
      setPromptTemplate(template);
    });
    loadQATemplate().then(template => {
      setQATemplate(template);
    });
    
    // Load current session on startup
    const currentSession = getCurrentSession();
    if (currentSession) {
      loadSessionData(currentSession);
    }
  }, []);

  const loadSessionData = (sessionData) => {
    setCurrentSessionId(sessionData.id);
    if (sessionData.parsedResponse) setParsedResponse(sessionData.parsedResponse);
    if (sessionData.qaData) setQAData(sessionData.qaData);
    if (sessionData.messages) setMessages(sessionData.messages);
    if (sessionData.state) setState(sessionData.state);
    if (sessionData.originalPrompt) setOriginalPrompt(sessionData.originalPrompt);
  };

  const saveCurrentSession = () => {
    if (!currentSessionId) return;
    
    const sessionData = {
      id: currentSessionId,
      parsedResponse,
      qaData,
      messages,
      state,
      originalPrompt,
      learningPath: parsedResponse?.data?.learningPath
    };
    
    saveLearningSession(sessionData);
  };

  // Auto-save session when important data changes
  useEffect(() => {
    if (currentSessionId && (parsedResponse || qaData)) {
      saveCurrentSession();
    }
  }, [parsedResponse, qaData, messages]);

  const sendToGemini = async (userPrompt, useAccurateModel = false) => {
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const modelName = useAccurateModel ? "gemini-2.5-pro" : "gemini-2.5-flash";
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const fullPrompt = buildFullPrompt(promptTemplate, userPrompt);
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return 'Sorry, I encountered an error processing your request.';
    }
  };

  const generateQA = async (learningPath) => {
    try {
      setIsGeneratingQA(true);
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
      
      const qaPrompt = buildQAPrompt(qaTemplate, learningPath);
      const result = await model.generateContent(qaPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating Q&A:', error);
      return 'Sorry, I encountered an error generating questions.';
    } finally {
      setIsGeneratingQA(false);
    }
  };

  const regenerateQuestions = async () => {
    if (!parsedResponse?.data?.learningPath) return;
    
    try {
      const qaResponse = await generateQA(parsedResponse.data.learningPath);
      const qaResult = parseQAResponse(qaResponse);
      
      if (qaResult.success) {
        setQAData(qaResult.data);
        
        const successMessage = {
          id: Date.now(),
          text: 'Questions regenerated successfully!',
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, successMessage]);
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now(),
        text: 'Failed to regenerate questions. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const createNewSession = (sessionId) => {
    setCurrentSessionId(sessionId);
    setState(STATES.INITIAL);
    setMessages([]);
    setParsedResponse(null);
    setQAData(null);
    setOriginalPrompt('');
    setPendingQuestions([]);
    setCollectedAnswers([]);
  };

  const loadSession = (sessionId) => {
    const session = getSession(sessionId);
    if (session) {
      loadSessionData(session);
      setCurrentSession(sessionId);
    }
  };

  const handleUserMessage = async (messageText) => {
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    if (state === STATES.INITIAL) {
      // Create new session if none exists
      if (!currentSessionId) {
        const newSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        setCurrentSessionId(newSessionId);
      }
      
      setOriginalPrompt(messageText);
      setState(STATES.PROCESSING);
      
      const processingMessage = {
        id: Date.now() + 1,
        text: 'Analyzing your learning path...',
        sender: 'bot',
        timestamp: new Date(),
        isProcessing: true
      };
      
      setMessages(prev => [...prev, processingMessage]);

      try {
        const geminiResponse = await sendToGemini(messageText);
        const parsed = parseGeminiResponse(geminiResponse);
        
        setParsedResponse(parsed);
        
        setMessages(prev => 
          prev.filter(msg => !msg.isProcessing).concat([{
            id: Date.now() + 2,
            text: parsed.success ? 'Learning path analyzed! Check the main window for details.' : `Error: ${parsed.error}`,
            sender: 'bot',
            timestamp: new Date()
          }])
        );

        if (parsed.success && parsed.hasQuestions) {
          setPendingQuestions(parsed.data.questions);
          setCollectedAnswers([]);
          setState(STATES.WAITING_FOR_ANSWERS);
          
          // Display questions in chat
          parsed.data.questions.forEach((question, index) => {
            const questionMessage = {
              id: Date.now() + 3 + index,
              text: `Question ${index + 1}: ${question}`,
              sender: 'bot',
              timestamp: new Date()
            };
            setMessages(prev => [...prev, questionMessage]);
          });
          
          const instructionMessage = {
            id: Date.now() + 100,
            text: `Please answer these questions one by one. I'll process your responses as you send them.`,
            sender: 'bot',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, instructionMessage]);
        } else if (parsed.success && parsed.isComplete) {
          // Generate Q&A when learning path is complete
          setState(STATES.GENERATING_QA);
          
          const qaMessage = {
            id: Date.now() + 3,
            text: 'Generating practice questions for your learning path...',
            sender: 'bot',
            timestamp: new Date(),
            isProcessing: true
          };
          
          setMessages(prev => [...prev, qaMessage]);
          
          try {
            const qaResponse = await generateQA(parsed.data.learningPath);
            const qaResult = parseQAResponse(qaResponse);
            
            if (qaResult.success) {
              setQAData(qaResult.data);
              setMessages(prev => 
                prev.filter(msg => !msg.isProcessing).concat([{
                  id: Date.now() + 4,
                  text: 'Practice questions generated! Check the main window to start practicing.',
                  sender: 'bot',
                  timestamp: new Date()
                }])
              );
            } else {
              setMessages(prev => 
                prev.filter(msg => !msg.isProcessing).concat([{
                  id: Date.now() + 4,
                  text: 'Error generating questions. Please try again.',
                  sender: 'bot',
                  timestamp: new Date()
                }])
              );
            }
          } catch (error) {
            setMessages(prev => 
              prev.filter(msg => !msg.isProcessing).concat([{
                id: Date.now() + 4,
                text: 'Error generating questions. Please try again.',
                sender: 'bot',
                timestamp: new Date()
              }])
            );
          }
          
          setState(STATES.READY);
        } else {
          setState(STATES.READY);
        }
        
      } catch (error) {
        setMessages(prev => 
          prev.filter(msg => !msg.isProcessing).concat([{
            id: Date.now() + 2,
            text: 'Error processing your request. Please try again.',
            sender: 'bot',
            timestamp: new Date()
          }])
        );
        
        setState(STATES.INITIAL);
      }
    } else if (state === STATES.WAITING_FOR_ANSWERS) {
      const newAnswers = [...collectedAnswers, messageText];
      setCollectedAnswers(newAnswers);
      
      if (newAnswers.length < pendingQuestions.length) {
        const remainingQuestions = pendingQuestions.length - newAnswers.length;
        const botMessage = {
          id: Date.now() + 1,
          text: `Got it! ${remainingQuestions} more question${remainingQuestions > 1 ? 's' : ''} to go.`,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        setState(STATES.PROCESSING);
        const processingMessage = {
          id: Date.now() + 1,
          text: 'Processing your complete information...',
          sender: 'bot',
          timestamp: new Date(),
          isProcessing: true
        };
        setMessages(prev => [...prev, processingMessage]);
        
        try {
          const followUpPrompt = buildFollowUpPrompt(originalPrompt, pendingQuestions, newAnswers);
          const geminiResponse = await sendToGemini(followUpPrompt);
          const parsed = parseGeminiResponse(geminiResponse);
          
          setParsedResponse(parsed);
          
          if (parsed.success && parsed.isComplete) {
            // Generate Q&A after completing the learning path
            setState(STATES.GENERATING_QA);
            
            const qaMessage = {
              id: Date.now() + 2,
              text: 'Learning path complete! Generating practice questions...',
              sender: 'bot',
              timestamp: new Date(),
              isProcessing: true
            };
            
            setMessages(prev => 
              prev.filter(msg => !msg.isProcessing).concat([qaMessage])
            );
            
            try {
              const qaResponse = await generateQA(parsed.data.learningPath);
              const qaResult = parseQAResponse(qaResponse);
              
              if (qaResult.success) {
                setQAData(qaResult.data);
                setMessages(prev => 
                  prev.filter(msg => !msg.isProcessing).concat([{
                    id: Date.now() + 3,
                    text: 'Practice questions generated! Check the main window to start practicing.',
                    sender: 'bot',
                    timestamp: new Date()
                  }])
                );
              } else {
                setMessages(prev => 
                  prev.filter(msg => !msg.isProcessing).concat([{
                    id: Date.now() + 3,
                    text: 'Learning path complete, but failed to generate practice questions.',
                    sender: 'bot',
                    timestamp: new Date()
                  }])
                );
              }
            } catch (error) {
              setMessages(prev => 
                prev.filter(msg => !msg.isProcessing).concat([{
                  id: Date.now() + 3,
                  text: 'Learning path complete, but failed to generate practice questions.',
                  sender: 'bot',
                  timestamp: new Date()
                }])
              );
            }
          } else {
            setMessages(prev => 
              prev.filter(msg => !msg.isProcessing).concat([{
                id: Date.now() + 2,
                text: 'Complete! Your learning path has been updated.',
                sender: 'bot',
                timestamp: new Date()
              }])
            );
          }
          
          setState(STATES.READY);
        } catch (error) {
          setMessages(prev => 
            prev.filter(msg => !msg.isProcessing).concat([{
              id: Date.now() + 2,
              text: 'Error processing your answers. Please try again.',
              sender: 'bot',
              timestamp: new Date()
            }])
          );
          setState(STATES.WAITING_FOR_ANSWERS);
        }
      }
    } else if (state === STATES.READY) {
      const botResponse = await sendToGemini(messageText);
      
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    }
  };

  return {
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
  };
}