export async function loadPromptTemplate() {
  try {
    const response = await fetch('/analyze_prompt.md');
    const templateText = await response.text();
    return templateText;
  } catch (error) {
    console.error('Error loading prompt template:', error);
    return null;
  }
}

export async function loadQATemplate() {
  try {
    const response = await fetch('/create_questions_and_answers.md');
    const templateText = await response.text();
    return templateText;
  } catch (error) {
    console.error('Error loading QA template:', error);
    return null;
  }
}

export function buildFullPrompt(template, userPrompt) {
  if (!template) {
    return userPrompt;
  }
  
  return template.replace('[PROMPT]', userPrompt);
}

export function buildQAPrompt(template, learningPlan) {
  if (!template) {
    return JSON.stringify(learningPlan);
  }
  
  return template.replace('[PLAN]', JSON.stringify(learningPlan));
}