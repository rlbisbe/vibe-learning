export function parseGeminiResponse(responseText) {
  try {
    // Extract JSON from markdown code blocks if present
    const jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : responseText.trim();
    
    // Clean up the JSON string
    const cleanedJson = jsonString
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    
    const parsed = JSON.parse(cleanedJson);
    
    // Validate the structure
    if (parsed.learningPath || parsed.questions) {
      return {
        success: true,
        data: parsed,
        hasQuestions: Boolean(parsed.questions && parsed.questions.length > 0),
        isComplete: Boolean(parsed.learningPath && 
                           parsed.learningPath.topic && 
                           parsed.learningPath.subtopic && 
                           parsed.learningPath.level)
      };
    }
    
    return {
      success: false,
      error: 'Invalid response structure',
      rawResponse: responseText
    };
    
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    return {
      success: false,
      error: error.message,
      rawResponse: responseText
    };
  }
}

export function formatLearningPath(learningPath) {
  const parts = [];
  if (learningPath.topic) parts.push(`Topic: ${learningPath.topic}`);
  if (learningPath.subtopic) parts.push(`Subtopic: ${learningPath.subtopic}`);
  if (learningPath.level) parts.push(`Level: ${learningPath.level}`);
  return parts.join('\n');
}

export function buildFollowUpPrompt(originalPrompt, questions, answers) {
  let prompt = `Based on the original request: "${originalPrompt}"\n\n`;
  prompt += `Here are the additional details provided:\n`;
  
  questions.forEach((question, index) => {
    prompt += `Q: ${question}\n`;
    prompt += `A: ${answers[index] || 'No answer provided'}\n\n`;
  });
  
  prompt += `Please provide the complete learning path information in the same JSON format.`;
  
  return prompt;
}

export function parseQAResponse(responseText) {
  try {
    // Extract JSON from markdown code blocks if present
    const jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : responseText.trim();
    
    // Clean up the JSON string
    const cleanedJson = jsonString
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    
    const parsed = JSON.parse(cleanedJson);
    
    // Validate the structure
    if (parsed.answers && Array.isArray(parsed.answers)) {
      return {
        success: true,
        data: parsed
      };
    }
    
    return {
      success: false,
      error: 'Invalid Q&A response structure',
      rawResponse: responseText
    };
    
  } catch (error) {
    console.error('Error parsing Q&A response:', error);
    return {
      success: false,
      error: error.message,
      rawResponse: responseText
    };
  }
}