import { useEffect, useState } from "react";

import { CircuitInputs, getCircuitInputs } from "./utils";

const SOD_BASE64_QUERY_PARAM_KEY = "sod-base64";

function App() {
  const [inputs, setInputs] = useState<CircuitInputs>();
  const [sodData, setSodData] = useState<string | undefined>();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const result = urlParams.get(SOD_BASE64_QUERY_PARAM_KEY);
    if (result) {
      setSodData(result);
    }
  }, []);

  useEffect(() => {
    if (sodData) {
      (async () => {
        const inputs = await getCircuitInputs(sodData);
        setInputs(inputs);
      })();
    }
  }, [sodData]);

  return (
    <>
      <>{sodData && <p>{sodData}</p>}</>
      <>{inputs && <p>{JSON.stringify(inputs, null, 2)}</p>}</>
    </>
  );
}

export default App;
