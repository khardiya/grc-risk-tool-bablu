import { useState } from "react";
import RiskForm from "./components/RiskForm"
import Dashboard from "./components/Dashboard";

export default function App() {
  console.log("API URL:", import.meta.env.VITE_API_URL);

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
