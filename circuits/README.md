# Circuits

## Useful Commands

### Main

```sh
# Download Powers of Tau file
#   See: https://github.com/iden3/snarkjs?tab=readme-ov-file#7-prepare-phase-2
curl -O https://storage.googleapis.com/zkevm/ptau/powersOfTau28_hez_final_19.ptau

# ... OR ...

# Run Powers of Tau (has to be done once (NOT per circuit))
npx snarkjs powersoftau new bn128 19 pot19_0000.ptau -v
npx snarkjs powersoftau contribute pot19_0000.ptau pot19_0001.ptau --name="First contribution" -v

# Generate proof with snarkjs (Run from with in the specific circuit directory)
npx snarkjs groth16 prove eu-verifier_0001.zkey witness.wtns proof.json public.json

# Verify proof with snarkjs (Run from with in the specific circuit directory)
npx snarkjs groth16 verify verification_key.json public.json proof.json
```

### Circuit Specific

```sh
# All commands listed here should be run from within the circuit's directory (e.g. from withing `circuits/eu-verifier`)

# Compile circuit
circom eu-verifier.circom --r1cs --wasm -l ../node_modules

# Copy WebAssembly file
cp eu-verifier_js/eu-verifier.wasm ./circuit.wasm

# Powers of Tau (has to be done once per circuit)
npx snarkjs powersoftau prepare phase2 ../powersOfTau28_hez_final_19.ptau pot_final.ptau -v
npx snarkjs groth16 setup eu-verifier.r1cs pot_final.ptau eu-verifier_0000.zkey
npx snarkjs zkey contribute eu-verifier_0000.zkey eu-verifier_0001.zkey --name="1st Contributor Name" -v
npx snarkjs zkey export verificationkey eu-verifier_0001.zkey verification_key.json

# Copy .zkey file
cp eu-verifier_0001.zkey ../../android/app/src/main/assets/

# Compute witness with WebAssembly
node eu-verifier_js/generate_witness.js eu-verifier_js/eu-verifier.wasm input.json witness.wtns
```

## Useful Resources

- [Circom 2 Documentation - Getting Started](https://docs.circom.io/getting-started/installation/)
