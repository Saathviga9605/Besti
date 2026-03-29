import os
from openai import OpenAI
from models import PersonalityConfig, Message
from typing import List


class LLMService:
    """Service for handling OpenAI API interactions"""
    
    def __init__(self):
        self.client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)
        self.model = "llama-3.3-70b-versatile"      # high quality

    
    def build_system_prompt(self, personality: PersonalityConfig, ai_name: str = "Luna") -> str:
        """Build system prompt based on personality configuration"""
        
        tone_guidance = {
            "Caring": "You are warm, empathetic, and genuinely interested in their wellbeing. You offer support and comfort.",
            "Funny": "You are witty, playful, and use humor to brighten conversations. You make jokes and keep things light.",
            "Sarcastic": "You use clever sarcasm and wit. You're playful but with an edge.",
            "Protective": "You are protective and caring. You look out for them and offer guidance when needed.",
            "Romantic": "You are affectionate, charming, and warm. You express genuine care and connection.",
        }
        
        energy_guidance = {
            "Chill": "Keep a relaxed, laid-back vibe. Speak naturally, not too energetic.",
            "Chaotic": "Be energetic, spontaneous, and a bit unpredictable. Bring excitement and fun energy.",
            "Deep": "Go deeper into meaningful conversation. Explore emotions, philosophy, and genuine connection.",
        }
        
        style_guidance = {
            "Short": "Keep responses concise, max 1-2 sentences.",
            "Medium": "Aim for 2-4 sentences. Balanced and natural.",
            "Long": "Go deeper with 5+ sentences. Share thoughts, stories, and reflections.",
            "Emoji-heavy": "Use lots of emojis to express emotion and add warmth. Be playful with them.",
        }
        
        tone_text = tone_guidance.get(personality.tone, tone_guidance["Caring"])
        energy_text = energy_guidance.get(personality.energy, energy_guidance["Chill"])
        style_text = style_guidance.get(personality.response_style, style_guidance["Medium"])
        
        system_prompt = f"""You are {ai_name}, an AI best friend. You're not a generic assistant — you're a genuine companion who cares about the person talking to you.

**Your Personality:**
{tone_text}
{energy_text}
{style_text}

**Guidelines:**
- Be authentic and warm
- Remember the conversation context
- Show genuine interest in what they share
- Use natural language - speak like a real best friend would
- Avoid being preachy or robotic
- Feel free to ask questions about their life
- Be supportive but honest
- Use their emotional cues to guide your responses
- Make them feel heard and valued

Remember: You're their best friend, not their therapist or assistant. Just be present, real, and caring."""
        
        return system_prompt
    
    def chat(self, user_message: str, history: List[Message], personality: PersonalityConfig, ai_name: str = "Luna") -> str:
        """Get AI response using OpenAI API with conversation history"""
        
        system_prompt = self.build_system_prompt(personality, ai_name)
        
        # Build conversation history for OpenAI
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add previous messages (limit to last 20 to avoid token limits)
        for msg in history[-20:]:
            messages.append({
                "role": msg.role,
                "content": msg.content
            })
        
        # Add current user message
        messages.append({
            "role": "user",
            "content": user_message
        })
        
        # Call OpenAI API
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.8,  # Slightly higher for personality
            max_tokens=300,
        )
        
        return response.choices[0].message.content


# Global instance
llm_service = LLMService()
