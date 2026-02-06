import { useState } from "react";

function getRiskLevel(score) {
  if (score <= 5) return "Low";
  if (score <= 12) return "Medium";
  if (score <= 18) return "High";
  return "Critical";
}

export default function RiskForm({ onRiskAdded }) {
  const [asset, setAsset] = useState("");
  const [threat, setThreat] = useState("");
  const [likelihood, setLikelihood] = useState(3);
  const [impact, setImpact] = useState(3);

  const score = likelihood * impact;
  const level = getRiskLevel(score);

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/assess-risk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        asset: asset.toString(),
        threat: threat.toString(),
        likelihood: Number(likelihood),
        impact: Number(impact),
      }),
    });

    if (!res.ok) {
      let msg = "Failed to add risk";
      try {
        const err = await res.json();
        msg = err.detail || msg;
      } catch {}
      alert(msg);
      return;
    }

    onRiskAdded();
  }

  return (
    <form
      className="risk-form"
      onSubmit={handleSubmit}
      style={{ border: "1px solid #ccc", padding: 16 }}
    >
      <h2>Add Risk</h2>

      <input
        placeholder="Asset"
        value={asset}
        onChange={(e) => setAsset(e.target.value)}
        required
      />
      <br />
      <br />

      <input
        placeholder="Threat"
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

      <div className="preview">
        Preview: Score = {score} | Level = {level}
      </div>
      <br />
      <br />

      <button type="submit">Add Risk</button>
    </form>
  );
}
