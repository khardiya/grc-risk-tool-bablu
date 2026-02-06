import { useEffect, useState } from "react";

export default function Dashboard({ reloadFlag }) {
  const [risks, setRisks] = useState([]);

  useEffect(() => {
    fetch("/api/risks")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRisks(data);
        } else {
          setRisks([]);
        }
      })
      .catch(() => setRisks([]));
  }, [reloadFlag]);

  function exportCSV() {
    if (!risks.length) {
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
    ];

    const rows = risks.map((r) => [
      r.id,
      r.asset,
      r.threat,
      r.likelihood,
      r.impact,
      r.score,
      r.level,
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "risk-register.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Risks</h2>
      <button onClick={exportCSV}>Export CSV</button>

      {risks.length === 0 ? (
        <p>No risks yet</p>
      ) : (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>ID</th>
              <th>Asset</th>
              <th>Threat</th>
              <th>Likelihood</th>
              <th>Impact</th>
              <th>Score</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody>
            {risks.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.asset}</td>
                <td>{r.threat}</td>
                <td>{r.likelihood}</td>
                <td>{r.impact}</td>
                <td>{r.score}</td>
                <td className={`level-${r.level}`}>{r.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
