import path from "path";
// @ts-expect-error circom_tester doesn't ship with type declarations.
import circom_tester from "circom_tester/wasm/tester";

import { getCircuitInputs } from "../utils.ts";

// TODO: Replace with the base64 encoded SOD Data.
const SOD_DATA = "Base64EncodedSODData";

async function main() {
  const circuit = await getCircuit("eu-verifier");

  const inputs = await getCircuitInputs(SOD_DATA);

  console.log("--- Running test with the following inputs ---\n", inputs);

  const witness = await circuit.calculateWitness(inputs);
  await circuit.checkConstraints(witness);

  console.log("--- ✅ Test Successfull ---");
}

export async function getCircuit(name: string) {
  const pathToCircuit = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "circuits",
    `${name}.circom`
  );
  const circuitBuildDirectory = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "circuits",
    `${name}`
  );

  const circuit = await circom_tester(pathToCircuit, {
    recompile: false,
    output: circuitBuildDirectory,
  });

  return circuit;
}

main();
