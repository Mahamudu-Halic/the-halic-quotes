import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    return new GoogleGenerativeAI(apiKey);
  } catch (e) {
    console.error('Failed to initialize GoogleGenAI client', e);
    return null;
  }
};

/**
 * Generates an AI quote based on inputs.
 */
export async function generateAIQuote(
  topic: string,
  mood: string,
  goal: string,
  audience: string
): Promise<string> {
  const client = getGeminiClient();
  if (client) {
    try {
      const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Generate a single short motivational quote (under 25 words) targeting the topic "${topic}", matching a "${mood}" mood, with the ultimate goal of "${goal}", tailored for an audience of "${audience}". Do not include quotes, wrappers, or headers. Make it punchy and deeply inspiring.`;
      const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
      const text = result.response.text();
      return text.trim().replace(/^["']|["']$/g, '');
    } catch (e) {
      console.error('Gemini generate quote failed, falling back...', e);
    }
  }

  // High-quality local rules-based fallback
  const fallbacks: Record<string, string[]> = {
    Success: [
      `Success isn't built in a day, it's forged in the quiet persistence of every single hour. Keep building.`,
      `The road to success is paved with active choices, not passive wishes. Own your progress today.`,
      `Your goals don't care how you feel. Show up, do the work, and let the results speak.`
    ],
    Productivity: [
      `Discipline is choosing between what you want now and what you want most. Focus is your superpower.`,
      `Action cures fear; procrastination feeds it. Start with five minutes of focused effort.`,
      `Build systems, not just goals. A consistent 1% daily gain outweighs any occasional burst of energy.`
    ],
    Discipline: [
      `True freedom is found in discipline. The rules you set for yourself will set you free.`,
      `Motivation gets you started. Discipline keeps you growing when the excitement fades.`,
      `The pain of self-discipline is temporary; the regret of slacking is permanent. Stay firm.`
    ],
    Growth: [
      `Do not fear slow progress; fear standing still. The seed grows in silence before it breaks the soil.`,
      `Comfort is the enemy of progress. Lean into the challenge; that is where your strength resides.`,
      `Every setback is a setup for a comeback. You are learning, evolving, and growing.`
    ]
  };

  const topicList = fallbacks[topic] || fallbacks['Success'];
  const randomIndex = Math.floor(Math.random() * topicList.length);
  return topicList[randomIndex];
}

/**
 * Rewrites an existing quote in a specific style.
 */
export async function rewriteQuote(quote: string, style: string): Promise<string> {
  const client = getGeminiClient();
  if (client) {
    try {
      const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Rewrite the following quote in a "${style}" style. Keep it concise (under 30 words) and maintain the core inspiring message. Do not include quotes.
Quote: "${quote}"`;
      const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
      return result.response.text().trim().replace(/^["']|["']$/g, '');
    } catch (e) {
      console.error('Gemini rewrite quote failed, falling back...', e);
    }
  }

  // Fallbacks based on style
  switch (style) {
    case 'Funny':
      return `Look, ${quote.toLowerCase().replace(/\.$/, '')}—or you could just take a nap and try again tomorrow. Either works.`;
    case 'Gen-Z':
      return `Fr, ${quote.replace(/\.$/, '')} is pure main character energy. No cap. 💅`;
    case 'Business':
      return `Optimizing your operational baseline: ${quote} Let's execute.`;
    case 'Professional':
      return `To achieve maximum output: ${quote}`;
    case 'Inspirational':
    default:
      return `Believe in the journey: ${quote} Your potential is unlimited.`;
  }
}

/**
 * Generates an explanation for a quote.
 */
export interface QuoteExplanation {
  meaning: string;
  application: string;
  example: string;
}

export async function explainQuote(quote: string): Promise<QuoteExplanation> {
  const client = getGeminiClient();
  if (client) {
    try {
      const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Explain the motivational quote: "${quote}". Return your response in JSON format matching this structure:
{
  "meaning": "Clear, profound explanation of what this quote means in simple words.",
  "application": "3 actionable, practical steps on how to apply this to daily life.",
  "example": "A real-world or historical example demonstrating this concept in action."
}`;
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      });
      const responseText = result.response.text();
      return JSON.parse(responseText);
    } catch (e) {
      console.error('Gemini explain quote failed, falling back...', e);
    }
  }

  return {
    meaning: `This quote highlights the power of persistence and positive mindset. It reminds us that external obstacles are secondary to our internal resolve.`,
    application: `1. Write down one small goal today and finish it.\n2. When facing frustration, pause for 10 seconds before reacting.\n3. Keep a journal of minor wins to train your brain for gratitude.`,
    example: `Think of Steve Jobs being ousted from Apple in 1985. Rather than giving up, he founded NeXT and Pixar, which ultimately led to his triumphant return and the creation of the iPhone.`
  };
}

/**
 * Premium AI Motivation Coach chat response.
 */
export interface CoachResponse {
  response: string;
  quote: string;
  steps: string[];
}

export async function getMotivationCoachResponse(
  message: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[]
): Promise<CoachResponse> {
  const client = getGeminiClient();
  if (client) {
    try {
      const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const systemInstruction = `You are a premium AI Motivation Coach on the platform TheHalicQuotes. Your goal is to guide the user through their struggles, validate their feelings, offer immediate warm encouragement, supply a highly relevant inspirational quote, and provide 3 actionable, structured steps they can complete today.
Always respond in JSON format with these exact keys:
{
  "response": "Warm, encouraging message (100-150 words).",
  "quote": "A single highly inspiring quote.",
  "steps": ["Action step 1", "Action step 2", "Action step 3"]
}`;

      // Call Gemini model
      const contents = [
        ...history,
        { role: 'user' as const, parts: [{ text: message }] }
      ];

      const result = await model.generateContent({
        contents,
        systemInstruction,
        generationConfig: { responseMimeType: 'application/json' }
      });

      const responseText = result.response.text();
      return JSON.parse(responseText);
    } catch (e) {
      console.error('Gemini coach session failed, falling back...', e);
    }
  }

  // Robust, context-aware rule-based fallback based on keywords
  const lowerMsg = message.toLowerCase();
  let coachWords = `I hear you, and it is completely normal to feel this way. Challenges are not blockades; they are signals showing us where we can expand. Take a deep breath. We will navigate this together.`;
  let quote = `Hardships prepare ordinary people for an extraordinary destiny.`;
  let steps = [
    `Unplug from screens for 15 minutes to reset your mental space.`,
    `Write down the single smallest thing you can control right now.`,
    `Congratulate yourself for showing up and seeking a way forward.`
  ];

  if (lowerMsg.includes('fail') || lowerMsg.includes('interview') || lowerMsg.includes('lose') || lowerMsg.includes('lost')) {
    coachWords = `Failing an interview or facing rejection is incredibly painful, but please remember: it is a rejection of a single fit, not a rejection of your worth or future potential. Every 'no' brings you closer to the right 'yes'. Let's learn from it and refine our strategy.`;
    quote = `Success consists of going from failure to failure without loss of enthusiasm.`;
    steps = [
      `Send a polite thank-you note asking for constructive feedback.`,
      `List 3 skills you demonstrated successfully during the process.`,
      `Review and update one project on your portfolio today.`
    ];
  } else if (lowerMsg.includes('tired') || lowerMsg.includes('exhausted') || lowerMsg.includes('burn') || lowerMsg.includes('burnout')) {
    coachWords = `Burnout is your body and mind telling you that the current pace is unsustainable. Rest is not a reward for completing work; it is a vital prerequisite. Give yourself full permission to slow down today.`;
    quote = `Rest when you're weary. Refresh and renew yourself, your body, your mind, your spirit. Then get back to work.`;
    steps = [
      `Drink a glass of water and stretch for 5 minutes right now.`,
      `Declare a 'no-work zone' for the rest of the evening.`,
      `Sleep at least 8 hours tonight without checking notifications.`
    ];
  } else if (lowerMsg.includes('lazy') || lowerMsg.includes('procrastinate') || lowerMsg.includes('start')) {
    coachWords = `Procrastination is rarely about laziness; it is usually a defense mechanism against anxiety or feeling overwhelmed. Break the paralysis by lowering the bar for what success looks like today.`;
    quote = `The secret of getting ahead is getting started. The secret of getting started is breaking your complex overwhelming tasks into small manageable tasks, and starting on the first one.`;
    steps = [
      `Set a timer for exactly 5 minutes and commit to working on one task.`,
      `Turn off your phone or block distracting apps.`,
      `Write down the absolute next step, even if it is just opening a file.`
    ];
  }

  return { response: coachWords, quote, steps };
}
