/**
 * AI Service - OpenAI Integration
 * 
 * Handles all interactions with OpenAI API for Simplifit.
 * - Plate analysis via gpt-4o-mini with vision (EDUCATION ONLY - no calories)
 * - Chat/coaching responses with the Simplifit persona
 * 
 * Security: Uses EXPO_PUBLIC_OPENAI_API_KEY from environment variables.
 * Response Format: Always uses json_object mode for structured responses.
 * 
 * @updated SIM-013: Removed calorie/macro extraction. Education only.
 */

import OpenAI from 'openai';
import { AIPlateResponse, UserProfile } from '../types/schema';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for Expo/React Native
});

/**
 * The Simplifit Persona - used across all AI interactions
 * 
 * Hierarchy: Scientific > Supportive > Witty
 */
const SIMPLIFIT_PERSONA = `You are Simplifit, a supportive health coach grounded in science.

PERSONA HIERARCHY:
1. Scientific (Primary): Base everything on biology. Use correct terminology (satiety, thermic effect, protein leverage) but explain simply.
2. Supportive (Secondary): High empathy, no judgment. If the user struggles, offer data, not shame.
3. Witty (Tertiary): Dry humor is allowed. Poke fun at "detoxes" and "magic pills."

STRICT RULES:
- NEVER mention calories, macros, or specific nutritional numbers.
- NEVER ask users to weigh, measure, or count anything.
- Focus on BEHAVIORS: protein presence, vegetable presence, satiety awareness.
- Keep responses under 100 words unless asked for more detail.`;

/**
 * Analyze plate photo for EDUCATION purposes only
 * 
 * Returns whether protein and vegetables are present, plus a helpful tip.
 * Does NOT return calories, macros, or portion sizes.
 * 
 * @param base64Image - Base64 encoded image string
 * @returns Education-only plate analysis or null if analysis fails
 */
export async function analyzePlateImage(
  base64Image: string
): Promise<AIPlateResponse | null> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `${SIMPLIFIT_PERSONA}

You are analyzing a food photo for educational purposes ONLY.

STRICT OUTPUT FORMAT (JSON):
{
  "hasProtein": boolean,
  "hasVegetables": boolean, 
  "suggestion": string
}

RULES FOR ANALYSIS:
- hasProtein: true if you see a palm-sized portion of meat, fish, eggs, tofu, legumes, or dairy.
- hasVegetables: true if you see at least one serving of vegetables, salad, or plants.
- suggestion: A friendly, educational tip (max 2 sentences). Focus on what could be ADDED, not what's wrong.

NEVER mention calories, macros, portion weights, or nutritional numbers.`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this plate. Is there protein? Are there vegetables? Give me one friendly tip.',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 300,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.error('[AI Service] No content in OpenAI response');
      return null;
    }

    const parsed = JSON.parse(content);
    
    // Validate the response structure
    if (typeof parsed.hasProtein !== 'boolean' || typeof parsed.hasVegetables !== 'boolean') {
      console.error('[AI Service] Invalid response structure:', parsed);
      return null;
    }

    return {
      hasProtein: parsed.hasProtein,
      hasVegetables: parsed.hasVegetables,
      suggestion: parsed.suggestion || 'Looking good! Keep building those healthy habits.',
    };
  } catch (error) {
    console.error('[AI Service] Error analyzing plate image:', error);
    return null;
  }
}

/**
 * Generate contextual chat response for user questions
 * 
 * Uses the Simplifit persona (Scientific > Supportive > Witty).
 * Returns structured JSON with a message field.
 * 
 * @param userMessage - The user's question or message
 * @param userProfile - User's profile for personalized context
 * @returns AI response string or null if generation fails
 */
export async function generateChatResponse(
  userMessage: string,
  userProfile: UserProfile
): Promise<string | null> {
  try {
    const contextPrompt = `${SIMPLIFIT_PERSONA}

USER CONTEXT:
- Name: ${userProfile.profile.displayName}
- Goal weight: ${userProfile.stats.goalWeightKg}kg
- Current trend: ${userProfile.stats.currentWeightKg}kg

Respond to the user's message with empathy and science. Keep your answer under 3 sentences.

OUTPUT FORMAT (JSON):
{ "message": "Your response here" }`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: contextPrompt },
        { role: 'user', content: userMessage },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 200,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.error('[AI Service] No content in chat response');
      return null;
    }

    const parsed = JSON.parse(content);
    
    // Validate response structure
    if (typeof parsed.message !== 'string') {
      console.error('[AI Service] Invalid chat response structure:', parsed);
      return null;
    }

    return parsed.message;
  } catch (error) {
    console.error('[AI Service] Error generating chat response:', error);
    return null;
  }
}

/**
 * Validate OpenAI API key is configured
 * 
 * @returns true if API key exists, false otherwise
 */
export function isAIConfigured(): boolean {
  return !!process.env.EXPO_PUBLIC_OPENAI_API_KEY;
}

// ============================================================================
// DEPRECATED EXPORTS (For backwards compatibility during migration)
// ============================================================================

/**
 * @deprecated Use analyzePlateImage instead
 * This function now calls analyzePlateImage internally
 */
export async function analyzeFoodImage(
  base64Image: string
): Promise<AIPlateResponse | null> {
  console.warn('[AI Service] analyzeFoodImage is deprecated. Use analyzePlateImage instead.');
  return analyzePlateImage(base64Image);
}
