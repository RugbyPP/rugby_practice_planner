import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface SessionGenerationInput {
  ageGrade: string;
  gender: string;
  playerCount: number;
  abilityLevel: string;
  sessionLength: number;
  topic: string;
  principle: string;
  struggles?: string;
  desiredOutcome?: string;
  contactLevel: string;
  equipment?: string;
  space?: string;
}

export interface SessionAdaptationInput {
  originalPlan: string;
  adaptationType: string;
  sessionContext: SessionGenerationInput;
}

const SYSTEM_PROMPT = `You are an expert RFU (Rugby Football Union) rugby coach and session planner. Your role is to generate structured, age-grade aware, safety-conscious rugby session plans.

CRITICAL SAFETY GUARDRAILS:
1. Default to NO CONTACT or TOUCH ONLY unless explicitly requested and age-appropriate
2. For Under 7-8: NO CONTACT - touch and tag only
3. For Under 9-10: MINIMAL CONTACT - controlled contact with coaching focus
4. For Under 11-12: PROGRESSIVE CONTACT - introduce controlled tackle technique
5. For Under 13+: FULL CONTACT - standard contact with safety emphasis
6. Always include a Coach Responsibility Note at the end
7. Never suggest activities inappropriate for the age group
8. Always include APES check (Active, Purposeful, Enjoyable, Safe)

SESSION STRUCTURE:
- Warm-Up / Game Readiness (10-15% of time)
- Game Zone (30-40% of time) - small-sided game with conditions
- Skill Zone (30-40% of time) - focused skill practice with progressions
- Return to Game (10-15% of time) - apply skills back into game
- Cool-Down / Review (5% of time)

RESPONSE FORMAT:
Return ONLY valid markdown. No code blocks, no explanations. Start with the session title.

# [Age Grade] — [Topic]

[Session overview paragraph]

## Principle Link
[Link to RFU principle]

## Session Aim
[Clear aim statement]

## APES Check
- **Active:** [How players stay active]
- **Purposeful:** [How activities link to aim]
- **Enjoyable:** [Why it's engaging]
- **Safe:** [Safety measures]

## Timed Session Plan

### Warm-Up / Game Readiness ([X] minutes)
[Description and coaching points]

### Game Zone ([X] minutes)
[Description, conditions, and coaching focus]

### Skill Zone ([X] minutes)
[Description, progressions, and key coaching points]

### Return to Game ([X] minutes)
[Description and application]

### Cool-Down / Review ([X] minutes)
[Description and reflection questions]

## Coaching Points
- [Point 1]
- [Point 2]
- [Point 3]

## Player-Centred Questions
- [Question 1]
- [Question 2]
- [Question 3]

---

**Coach Responsibility Note**
This session is RFU-informed planning support. Coaches remain responsible for checking current RFU regulations, safeguarding requirements, first aid provision, venue risk assessments, player readiness, coaching competence and session suitability before delivery.`;

export async function generateSession(input: SessionGenerationInput): Promise<string> {
  const contactWarning = input.contactLevel === 'full_contact' 
    ? '\n⚠️ COACH SAFETY WARNING: Full contact requested. Ensure players are physically and mentally ready, appropriate protective equipment is available, and you have first aid provision.'
    : '';

  const userPrompt = `Generate a ${input.sessionLength}-minute rugby session plan for:
- Age Grade: ${input.ageGrade}
- Gender: ${input.gender}
- Player Count: ${input.playerCount}
- Ability Level: ${input.abilityLevel}
- Topic: ${input.topic}
- Principle: ${input.principle}
${input.struggles ? `- Player Struggles: ${input.struggles}` : ''}
${input.desiredOutcome ? `- Desired Outcome: ${input.desiredOutcome}` : ''}
- Contact Level: ${input.contactLevel}
${input.equipment ? `- Equipment Available: ${input.equipment}` : ''}
${input.space ? `- Space: ${input.space}` : ''}

${contactWarning}

Create a structured, age-appropriate session that addresses the topic and principle. Ensure all activities are safe for the age group and contact level specified.`;

  try {
    const message = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 2000,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const content = message.choices[0].message.content;
    if (!content) {
      throw new Error('No content in response from OpenAI');
    }

    return content;
  } catch (error) {
    console.error('LLM generation error:', error);
    throw new Error('Failed to generate session plan');
  }
}

export async function generateAdaptation(
  originalPlan: string,
  adaptationType: string,
  context: SessionGenerationInput
): Promise<string> {
  const adaptationPrompts: Record<string, string> = {
    pitch_side: `Create a PITCH-SIDE COACH CARD from this session plan. Format as a single-page reference with:
- Key coaching points (3-4 bullet points)
- Session structure (timing)
- Key player questions (2-3)
Keep it concise and actionable for coaching from the sideline.`,

    assistant_brief: `Create an ASSISTANT COACH BRIEF from this session plan. Include:
- Your role and responsibilities
- Key coaching focus areas
- What to watch for
- How to support the main coach
Format as a short, clear brief (200-300 words).`,

    parent_summary: `Create a PARENT-FRIENDLY SUMMARY from this session plan. Explain:
- What their child will learn
- Why it's important for rugby development
- How they can help at home
Format in simple, non-technical language (150-250 words).`,

    make_easier: `Create an EASIER VERSION of this session for players who are struggling. Modify:
- Reduce complexity of skills
- Simplify game conditions
- Add more repetition and practice
- Provide more scaffolding
Keep the same topic and principle but make it more accessible.`,

    make_harder: `Create a HARDER VERSION of this session for advanced players. Modify:
- Increase skill complexity
- Add game-realistic conditions
- Reduce scaffolding
- Challenge decision-making
Keep the same topic and principle but increase the challenge.`,

    no_contact: `Create a NO-CONTACT VERSION of this session. Modify all contact activities to:
- Use touch rugby rules
- Replace tackles with touch/tag
- Maintain game realism through positioning and support
- Keep the same topic and principle with non-contact methods.`,

    increase_contact: `Create an INCREASED CONTACT VERSION of this session. Modify to:
- Progress from touch to controlled contact
- Introduce tackle technique progressions
- Add contact scenarios in the game
- Ensure appropriate safety and coaching focus
${context.ageGrade.includes('7') || context.ageGrade.includes('8') 
  ? 'NOTE: This age group should NOT have full contact. Keep to touch-only or minimal controlled contact.' 
  : ''}`,

    fewer_players: `Create a FEWER PLAYERS VERSION of this session. Adapt for smaller groups:
- Modify game formats (e.g., 3v3 instead of full-sided)
- Adjust skill practice for smaller numbers
- Maintain the same topic and principle
- Ensure all players stay active.`,

    one_to_one: `Create a ONE-TO-ONE COACHING VERSION of this session. Adapt for:
- Individual player coaching
- Focused skill development
- Personalized progression
- Maintain the same topic and principle
- Include specific coaching cues.`,

    small_group: `Create a SMALL GROUP VERSION of this session (4-6 players). Adapt for:
- Small group dynamics
- Focused skill practice
- Game-based learning
- Maintain the same topic and principle
- Ensure high activity levels.`,
  };

  const adaptationPrompt = adaptationPrompts[adaptationType];
  if (!adaptationPrompt) {
    throw new Error(`Unknown adaptation type: ${adaptationType}`);
  }

  try {
    const message = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 2000,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `Original session plan:\n\n${originalPlan}\n\n---\n\n${adaptationPrompt}`,
        },
      ],
    });

    const content = message.choices[0].message.content;
    if (!content) {
      throw new Error('No content in response from OpenAI');
    }

    return content;
  } catch (error) {
    console.error('LLM adaptation error:', error);
    throw new Error('Failed to generate adaptation');
  }
}

export async function generateProgressionSuggestion(
  previousSessionPlan: string,
  previousTopic: string,
  ageGrade: string,
  principle: string
): Promise<string> {
  const prompt = `Based on this previous session plan, suggest a natural progression for the next session:

Previous Session (${previousTopic}):
${previousSessionPlan}

Generate a brief progression suggestion (100-150 words) that:
1. Builds on the previous session's learning
2. Increases complexity or introduces new elements
3. Maintains the same principle (${principle})
4. Is appropriate for ${ageGrade}
5. Suggests a specific topic for the next session

Format as a clear, actionable suggestion for the coach.`;

  try {
    const message = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 300,
      messages: [
        {
          role: 'system',
          content: 'You are an expert rugby coach providing progression suggestions for session planning.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.choices[0].message.content;
    if (!content) {
      throw new Error('No content in response from OpenAI');
    }

    return content;
  } catch (error) {
    console.error('LLM progression error:', error);
    throw new Error('Failed to generate progression suggestion');
  }
}
