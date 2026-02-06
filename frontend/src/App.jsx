import { useState } from "react";
import RiskForm from "./RiskForm";
import Dashboard from "./Dashboard";

export default function App() {
  const [reloadFlag, setReloadFlag] = useState(0);

  function handleRiskAdded() {
    setReloadFlag((prev) => prev + 1);
  }

  return (
    <div style={{ padding: 20 }} className="container">
      <h1>GRC Risk Assessment Dashboard</h1>
      <RiskForm onRiskAdded={handleRiskAdded} />
      <Dashboard reloadFlag={reloadFlag} />
    </div>
  );
}
