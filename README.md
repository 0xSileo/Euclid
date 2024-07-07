# Euclid

Zk-snarkification of EU ID data. The goal is for European citizens holding a new EU ID card to anonymously prove part of their identity through selective disclosure and zero-knowledge proofs. For that, there are a few parts that need to be implemented. In this repository, we'll provide the code for the _proving_ part of the process. The verification can be done in different programming languages or environments.

## Inner workings

### 1. Retrieval of MRZ and SOD

Plenty of data is stored on the chips of modern cards. There is the machine-readable zone (MRZ) and the security object (SOD) holding the signature metadata (when it was signed, what the public key is etc.).

![Machine-readable zone of a US passport](https://upload.wikimedia.org/wikipedia/commons/7/7e/Mrp_image.gif)

One of the easiest (wrt UX) ways to retrieve it is by making use of the card's NFC antenna, which can be read by most smartphones.

### Proof generation

A Circom circuit is written and, depending on its inputs, will generate the necessary files for proving parts of the data. This will be done on the smartphone as well, for ease-of-use, as well as to avoid introducing any security issue regarding the transmission of sensitive data (MRZ).

## Compiling the apps

After cloning the repository, go to the circuit's directory and follow the steps in the [circuits/README.md](./circuits/README.md) file.

At the end you should have a `eu-verifier_****.zkey`, as well as a `circuit.wasm` file in the [`circuits/eu-verifier`](./circuits/eu-verifier) directory.

You need to copy the `.zkey` file to the [`android/app/src/main/assets`](./android/app/src/main/assets) directory. Also double-check that the `.zkey` file as well as the `circuit.wasm` file is still in the [`circuits/eu-verifier`](./circuits/eu-verifier) directory.

**Aside:** If you want to run your own trusted setup ceremony you should check out the `circuits/README.md` file.

Once that's done, go to the project's root directory and then run `cargo run --bin android`. This command will generate the necessary bindings for the android app. After this you can build in Android Studio without needing to run a `cargo` command again. Open the contents of `ios` or `android` to build the apps.

To build a release binary use the following commands (run this in the repos root directory):

```
CONFIGURATION=release cargo run --bin android
```

## Running the Webapp

As an alternative to the native mobile proving we also created a webapp that allows for proof generation and verification via `snarkjs`. You can follow the steps in the [`webapp/README.md`](/webapp/README.md) file to spin up a local version.
