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

Clone this repo then run either `cargo run --bin ios` or `cargo run --bin android`. This command will build either an `xcframework` or a `jniLibs` folder containing libraries for the device and simulator. After this you can build in xcode/android studio without needing to run a cargo command again. Open the contents of `ios` or `android` to build the apps.

To build a release binary use the following commands:

```
# CONFIGURATION is either debug or release
CONFIGURATION=release cargo run --bin ios
CONFIGURATION=release cargo run --bin android
```