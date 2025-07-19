# Claude Code Session Prompts

This document contains all the prompts sent to Claude Code during the development of the Vibe Learning platform. These prompts demonstrate the iterative development process and how AI-assisted coding can build complex applications.

## Session Overview

**Project**: Vibe Learning - AI-powered educational platform  
**Technology**: React + Vite + Google Gemini AI  
**Development Method**: AI-assisted coding with Claude Code  

---

## Prompts Chronicle

### 1. Initial Project Setup
```
create a new barebones react app
```

### 2. Chat Interface Development
```
create a chat window that is placed on the right side of the screen, using 30% of horizontal space, for every message provide a mock response
```

### 3. State Machine Implementation
```
we need a state machine, it is going to have an "initial" state, then a "processing" state, and a "ready" state. When the user sends the first message the state machine will go into "initial" state, in "initial" state it will send the prompt to google gemini using a code sample like this import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}

main();\
\
with the outcome of the function, the state machine will go into "processing".
```

### 4. Documentation and API Key Setup
```
create a README and add API KEY info there
```

### 5. Template-Based AI Integration
```
instead of calling directly gemini, I want to read from "analyze_prompt.md" and pass the user prompt as a parameter, and send the full prompt to gemini
```

### 6. Advanced Learning Path Processing
```
read analyse_prompt.md and build the logic to process the incomplete response, parse the responding json, show it, and then send the answers from the customer back to gemini
```

### 7. UI/UX Improvements
```
the questions should show in the chat window, not in the main window. Once the learning plan is completed, you will send another prompt to gemini based on create_questions_and_answers.md and you will pass the learning plan, you will then read create_questions_and_answers and parse the response of gemini (you will use a different gemini model, a more accurate one, for this task). You will display then the questions in the main window, the answers should be displayed on click, as well as the explanation on a different click. The learning path should use less real state and be pushed to the top of the app once the questions are generated.
```

### 8. Advanced Features Implementation
```
let's add a "flashcard" view of the practice questions, that takes full screen, has a next, previous question, and it shuffles, let's add local storage so that a learning session can persist, and load the learning session on start, we can create a new learnign session, and we need a way to load previously generated learning sessions. On top of that, I want the ability to re-generate the questions, and have a visual indicator that the questions are being generated, because google's request can take a few seconds.
```

### 9. Documentation Generation
```
given the current code, generate docuemntation, including mermaid diagrams of how it works
```

### 10. Documentation Cleanup
```
kill API_REFERENCE, remove the prompt templates from the doc (point the user to the files instead), add MIT license and a CONTRIBUTING.md file+
```

### 11. Git Repository Setup
```
init a git repository with https://github.com/rlbisbe/vibe-learning.git as remote, create a .gitignore that includes the .env file and node_modules, and create a commit using https://www.conventionalcommits.org/en/v1.0.0/
```

### 12. README Enhancement
```
add to the readme that this is an experiment using claude code
```

### 13. Session Documentation
```
create a document called PROMPTS.md and add all the prompts I've sent to claude code in this session
```

---

## Development Insights

### Iterative Development Pattern
The development followed a natural progression:
1. **Foundation**: Basic React app setup
2. **Core Features**: Chat interface and state management
3. **AI Integration**: Google Gemini API with template system
4. **Advanced UI**: Flashcard mode and session management
5. **Documentation**: Comprehensive docs and contribution guidelines
6. **Project Management**: Git setup and versioning

### AI-Assisted Development Benefits
- **Rapid Prototyping**: From concept to working application in a single session
- **Complex Feature Implementation**: State machines, AI integration, and persistence
- **Documentation Generation**: Automated creation of comprehensive documentation
- **Best Practices**: Following conventional commits, proper project structure
- **Error Handling**: Robust error management and graceful degradation

### Technical Decisions Made
- **State Management**: Custom hook with state machine pattern
- **AI Models**: Dual model approach (fast vs accurate)
- **Storage**: Local storage for session persistence
- **UI/UX**: Split-screen layout with modal overlays
- **Architecture**: Component-based with clear separation of concerns

### Learning Outcomes
This session demonstrates how AI-assisted development can:
- Handle complex requirements iteratively
- Generate production-ready code with proper documentation
- Follow industry best practices and conventions
- Create comprehensive project setup including licensing and contribution guidelines
- Implement advanced features like flashcards, session management, and AI integration

---

## Final Project Structure

The session resulted in a complete educational platform with:
- ✅ React-based frontend with modern patterns
- ✅ Google Gemini AI integration with dual models
- ✅ State machine architecture for chat flow
- ✅ Flashcard study mode with full-screen experience
- ✅ Session persistence and management
- ✅ Comprehensive documentation and contribution guidelines
- ✅ Proper git setup with conventional commits
- ✅ MIT license for open source distribution

**Total Development Time**: Single session  
**Lines of Code**: 4,877+ insertions  
**Files Created**: 29 files  
**Documentation**: Complete with mermaid diagrams