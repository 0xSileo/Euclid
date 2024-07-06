import { FormEvent, useState } from "react";

import "./App.css";
import { getCircuitInputs } from "./utils";

function App() {
  const [sodData, setSodData] = useState<string>("");
  const [inputJSON, setInputJSON] = useState<string>();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!sodData) {
      const error = new Error("SOD Data is empty");
      console.error(error);
      alert(error.message);
      return;
    }

    const input = await getCircuitInputs(sodData);
    setInputJSON(JSON.stringify(input, null, 2));
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
      <hr />
      <textarea
        rows={15}
        placeholder="The Circuit's inputs (encoded as JSON) will be displayed here."
        value={inputJSON}
        readOnly
      ></textarea>
    </div>
  );
}

export default App;
