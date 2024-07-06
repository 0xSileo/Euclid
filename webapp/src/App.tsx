import { FormEvent, useState } from "react";

import "./App.css";
import { getCircuitInputs } from "./utils";

function App() {
  const [sodData, setSodData] = useState<string>("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!sodData) {
      const error = new Error("SOD Data is empty");
      console.error(error);
      alert(error.message);
      return;
    }

    const input = await getCircuitInputs(sodData);
    navigator.clipboard.writeText(JSON.stringify(input));
  }

  return (
    <div>
      <h1>Circuit Inputs Generator</h1>
      <hr />
      <form onSubmit={handleSubmit}>
        <label htmlFor="sod-data">SOD Data</label>
        <input
          id="sod-data"
          type="password"
          placeholder="SOD Data (in Base64)"
          value={sodData}
          onChange={(e) => setSodData(e.target.value)}
        />
        <button type="submit">Get Circuit Inputs</button>
      </form>
    </div>
  );
}

export default App;
