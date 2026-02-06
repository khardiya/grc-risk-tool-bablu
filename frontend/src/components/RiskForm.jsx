import { useState } from "react";

function calculateRisk(likelihood, impact) {
  const score = likelihood * impact;

  if (score <= 5) {
    return {
      score,
      level: "Low",
      hint: "Accept / monitor",
    };
  }

  if (score <= 12) {
    return {
      score,
      level: "Medium",
      hint: "Plan mitigation within 6 months",
    };
  }

  if (score <= 18) {
    return {
      score,
      level: "High",
      hint: "Prioritize action + compensating controls (NIST PR.AC)",
    };
  }

  return {
    score,
    level: "Critical",
    hint: "Immediate mitigation required + executive reporting",
  };
}

export default function RiskForm({ onRiskAdded }) {
  const [asset, setAsset] = useState("");
  const [threat, setThreat] = useState("");
  const [likelihood, setLikelihood] = useState(3);
  const [impact, setImpact] = useState(3);
  const [loading, setLoading] = useState(false);

  const { score, level, hint } = calculateRisk(likelihood, impact);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!asset.trim() || !threat.trim()) {
      alert("Asset and Threat are required");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/assess-risk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        asset: asset.trim(),
        threat: threat.trim(),
        likelihood,
        impact,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      let msg = "Failed to add risk";
      try {
        const err = await res.json();
        msg = err.detail || msg;
      } catch {}
      alert(msg);
      return;
    }

    // Reset form (UX polish)
    setAsset("");
    setThreat("");
    setLikelihood(3);
    setImpact(3);

    onRiskAdded();
  }

  return (
    <form
      className="risk-form"
      onSubmit={handleSubmit}
      style={{
        border: "1px solid #ccc",
        padding: 16,
        marginBottom: 24,
      }}
    >
      <h2>Add Risk</h2>

      <input
        placeholder="Asset (e.g. Customer Database)"
        value={asset}
        onChange={(e) => setAsset(e.target.value)}
        required
      />
      <br />
      <br />

      <input
        placeholder="Threat (e.g. Unauthorized Access)"
        value={threat}
        onChange={(e) => setThreat(e.target.value)}
        required
      />
      <br />
      <br />

      <label>Likelihood: {likelihood}</label>
      <input
        type="range"
        min="1"
        max="5"
        value={likelihood}
        onChange={(e) => setLikelihood(Number(e.target.value))}
      />
      <br />

      <label>Impact: {impact}</label>
      <input
        type="range"
        min="1"
        max="5"
        value={impact}
        onChange={(e) => setImpact(Number(e.target.value))}
      />
      <br />
      <br />

      <div
        className="preview"
        style={{
          padding: 10,
          background: "#f9f9f9",
          borderRadius: 4,
        }}
      >
        <strong>Preview</strong>
        <div>Score: {score}</div>
        <div>Level: {level}</div>
        <div style={{ fontSize: 13, color: "#555" }}>Mitigation: {hint}</div>
      </div>

      <br />

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Risk"}
      </button>
    </form>
  );
}
