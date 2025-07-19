# Vibe Learning - Technical Documentation

## Overview

Vibe Learning is an AI-powered educational platform that creates personalized learning paths and practice questions using Google Gemini AI. The system analyzes user prompts to determine learning objectives and generates customized Q&A content for interactive study sessions.

## Architecture Overview

```mermaid
graph TB
    User[User] --> Chat[Chat Interface]
    User --> Main[Main Window]
    User --> Flash[Flashcard View]
    User --> Session[Session Manager]
    
    Chat --> StateMachine[Chat State Machine]
    Main --> StateMachine
    Flash --> StateMachine
    Session --> Storage[Local Storage]
    
    StateMachine --> Gemini[Google Gemini AI]
    StateMachine --> Storage
    StateMachine --> Templates[Prompt Templates]
    
    Templates --> AnalyzePrompt[analyze_prompt.md]
    Templates --> QAPrompt[create_questions_and_answers.md]
    
    Gemini --> Parser[Response Parser]
    Parser --> LearningPath[Learning Path Data]
    Parser --> QAData[Q&A Data]
```

## Core Components

### 1. State Machine (`useChatStateMachine.js`)

The central orchestrator that manages the entire learning flow:

```mermaid
stateDiagram-v2
    [*] --> INITIAL
    INITIAL --> PROCESSING : User sends first message
    PROCESSING --> WAITING_FOR_ANSWERS : Incomplete learning path
    PROCESSING --> GENERATING_QA : Complete learning path
    PROCESSING --> INITIAL : Error occurred
    
    WAITING_FOR_ANSWERS --> PROCESSING : All answers collected
    WAITING_FOR_ANSWERS --> WAITING_FOR_ANSWERS : Partial answers
    
    GENERATING_QA --> READY : Q&A generated successfully
    GENERATING_QA --> READY : Q&A generation failed
    
    READY --> PROCESSING : Regenerate questions
    READY --> READY : General chat
```

#### State Descriptions:
- **INITIAL**: Waiting for user's first learning request
- **PROCESSING**: Analyzing prompts or generating content with Gemini
- **WAITING_FOR_ANSWERS**: Collecting additional information from user
- **GENERATING_QA**: Creating practice questions and answers
- **READY**: Learning path complete, ready for interaction

### 2. Learning Path Analysis Flow

```mermaid
sequenceDiagram
    participant User
    participant Chat
    participant StateMachine
    participant Gemini
    participant Parser
    participant Storage
    
    User->>Chat: "I want to learn React hooks"
    Chat->>StateMachine: handleUserMessage()
    StateMachine->>StateMachine: Create session if needed
    StateMachine->>Gemini: Send with analyze_prompt.md template
    Gemini-->>StateMachine: JSON response
    StateMachine->>Parser: parseGeminiResponse()
    
    alt Incomplete Learning Path
        Parser-->>StateMachine: {hasQuestions: true}
        StateMachine->>Chat: Display questions
        User->>Chat: Answer questions
        StateMachine->>Gemini: Send follow-up with answers
    else Complete Learning Path
        Parser-->>StateMachine: {isComplete: true}
        StateMachine->>Gemini: Generate Q&A with create_questions_and_answers.md
    end
    
    StateMachine->>Storage: Save session data
```

### 3. Q&A Generation Process

```mermaid
flowchart TD
    A[Complete Learning Path] --> B[Load QA Template]
    B --> C[Build QA Prompt with Learning Path]
    C --> D[Send to Gemini Pro Model]
    D --> E[Parse JSON Response]
    E --> F{Valid Q&A Structure?}
    F -->|Yes| G[Display 15 Questions]
    F -->|No| H[Show Error Message]
    G --> I[Save to Session Storage]
    G --> J[Enable Flashcard Mode]
    G --> K[Enable Regeneration]
```

## Data Flow Architecture

### Session Management

```mermaid
erDiagram
    Session {
        string id
        string createdAt
        string updatedAt
        object learningPath
        object qaData
        array messages
        string state
        string originalPrompt
    }
    
    LearningPath {
        string topic
        string subtopic
        string level
    }
    
    QAData {
        array answers
    }
    
    Answer {
        string question
        string answer
        string explanation
    }
    
    Session ||--|| LearningPath : contains
    Session ||--o| QAData : may-have
    QAData ||--o{ Answer : contains
```

### Local Storage Structure

```javascript
// Storage Keys
"vibeLearningSessions" // All sessions data
"vibeCurrentSession"   // Current active session ID

// Session Data Format
{
  "session_123": {
    "id": "session_123",
    "createdAt": "2025-01-19T...",
    "updatedAt": "2025-01-19T...",
    "learningPath": {
      "topic": "React",
      "subtopic": "Hooks",
      "level": "Intermediate"
    },
    "qaData": {
      "answers": [
        {
          "question": "What is useState?",
          "answer": "A React Hook for state management",
          "explanation": "useState allows functional components..."
        }
      ]
    },
    "messages": [...],
    "state": "ready"
  }
}
```

## Component Architecture

### Main Application Structure

```mermaid
graph TB
    App[App.jsx] --> Header[Header Section]
    App --> MainWindow[Main Window 70%]
    App --> ChatWindow[Chat Window 30%]
    App --> Modals[Modal Components]
    
    Header --> SessionBtn[Sessions Button]
    
    MainWindow --> LearningDisplay[LearningPathDisplay]
    LearningDisplay --> QADisplay[QADisplay]
    QADisplay --> QuestionList[Question List]
    QADisplay --> Actions[Action Buttons]
    
    ChatWindow --> ChatInterface[Chat.jsx]
    ChatInterface --> Messages[Message List]
    ChatInterface --> Input[Input Form]
    
    Modals --> FlashcardView[FlashcardView]
    Modals --> SessionManager[SessionManager]
    
    Actions --> FlashcardBtn[Flashcard Mode]
    Actions --> RegenBtn[Regenerate Questions]
```

### Flashcard System

```mermaid
flowchart LR
    A[QAData] --> B[Shuffle Questions]
    B --> C[Full Screen View]
    C --> D[Current Question]
    D --> E{Show Answer?}
    E -->|No| F[Reveal Button]
    E -->|Yes| G[Answer + Explanation Toggle]
    F --> H[Space/Click to Reveal]
    H --> G
    G --> I[Navigation Controls]
    I --> J[Previous/Next/Dots]
    J --> K[Update Index]
    K --> D
    
    L[Keyboard Shortcuts] --> M[← → Navigate]
    L --> N[Space: Reveal]
    L --> O[Esc: Close]
```

## API Integration

### Gemini AI Models Used

1. **Learning Path Analysis**: `gemini-2.5-flash` (Fast, efficient)
2. **Q&A Generation**: `gemini-2.5-pro` (More accurate, detailed)

### Prompt Templates

The system uses two AI prompt templates located in the `public/` directory:

- **`public/analyze_prompt.md`**: Template for learning path analysis and follow-up question generation
- **`public/create_questions_and_answers.md`**: Template for generating 15 practice questions with answers and explanations

These templates use placeholder replacement (`[PROMPT]` and `[PLAN]`) to inject user data before sending to the Gemini AI models.

## User Experience Flow

### Complete Learning Journey

```mermaid
journey
    title User Learning Journey
    section Discovery
      Open App: 5: User
      See Welcome: 4: User
      Start Chat: 5: User
    section Analysis
      Send Learning Request: 5: User
      AI Analyzes Topic: 3: AI
      Answer Follow-up Questions: 4: User
      Path Completed: 5: AI
    section Practice
      View Generated Questions: 5: User
      Try Flashcard Mode: 5: User
      Navigate Questions: 4: User
      Learn with Explanations: 5: User
    section Management
      Save Session: 4: System
      Load Previous Session: 5: User
      Create New Session: 4: User
```

### Error Handling

```mermaid
flowchart TD
    A[User Action] --> B{Valid Input?}
    B -->|No| C[Show Validation Error]
    B -->|Yes| D[Process Request]
    D --> E{Gemini API Call}
    E -->|Success| F[Parse Response]
    E -->|Error| G[Show API Error Message]
    F --> H{Valid JSON?}
    H -->|Yes| I[Update UI]
    H -->|No| J[Show Parse Error]
    
    C --> K[Allow Retry]
    G --> K
    J --> K
    K --> A
```

## Performance Considerations

### Optimization Strategies

1. **Local Storage Persistence**
   - Automatic session saving on state changes
   - Lazy loading of session data
   - Efficient JSON serialization

2. **AI Model Selection**
   - Fast model for initial analysis
   - Accurate model for Q&A generation
   - Prompt optimization for token efficiency

3. **UI Performance**
   - React hooks for state management
   - Conditional rendering for large components
   - Event debouncing for user inputs

### Caching Strategy

```mermaid
graph LR
    A[User Request] --> B{Session Exists?}
    B -->|Yes| C[Load from LocalStorage]
    B -->|No| D[Create New Session]
    C --> E[Render Cached Data]
    D --> F[Fresh AI Analysis]
    E --> G{User Updates?}
    G -->|Yes| H[Auto-save Changes]
    G -->|No| I[Keep Current State]
    F --> H
    H --> J[Update Cache]
```

## Security & Privacy

### Data Handling
- All data stored locally in browser
- No sensitive information sent to external servers
- API keys handled through environment variables
- Session data can be manually deleted

### API Security
- Gemini API key validation
- Error handling for rate limits
- Request timeout management
- Graceful degradation on API failures

## Development Guidelines

### Code Organization
```
src/
├── components/
│   ├── Chat.jsx              # Chat interface
│   ├── LearningPathDisplay.jsx # Main content area
│   ├── QADisplay.jsx         # Q&A section
│   ├── FlashcardView.jsx     # Full-screen flashcards
│   └── SessionManager.jsx    # Session management
├── hooks/
│   └── useChatStateMachine.js # Core state management
├── utils/
│   ├── sessionStorage.js     # Local storage operations
│   ├── promptTemplate.js     # AI prompt handling
│   └── responseParser.js     # AI response parsing
└── styles/
    └── *.css                 # Component-specific styles
```

### State Management Patterns
- Single source of truth in `useChatStateMachine`
- Immutable state updates
- Effect-based side effect handling
- Local storage synchronization

This documentation provides a comprehensive overview of the Vibe Learning system architecture, data flow, and implementation details.