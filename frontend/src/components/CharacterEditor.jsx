import React, { useState, useEffect } from "react";
import useStore from "../store/useStore";

const CharacterEditor = ({ character, isOpen, onClose, onUpdate }) => {
  const authToken = useStore((state) => state.authToken);
  const userId = useStore((state) => state.userId);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const [editedCharacter, setEditedCharacter] = useState(character || {});

  useEffect(() => {
    if (character) {
      setEditedCharacter(character);
    }
  }, [character, isOpen]);

  useEffect(() => {
    generatePreview();
  }, [editedCharacter]);

  const generatePreview = async () => {
    try {
      const params = new URLSearchParams({
        seed: (editedCharacter.ai_name || "character").replace(/\s+/g, "-"),
        style: "avataaars",
        scale: 100,
        radius: 0,
        backgroundColor: "transparent",
      });

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

      if (hairMap[editedCharacter.hair_style]) {
        params.set("topType", hairMap[editedCharacter.hair_style]);
      }

      if (eyeTypeMap[editedCharacter.eye_type]) {
        params.set("eyeType", eyeTypeMap[editedCharacter.eye_type]);
      }

      if (outfitMap[editedCharacter.outfit_vibe]) {
        params.set("clotheType", outfitMap[editedCharacter.outfit_vibe]);
      }

      if (editedCharacter.has_glasses) {
        params.set("accessoriesType", "Prescription01");
      }

      const url = `https://api.dicebear.com/7.x/avataaars/svg?${params.toString()}`;
      setPreviewUrl(url);
    } catch (err) {
      console.error("Error generating preview:", err);
    }
  };

  const updateCharacter = (field, value) => {
    setEditedCharacter((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8000/characters/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            identity: {
              ai_name: editedCharacter.ai_name,
              gender: editedCharacter.gender,
              age_range: editedCharacter.age_range,
              pronouns: editedCharacter.pronouns,
            },
            appearance: {
              face_shape: editedCharacter.face_shape,
              skin_tone: editedCharacter.skin_tone,
              eye_type: editedCharacter.eye_type,
              eye_color: editedCharacter.eye_color,
              eyebrow_style: editedCharacter.eyebrow_style || "natural",
              hair_style: editedCharacter.hair_style,
              hair_color: editedCharacter.hair_color,
              height: editedCharacter.height,
              build: editedCharacter.build,
              outfit_vibe: editedCharacter.outfit_vibe,
              has_glasses: editedCharacter.has_glasses || false,
              glasses_style: editedCharacter.glasses_style || "Prescription01",
              has_piercings: editedCharacter.has_piercings || false,
              piercing_count: editedCharacter.piercing_count || 0,
              has_jewelry: editedCharacter.has_jewelry || false,
              jewelry_type: editedCharacter.jewelry_type || "",
            },
            personality: {
              glow_color: editedCharacter.glow_color,
              glow_intensity: editedCharacter.glow_intensity,
              color_warmth: editedCharacter.color_warmth,
              expression_tendency: editedCharacter.expression_tendency,
            },
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to update character");
      }

      const data = await response.json();
      onUpdate(data);
      onClose();
    } catch (err) {
      setError(err.message);
      console.error("Character update error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-white/20 rounded-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-black/40 backdrop-blur-sm border-b border-white/10 p-6 flex justify-between items-center">
          <div>
            <h2 className="font-display text-2xl text-white">Edit Character</h2>
            <p className="text-white/70 text-sm mt-1">
              Update {editedCharacter.ai_name}'s appearance and personality
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl font-light transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-3 gap-8">
            {/* Form - Left side (2 columns) */}
            <div className="col-span-2 space-y-8">
              {/* IDENTITY SECTION */}
              <div>
                <h3 className="font-display text-xl text-white mb-4">Identity</h3>
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editedCharacter.ai_name || ""}
                      onChange={(e) =>
                        updateCharacter("ai_name", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:bg-white/15 focus:border-purple-400 transition"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Gender
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {["male", "female", "non-binary", "custom"].map((g) => (
                        <button
                          key={g}
                          onClick={() => updateCharacter("gender", g)}
                          className={`py-2 px-3 rounded-lg text-xs font-medium transition ${
                            editedCharacter.gender === g
                              ? "bg-purple-600 text-white"
                              : "bg-white/10 text-white/70 hover:bg-white/15"
                          }`}
                        >
                          {g === "non-binary" ? "NB" : g.slice(0, 3).toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Age: {editedCharacter.age_range || 25}
                    </label>
                    <input
                      type="range"
                      min="18"
                      max="50"
                      value={editedCharacter.age_range || 25}
                      onChange={(e) =>
                        updateCharacter("age_range", parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* APPEARANCE SECTION */}
              <div>
                <h3 className="font-display text-xl text-white mb-4">Appearance</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Hair Style */}
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-2">
                      Hair Style
                    </label>
                    <select
                      value={editedCharacter.hair_style || "long"}
                      onChange={(e) =>
                        updateCharacter("hair_style", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:bg-white/15"
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
                    <label className="block text-xs font-medium text-white/70 mb-2">
                      Hair Color
                    </label>
                    <input
                      type="color"
                      value={editedCharacter.hair_color || "#2c2416"}
                      onChange={(e) =>
                        updateCharacter("hair_color", e.target.value)
                      }
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Eye Type */}
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-2">
                      Eye Type
                    </label>
                    <select
                      value={editedCharacter.eye_type || "soft"}
                      onChange={(e) =>
                        updateCharacter("eye_type", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:bg-white/15"
                    >
                      <option value="sharp">Sharp</option>
                      <option value="soft">Soft</option>
                      <option value="sleepy">Sleepy</option>
                      <option value="expressive">Expressive</option>
                    </select>
                  </div>

                  {/* Eye Color */}
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-2">
                      Eye Color
                    </label>
                    <input
                      type="color"
                      value={editedCharacter.eye_color || "#8b7355"}
                      onChange={(e) =>
                        updateCharacter("eye_color", e.target.value)
                      }
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Outfit Vibe */}
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-white/70 mb-2">
                      Outfit Vibe
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {["casual", "streetwear", "soft", "formal", "dark_academia"].map((vibe) => (
                        <button
                          key={vibe}
                          onClick={() =>
                            updateCharacter("outfit_vibe", vibe)
                          }
                          className={`py-2 px-2 rounded-lg text-xs font-medium transition ${
                            editedCharacter.outfit_vibe === vibe
                              ? "bg-purple-600 text-white"
                              : "bg-white/10 text-white/70 hover:bg-white/15"
                          }`}
                        >
                          {vibe.replace("_", " ").slice(0, 8)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* PERSONALITY SECTION */}
              <div>
                <h3 className="font-display text-xl text-white mb-4">
                  Visual Personality
                </h3>
                <div className="space-y-4">
                  {/* Glow Color */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Aura Color
                    </label>
                    <input
                      type="color"
                      value={editedCharacter.glow_color || "#a855f7"}
                      onChange={(e) =>
                        updateCharacter("glow_color", e.target.value)
                      }
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Glow Intensity */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Aura Intensity: {editedCharacter.glow_intensity || 70}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={editedCharacter.glow_intensity || 70}
                      onChange={(e) =>
                        updateCharacter("glow_intensity", parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>

                  {/* Color Warmth */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Color Warmth: {editedCharacter.color_warmth || 50}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={editedCharacter.color_warmth || 50}
                      onChange={(e) =>
                        updateCharacter("color_warmth", parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>

                  {/* Expression */}
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-2">
                      Expression
                    </label>
                    <select
                      value={editedCharacter.expression_tendency || "neutral"}
                      onChange={(e) =>
                        updateCharacter("expression_tendency", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:bg-white/15"
                    >
                      <option value="soft">Soft</option>
                      <option value="neutral">Neutral</option>
                      <option value="intense">Intense</option>
                      <option value="playful">Playful</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Preview - Right side */}
            <div className="flex flex-col items-center justify-center gap-4 bg-white/5 rounded-xl p-6 h-fit sticky top-32">
              <p className="text-white/70 text-xs uppercase tracking-wide">
                Preview
              </p>
              <div className="relative w-40 h-40 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/20 flex items-center justify-center overflow-hidden">
                <div
                  className="absolute inset-0 opacity-50 blur-2xl"
                  style={{
                    backgroundColor: editedCharacter.glow_color,
                    opacity: (editedCharacter.glow_intensity || 70) / 200,
                  }}
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Character Preview"
                    className="w-32 h-32 object-cover object-top drop-shadow-lg"
                  />
                )}
              </div>
              <div className="text-center">
                <h4 className="font-display text-lg text-white">
                  {editedCharacter.ai_name}
                </h4>
                <p className="text-white/50 text-xs mt-1">
                  {editedCharacter.age_range || 25} • {editedCharacter.gender}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-black/40 backdrop-blur-sm border-t border-white/10 p-6 flex gap-4 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-semibold rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-semibold rounded-lg transition transform hover:scale-105"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterEditor;
