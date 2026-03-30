import React, { useState, useEffect } from "react";
import useStore from "../store/useStore";

const CharacterCreator = ({ onCharacterCreated }) => {
  const authToken = useStore((state) => state.authToken);
  const userId = useStore((state) => state.userId);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  // Form state - all character properties
  const [character, setCharacter] = useState({
    // Identity
    ai_name: "",
    gender: "non-binary",
    age_range: 25,
    pronouns: "they/them",
    // Face
    face_shape: "oval",
    skin_tone: "#fdbcb4",
    eye_type: "soft",
    eye_color: "#8b7355",
    eyebrow_style: "natural",
    // Hair
    hair_style: "long",
    hair_color: "#2c2416",
    // Body
    height: 50,
    build: "average",
    // Style
    outfit_vibe: "casual",
    // Accessories
    has_glasses: false,
    glasses_style: "Prescription01",
    has_piercings: false,
    piercing_count: 0,
    has_jewelry: false,
    jewelry_type: "",
    // Personality
    glow_color: "#a855f7",
    glow_intensity: 70,
    color_warmth: 50,
    expression_tendency: "neutral",
  });

  // Generate preview URL whenever character changes
  useEffect(() => {
    generatePreview();
  }, [character]);

  const generatePreview = async () => {
    try {
      // Build DiceBear URL based on character properties
      const params = new URLSearchParams({
        seed: character.ai_name.replace(/\s+/g, "-") || "character",
        style: "avataaars",
        scale: 100,
        radius: 0,
        backgroundColor: "transparent",
      });

      // Map appearance to DiceBear options
      const hairMap = {
        short: "ShortHairShortFlat",
        medium: "ShortHairShortRound",
        long: "LongHairBigHair",
        curly: "ShortHairShaggy",
        straight: "ShortHairShortStraight",
        messy: "ShortHairShaggy",
      };

      const eyeTypeMap = {
        sharp: "Side",
        soft: "Happy",
        sleepy: "Squint",
        expressive: "Surprised",
      };

      const outfitMap = {
        casual: "Hoodie",
        streetwear: "GraphicShirt",
        soft: "BlazerSweater",
        formal: "BlazerShirt",
        dark_academia: "BlazerSweater",
      };

      if (hairMap[character.hair_style]) {
        params.set("topType", hairMap[character.hair_style]);
      }

      if (eyeTypeMap[character.eye_type]) {
        params.set("eyeType", eyeTypeMap[character.eye_type]);
      }

      if (outfitMap[character.outfit_vibe]) {
        params.set("clotheType", outfitMap[character.outfit_vibe]);
      }

      if (character.has_glasses) {
        params.set("accessoriesType", "Prescription01");
      }

      const url = `https://api.dicebear.com/7.x/avataaars/svg?${params.toString()}`;
      setPreviewUrl(url);
    } catch (err) {
      console.error("Error generating preview:", err);
    }
  };

  const updateCharacter = (field, value) => {
    setCharacter((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!character.ai_name.trim()) {
        setError("Please enter a name for your companion");
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < 3) {
      setStep(step + 1);
      setError("");
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
      setError("");
    }
  };

  const handleCreate = async () => {
    if (!validateStep()) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/characters/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          identity: {
            ai_name: character.ai_name,
            gender: character.gender,
            age_range: character.age_range,
            pronouns: character.pronouns,
          },
          appearance: {
            face_shape: character.face_shape,
            skin_tone: character.skin_tone,
            eye_type: character.eye_type,
            eye_color: character.eye_color,
            eyebrow_style: character.eyebrow_style,
            hair_style: character.hair_style,
            hair_color: character.hair_color,
            height: character.height,
            build: character.build,
            outfit_vibe: character.outfit_vibe,
            has_glasses: character.has_glasses,
            glasses_style: character.glasses_style,
            has_piercings: character.has_piercings,
            piercing_count: character.piercing_count,
            has_jewelry: character.has_jewelry,
            jewelry_type: character.jewelry_type,
          },
          personality: {
            glow_color: character.glow_color,
            glow_intensity: character.glow_intensity,
            color_warmth: character.color_warmth,
            expression_tendency: character.expression_tendency,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to create character");
      }

      const data = await response.json();
      onCharacterCreated(data);
    } catch (err) {
      setError(err.message);
      console.error("Character creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -top-48 -left-48 animate-blob"></div>
        <div className="absolute w-96 h-96 bg-pink-600/20 rounded-full blur-3xl -bottom-48 -right-48 animate-blob animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <div className="grid grid-cols-2 gap-12 items-center">
          {/* Left side - Form */}
          <div>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-5xl font-display text-white mb-2">
                Create Your Companion
              </h1>
              <p className="text-purple-300 text-lg">
                Design someone real. Step {step} of 3.
              </p>
            </div>

            {/* Step indicator */}
            <div className="flex gap-2 mb-8">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    s <= step
                      ? "bg-gradient-to-r from-purple-500 to-pink-500"
                      : "bg-white/10"
                  }`}
                />
              ))}
            </div>

            {/* Form Container */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
              {/* STEP 1: IDENTITY */}
              {step === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <h2 className="text-2xl font-display text-white mb-6">
                    Identity
                  </h2>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={character.ai_name}
                      onChange={(e) => updateCharacter("ai_name", e.target.value)}
                      placeholder="What is their name?"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:bg-white/15 focus:border-purple-400 transition font-display text-lg"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Gender
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {["male", "female", "non-binary", "custom"].map((option) => (
                        <button
                          key={option}
                          onClick={() => updateCharacter("gender", option)}
                          className={`py-3 px-4 rounded-lg font-medium transition ${
                            character.gender === option
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                              : "bg-white/10 text-white/70 hover:bg-white/15"
                          }`}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Age: {character.age_range}
                    </label>
                    <input
                      type="range"
                      min="18"
                      max="50"
                      value={character.age_range}
                      onChange={(e) =>
                        updateCharacter("age_range", parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>

                  {/* Pronouns */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Pronouns
                    </label>
                    <select
                      value={character.pronouns}
                      onChange={(e) => updateCharacter("pronouns", e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:bg-white/15 focus:border-purple-400 transition"
                    >
                      <option value="they/them">they/them</option>
                      <option value="she/her">she/her</option>
                      <option value="he/him">he/him</option>
                      <option value="custom">custom</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 2: APPEARANCE */}
              {step === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <h2 className="text-2xl font-display text-white mb-6">
                    Physical Appearance
                  </h2>

                  {/* Face Shape */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Face Shape
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {["round", "sharp", "oval"].map((shape) => (
                        <button
                          key={shape}
                          onClick={() => updateCharacter("face_shape", shape)}
                          className={`py-2 px-4 rounded-lg text-sm font-medium transition ${
                            character.face_shape === shape
                              ? "bg-purple-600 text-white"
                              : "bg-white/10 text-white/70 hover:bg-white/15"
                          }`}
                        >
                          {shape.charAt(0).toUpperCase() + shape.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Skin Tone */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Skin Tone
                    </label>
                    <input
                      type="color"
                      value={character.skin_tone}
                      onChange={(e) => updateCharacter("skin_tone", e.target.value)}
                      className="w-full h-12 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Eye Type */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Eye Type
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {["sharp", "soft", "sleepy", "expressive"].map((type) => (
                        <button
                          key={type}
                          onClick={() => updateCharacter("eye_type", type)}
                          className={`py-2 px-3 rounded-lg text-xs font-medium transition ${
                            character.eye_type === type
                              ? "bg-purple-600 text-white"
                              : "bg-white/10 text-white/70 hover:bg-white/15"
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Eye Color */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Eye Color
                    </label>
                    <input
                      type="color"
                      value={character.eye_color}
                      onChange={(e) => updateCharacter("eye_color", e.target.value)}
                      className="w-full h-12 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Hair Style */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Hair Style
                    </label>
                    <select
                      value={character.hair_style}
                      onChange={(e) => updateCharacter("hair_style", e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:bg-white/15 focus:border-purple-400 transition"
                    >
                      <option value="short">Short</option>
                      <option value="medium">Medium</option>
                      <option value="long">Long</option>
                      <option value="curly">Curly</option>
                      <option value="straight">Straight</option>
                      <option value="messy">Messy</option>
                    </select>
                  </div>

                  {/* Hair Color */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Hair Color
                    </label>
                    <input
                      type="color"
                      value={character.hair_color}
                      onChange={(e) => updateCharacter("hair_color", e.target.value)}
                      className="w-full h-12 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Height */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Height: {character.height <= 30 ? "Short" : character.height <= 70 ? "Medium" : "Tall"}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={character.height}
                      onChange={(e) =>
                        updateCharacter("height", parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>

                  {/* Build */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Build
                    </label>
                    <select
                      value={character.build}
                      onChange={(e) => updateCharacter("build", e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:bg-white/15 focus:border-purple-400 transition"
                    >
                      <option value="slim">Slim</option>
                      <option value="average">Average</option>
                      <option value="athletic">Athletic</option>
                      <option value="curvy">Curvy</option>
                    </select>
                  </div>

                  {/* Outfit Vibe */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Outfit Vibe
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {["casual", "streetwear", "soft", "formal", "dark_academia"].map((vibe) => (
                        <button
                          key={vibe}
                          onClick={() => updateCharacter("outfit_vibe", vibe)}
                          className={`py-2 px-4 rounded-lg text-sm font-medium transition ${
                            character.outfit_vibe === vibe
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                              : "bg-white/10 text-white/70 hover:bg-white/15"
                          }`}
                        >
                          {vibe
                            .split("_")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ")}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Glasses */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="hasGlasses"
                      checked={character.has_glasses}
                      onChange={(e) =>
                        updateCharacter("has_glasses", e.target.checked)
                      }
                      className="w-5 h-5 rounded accent-purple-500 cursor-pointer"
                    />
                    <label
                      htmlFor="hasGlasses"
                      className="text-white font-medium cursor-pointer"
                    >
                      Glasses
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 3: PERSONALITY */}
              {step === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <h2 className="text-2xl font-display text-white mb-6">
                    Visual Personality
                  </h2>
                  <p className="text-white/70 text-sm mb-6">
                    Their appearance reflects their personality. Adjust the glows and warmth.
                  </p>

                  {/* Glow Color */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Aura Color
                    </label>
                    <input
                      type="color"
                      value={character.glow_color}
                      onChange={(e) => updateCharacter("glow_color", e.target.value)}
                      className="w-full h-12 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Glow Intensity */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Aura Intensity: {character.glow_intensity}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={character.glow_intensity}
                      onChange={(e) =>
                        updateCharacter("glow_intensity", parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <p className="text-xs text-white/50 mt-1">Faint ← → Radiant</p>
                  </div>

                  {/* Color Warmth */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Color Warmth: {character.color_warmth}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={character.color_warmth}
                      onChange={(e) =>
                        updateCharacter("color_warmth", parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <p className="text-xs text-white/50 mt-1">Cool ← → Warm</p>
                  </div>

                  {/* Expression Tendency */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Expression
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {["soft", "neutral", "intense", "playful"].map((expr) => (
                        <button
                          key={expr}
                          onClick={() =>
                            updateCharacter("expression_tendency", expr)
                          }
                          className={`py-2 px-3 rounded-lg text-xs font-medium transition ${
                            character.expression_tendency === expr
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                              : "bg-white/10 text-white/70 hover:bg-white/15"
                          }`}
                        >
                          {expr.charAt(0).toUpperCase() + expr.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              {step > 1 && (
                <button
                  onClick={handlePrevious}
                  disabled={loading}
                  className="px-8 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-semibold rounded-lg transition"
                >
                  ← Back
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="flex-1 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-semibold rounded-lg transition transform hover:scale-105"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleCreate}
                  disabled={loading}
                  className="flex-1 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-semibold rounded-lg transition transform hover:scale-105"
                >
                  {loading ? "Creating..." : "✨ Create Character!"}
                </button>
              )}
            </div>
          </div>

          {/* Right side - Live Preview */}
          <div className="flex flex-col items-center justify-center gap-8 sticky top-1/2 -translate-y-1/2">
            <div className="text-center">
              <p className="text-white/70 text-sm uppercase tracking-wide mb-4">
                Live Preview
              </p>
              <div className="relative w-80 h-80 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                {/* Glow effect based on selection */}
                <div
                  className="absolute inset-0 opacity-50 blur-3xl"
                  style={{
                    backgroundColor: character.glow_color,
                    opacity: character.glow_intensity / 200,
                  }}
                />

                {/* Avatar Image */}
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Character Preview"
                    className="w-64 h-64 object-cover object-top drop-shadow-2xl animate-pulse"
                  />
                )}
              </div>

              {/* Character Name Display */}
              <div className="mt-8 text-center">
                <h3 className="font-display text-3xl text-white">
                  {character.ai_name || "Your Companion"}
                </h3>
                <p className="text-white/70 text-sm mt-2">
                  {character.pronouns} • {character.age_range} • {character.gender}
                </p>

                {/* Personality tags */}
                {step === 3 && (
                  <div className="flex justify-center gap-2 mt-4 flex-wrap">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                      {character.expression_tendency}
                    </span>
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full">
                      {character.color_warmth > 50 ? "Warm" : "Cool"}
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                      {character.glow_intensity > 50 ? "Radiant" : "Subtle"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default CharacterCreator;
