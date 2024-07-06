# Webapp

The webapp our native app embeds as a web view.

The webapp receives the base64 encoded SOD data and translates it into a format such that it can be passed in our circom circuit for proof generation and verification.

## Setup

1. `npm install`
2. Make sure that the [`eu-verifier` circuit](../circuits/eu-verifier) was compiled (see the README.md file in the [circuits](../circuits) directory).

## Test

1. Open the [sod-data-test.ts](./src/scripts/sod-data-test.ts) file and update the `SOD_DATA` variable
1. `npm run test:sod-data`
