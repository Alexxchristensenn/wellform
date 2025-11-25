/**
 * AI Service - OpenAI Integration
 * 
 * Handles all interactions with OpenAI API for Simplifit.
 * - Food recognition via gpt-4o-mini with vision
 * - Chat/coaching responses
 * 
 * Security: Uses EXPO_PUBLIC_OPENAI_API_KEY from environment variables.
 * Response Format: Always uses json_object mode for structured responses.
 */

import OpenAI from 'openai';
import { AIFoodResponse, UserProfile } from '../types/schema';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for Expo/React Native
});

/**
 * Analyze food image and return nutritional information
 * 
 * @param base64Image - Base64 encoded image string
 * @returns Parsed nutritional data or null if analysis fails
 */
export async function analyzeFoodImage(
  base64Image: string
): Promise<AIFoodResponse | null> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an empathetic nutritionist analyzing food images. Return your analysis as JSON with this exact structure: { "name": string, "cals": number, "macros": { "p": number, "c": number, "f": number }, "micros": string[], "tip": string }. Be accurate with calorie estimates.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this food image. Provide nutritional information and a helpful tip.',
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
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.error('[AI Service] No content in OpenAI response');
      return null;
    }

    const parsed = JSON.parse(content) as AIFoodResponse;
    return parsed;
  } catch (error) {
    console.error('[AI Service] Error analyzing food image:', error);
    return null;
  }
}

/**
 * Generate contextual chat response for user questions
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
    const contextPrompt = `You are Simplifit, a supportive health coach. User context: ${userProfile.profile.displayName}, goal: ${userProfile.stats.goalWeightKg}kg, current: ${userProfile.stats.currentWeightKg}kg. Keep answers under 3 sentences and be encouraging.`;

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

    const parsed = JSON.parse(content) as { message: string };
    return parsed.message || null;
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

