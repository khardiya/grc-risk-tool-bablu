import { useEffect, useMemo, useState } from "react";
import RiskHeatmap from "./RiskHeatmap";
import API_BASE from "../api";

export default function Dashboard({ reloadFlag }) {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterLevel, setFilterLevel] = useState("All");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/risks`)
      .then((res) => res.json())
      .then((data) => {
        setRisks(Array.isArray(data) ? data : []);
      })
      .catch(() => setRisks([]))
      .finally(() => setLoading(false));
  }, [reloadFlag]);

  // ---------- FILTER + SORT ----------
  const visibleRisks = useMemo(() => {
    let data = [...risks];

    if (filterLevel !== "All") {
      data = data.filter((r) => r.level === filterLevel);
    }

    data.sort((a, b) => (sortAsc ? a.score - b.score : b.score - a.score));

    return data;
  }, [risks, filterLevel, sortAsc]);

  // ---------- STATS ----------
  const totalRisks = risks.length;
  const highCriticalCount = risks.filter(
    (r) => r.level === "High" || r.level === "Critical",
  ).length;

  const avgScore =
    totalRisks === 0
      ? 0
      : (risks.reduce((sum, r) => sum + r.score, 0) / totalRisks).toFixed(1);

  // ---------- CSV EXPORT ----------
  function exportCSV() {
    if (!visibleRisks.length) {
      alert("No data to export");
      return;
    }

    const headers = [
      "ID",
      "Asset",
      "Threat",
      "Likelihood",
      "Impact",
      "Score",
      "Level",
      "Mitigation Hint",
    ];

    const rows = visibleRisks.map((r) => [
      r.id,
      r.asset,
      r.threat,
      r.likelihood,
      r.impact,
      r.score,
      r.level,
      r.hint,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "risk-register.csv";
    a.click();

    URL.revokeObjectURL(url);
  }

  // ---------- RENDER ----------
  return (
    <div style={{ marginTop: 30 }}>
      <h2>Risk Dashboard</h2>

      {/* STATS */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        <div>
          <strong>Total Risks:</strong> {totalRisks}
        </div>
        <div>
          <strong>High / Critical:</strong> {highCriticalCount}
        </div>
        <div>
          <strong>Average Score:</strong> {avgScore}
        </div>
      </div>

      {/* CONTROLS */}
      <div style={{ marginBottom: 12 }}>
        <label>
          Filter by Level:{" "}
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option>All</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </label>

        <button style={{ marginLeft: 10 }} onClick={() => setSortAsc(!sortAsc)}>
          Sort by Score {sortAsc ? "↑" : "↓"}
        </button>

        <button style={{ marginLeft: 10 }} onClick={exportCSV}>
          Export CSV
        </button>
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading risks...</p>
      ) : visibleRisks.length === 0 ? (
        <p>No risks found</p>
      ) : (
        <table border="1" cellPadding="6" width="100%">
          <thead>
            <tr>
              <th>ID</th>
              <th>Asset</th>
              <th>Threat</th>
              <th>Likelihood</th>
              <th>Impact</th>
              <th>Score</th>
              <th>Level</th>
              <th>Mitigation Hint</th>
            </tr>
          </thead>
          <tbody>
            {visibleRisks.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.asset}</td>
                <td>{r.threat}</td>
                <td>{r.likelihood}</td>
                <td>{r.impact}</td>
                <td>{r.score}</td>
                <td>{r.level}</td>
                <td>{r.hint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <RiskHeatmap risks={risks} />
    </div>
  );
}
