"""Avatar generation using DiceBear API"""
import json
from typing import Dict, Any

def generate_dicebear_url(avatar_config: Dict[str, Any]) -> str:
    """
    Generate a DiceBear avatar URL from character config
    DiceBear is a service that generates highly customizable avatars from seed/options
    
    Supported styles: avataaars, big-ears, big-smile, bottts, croodles, faces, fun-emoji, lorelei, micah, miniavs, mingcute, notionists, open-peeps, personas, pixel-art, rings, shapes, thumbs
    """
    # Map our properties to DiceBear parameters
    style = "avataaars"  # Most customizable style
    
    # Build DiceBear seed from character name
    seed = avatar_config.get("ai_name", "Character").replace(" ", "-")
    
    # Map appearance to DiceBear options
    options = {
        "seed": seed,
        "style": style,
        "scale": 100,
        "radius": 0,
        "backgroundColor": "transparent",
    }
    
    # Map face shape
    face_shape = avatar_config.get("face_shape", "oval")
    if face_shape == "round":
        options["facialHair"] = "Blank"
        options["topType"] = "ShortHairShortFlat"
    elif face_shape == "sharp":
        options["facialHair"] = "MoustacheMagnum"
    
    # Map hair style
    hair_style_map = {
        "short": "ShortHairShortFlat",
        "medium": "ShortHairShortRound",
        "long": "LongHairBigHair",
        "curly": "ShortHairShaggy",
        "straight": "ShortHairShortStraight",
        "messy": "ShortHairShaggy",
    }
    hair_style = avatar_config.get("hair_style", "long")
    if hair_style in hair_style_map:
        options["topType"] = hair_style_map[hair_style]
    
    # Map eye type
    eye_type = avatar_config.get("eye_type", "soft")
    eye_type_map = {
        "sharp": "Side",
        "soft": "Happy",
        "sleepy": "Squint",
        "expressive": "Surprised",
    }
    if eye_type in eye_type_map:
        options["eyeType"] = eye_type_map[eye_type]
    
    # Map outfit vibe
    outfit_map = {
        "casual": "Hoodie",
        "streetwear": "GraphicShirt",
        "soft": "BlazerSweater",
        "formal": "BlazerShirt",
        "dark_academia": "BlazerSweater",
    }
    outfit = avatar_config.get("outfit_vibe", "casual")
    if outfit in outfit_map:
        options["clotheType"] = outfit_map[outfit]
    
    # Map accessories
    if avatar_config.get("has_glasses", False):
        options["accessoriesType"] = "Prescription01"
    
    # Build URL
    url = f"https://api.dicebear.com/7.x/{style}/svg?{format_dicebear_params(options)}"
    return url


def format_dicebear_params(options: Dict[str, Any]) -> str:
    """Format options as query string"""
    params = []
    for key, value in options.items():
        if value is not None:
            params.append(f"{key}={str(value).lower()}")
    return "&".join(params)


def generate_avatar_config(character_data: Dict[str, Any]) -> str:
    """Generate JSON config for avatar storage"""
    config = {
        # Identity
        "ai_name": character_data.get("ai_name", "Echo"),
        "gender": character_data.get("gender", "non-binary"),
        "age_range": character_data.get("age_range", 25),
        "pronouns": character_data.get("pronouns", "they/them"),
        
        # Face
        "face_shape": character_data.get("face_shape", "oval"),
        "skin_tone": character_data.get("skin_tone", "#fdbcb4"),
        "eye_type": character_data.get("eye_type", "soft"),
        "eye_color": character_data.get("eye_color", "#8b7355"),
        "eyebrow_style": character_data.get("eyebrow_style", "natural"),
        
        # Hair
        "hair_style": character_data.get("hair_style", "long"),
        "hair_color": character_data.get("hair_color", "#2c2416"),
        
        # Body
        "height": character_data.get("height", 50),
        "build": character_data.get("build", "average"),
        
        # Style
        "outfit_vibe": character_data.get("outfit_vibe", "casual"),
        
        # Accessories
        "has_glasses": character_data.get("has_glasses", False),
        "glasses_style": character_data.get("glasses_style"),
        "has_piercings": character_data.get("has_piercings", False),
        "piercing_count": character_data.get("piercing_count", 0),
        "has_jewelry": character_data.get("has_jewelry", False),
        "jewelry_type": character_data.get("jewelry_type"),
        
        # Visual personality
        "glow_color": character_data.get("glow_color", "#a855f7"),
        "glow_intensity": character_data.get("glow_intensity", 70),
        "color_warmth": character_data.get("color_warmth", 50),
        "expression_tendency": character_data.get("expression_tendency", "neutral"),
    }
    
    return json.dumps(config)
