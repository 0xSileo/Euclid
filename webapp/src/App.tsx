import { FormEvent, useState } from "react";

import "./App.css";
import { getCircuitInputs } from "./utils";

const WASM_URL =
  "https://ipfs.io/ipfs/QmWbP4eBja76m7L3w5JH9v6vGp8wGepf8vRNJNvY8RWnvc";
const ZKEY_URL =
  "https://ipfs.io/ipfs/QmYdSnjcEcJ1K3vnQnjrwRmau6tmTTzTJAzsgsAqfvWvyH";
const VKEY_URL =
  "https://ipfs.io/ipfs/QmaLMMTvUPhmxnxbKmoTSqpRNrsWYdNUNEaQe7Yv1jP3qB";

function App() {
  const [proof, setProof] = useState();
  const [zkey, setZkey] = useState<Uint8Array>();
  const [sodData, setSodData] = useState<string>("");
  const [inputJSON, setInputJSON] = useState<string>();
  const [publicSignals, setPublicSignals] = useState();
  const [isProving, setIsProving] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false);
  const [isDownloadingZkeyFile, setIsDownloadingZkeyFile] =
    useState<boolean>(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!sodData) {
      const error = new Error("SOD Data is empty");
      console.error(error);
      alert(error.message);
      return;
    }

    const input = await getCircuitInputs(sodData);
    const json = JSON.stringify(input);

    setInputJSON(json);
    navigator.clipboard.writeText(json);
    setCopiedToClipboard(true);
  }

  async function downloadZkeyFile() {
    setIsDownloadingZkeyFile(true);

    const zkeyFetch = await fetch(ZKEY_URL);
    const zkeyBuffer = await zkeyFetch.arrayBuffer();
    const zkey = new Uint8Array(zkeyBuffer);
    setZkey(zkey);

    setIsDownloadingZkeyFile(false);
  }

  async function generateProof() {
    if (!inputJSON) {
      const error = new Error("Circuit inputs empty");
      console.error(error);
      alert(error.message);
      return;
    }

    setIsProving(true);

    const wasmFetch = await fetch(WASM_URL);
    const wasmBuffer = await wasmFetch.arrayBuffer();
    const wasm = new Uint8Array(wasmBuffer);

    // @ts-expect-error snarkjs is hosted as a static asset
    const { proof, publicSignals } = await window.snarkjs.groth16.fullProve(
      JSON.parse(inputJSON),
      wasm,
      zkey
    );

    setProof(proof);
    setPublicSignals(publicSignals);

    setIsProving(false);
  }

  async function verifyProof() {
    if (!(proof || publicSignals)) {
      const error = new Error("Proof not generated");
      console.error(error);
      alert(error.message);
      return;
    }

    setIsVerifying(true);

    const zkeyFetch = await fetch(VKEY_URL);
    const vkey = await zkeyFetch.json();

    // @ts-expect-error snarkjs is hosted as a static asset
    const res = await window.snarkjs.groth16.verify(vkey, publicSignals, proof);

    alert(`Proof Verification Result: ${res}`);
    setIsVerifying(false);
  }

  return (
    <div>
      <h1>zk-Proofs for European ID Cards</h1>
      <hr />
      {copiedToClipboard && <p>Circuit input copied to clipboard</p>}
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
      {zkey && <p>.zkey file successfully downloaded</p>}
      <button
        type="button"
        onClick={downloadZkeyFile}
        disabled={isDownloadingZkeyFile}
      >
        Download .zkey File
      </button>
      <hr />
      {proof && publicSignals && <p>Proof successfully generated</p>}
      <button
        type="button"
        onClick={generateProof}
        disabled={!inputJSON || !zkey || isProving}
      >
        Generate Proof
      </button>
      <hr />
      <button
        type="button"
        onClick={verifyProof}
        disabled={!(proof && publicSignals) || isVerifying}
      >
        Verify Proof
      </button>
    </div>
  );
}

export default App;
