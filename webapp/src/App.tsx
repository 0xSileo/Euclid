import { FormEvent, useEffect, useState } from "react";

import "./App.css";
import { CircuitInputs, getCircuitInputs } from "./utils";

function App() {
  const [inputs, setInputs] = useState<CircuitInputs>();
  const [sodData, setSodData] = useState<string | undefined>();

  useEffect(() => {
    if (sodData) {
      (async () => {})();
    }
  }, [sodData]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!sodData) {
      throw new Error("SOD Data is empty");
    }

    const inputs = await getCircuitInputs(sodData);
    setInputs(inputs);
  }

  return (
    <div>
      <>{sodData && <p>{sodData}</p>}</>
      <>{inputs && <p>{JSON.stringify(inputs, null, 2)}</p>}</>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="SOD Data (in Base64)"
          value={sodData}
          onChange={(e) => setSodData(e.target.value)}
        />
        <button type="submit">Generate Circuit Inputs</button>
      </form>
    </div>
  );
}

export default App;
