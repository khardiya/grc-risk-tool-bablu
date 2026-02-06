export default function RiskHeatmap({ risks }) {
  // Build 5x5 matrix
  const matrix = Array.from({ length: 5 }, () =>
    Array.from({ length: 5 }, () => [])
  );

  // Fill matrix
  risks.forEach((risk) => {
    const l = risk.likelihood - 1; // 0–4
    const i = risk.impact - 1;     // 0–4
    matrix[l][i].push(risk);
  });

  function getCellColor(likelihood, impact) {
    const score = likelihood * impact;

    if (score <= 5) return "#9be7a2";       // green
    if (score <= 12) return "#ffe58f";      // yellow
    if (score <= 18) return "#ffb366";      // orange
    return "#ff7a7a";                       // red
  }

  return (
    <div style={{ marginTop: 40 }}>
      <h3>Risk Heatmap (Likelihood × Impact)</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "60px repeat(5, 1fr)",
          gap: 2,
          maxWidth: 600,
        }}
      >
        {/* Top-left empty cell */}
        <div></div>

        {/* Impact labels */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{ textAlign: "center", fontWeight: "bold" }}
          >
            Impact {i}
          </div>
        ))}

        {/* Likelihood rows (5 → 1) */}
        {[5, 4, 3, 2, 1].map((likelihood) => (
          <>
            <div
              key={`label-${likelihood}`}
              style={{ fontWeight: "bold" }}
            >
              L {likelihood}
            </div>

            {[1, 2, 3, 4, 5].map((impact) => {
              const risksInCell =
                matrix[likelihood - 1][impact - 1];

              return (
                <div
                  key={`${likelihood}-${impact}`}
                  title={
                    risksInCell.length
                      ? risksInCell
                          .map((r) => r.asset)
                          .join(", ")
                      : "No risks"
                  }
                  style={{
                    background: getCellColor(likelihood, impact),
                    border: "1px solid #999",
                    height: 60,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "default",
                    fontWeight: "bold",
                  }}
                >
                  {risksInCell.length}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}
