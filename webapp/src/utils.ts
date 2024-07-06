// Code was adapted from https://github.com/anon-aadhaar/anon-eu.

import { subtle } from "crypto";

import {
  bufferToHex,
  Uint8ArrayToCharArray,
} from "@zk-email/helpers/dist/binary-format";
import { sha256Pad } from "@zk-email/helpers/dist/sha-utils";
import pkijs, {
  SignedData,
  Certificate,
  ContentInfo,
  PublicKeyInfo,
} from "pkijs";

export async function getCircuitInputs(sodDataBase64: string) {
  const { signature, signedData, publicKey } = await getSignatureData(
    sodDataBase64
  );

  const [SODDataPadded, SODDataPaddedLen] = sha256Pad(
    new Uint8Array(signedData),
    512
  );

  const SODSignedDataPadded = Uint8ArrayToCharArray(SODDataPadded);
  const SODSignedDataPaddedLength = SODDataPaddedLen;

  const SODSignature = splitToWords(
    BigInt("0x" + bufferToHex(Buffer.from(signature)).toString()),
    BigInt(121),
    BigInt(34)
  );

  const jwk = await crypto.subtle.exportKey("jwk", publicKey);
  const dsPublicKey = splitToWords(
    BigInt("0x" + bufferToHex(Buffer.from(jwk.n as string, "base64url"))),
    BigInt(121),
    BigInt(34)
  );

  return {
    SODSignedDataPadded,
    SODSignedDataPaddedLength,
    SODSignature,
    dsPublicKey,
  };
}

async function parseSOD(sodBase64: string): Promise<pkijs.SignedData> {
  const sodBuffer = Buffer.from(sodBase64, "base64").slice(4);
  const contentInfo = ContentInfo.fromBER(sodBuffer);
  const signedData = new SignedData({ schema: contentInfo.content });

  return signedData;
}

const getSignatureData = async (
  sodData: string
): Promise<{
  signature: Uint8Array;
  signedData: ArrayBuffer;
  publicKey: any; // CryptoKey
  eContentInfoBytes: Uint8Array;
}> => {
  const signedData = await parseSOD(sodData);

  if (!signedData.certificates) throw Error("Missing cert in signedData");
  const signerCert = signedData.certificates[0];

  let publicKey;
  if (signerCert instanceof Certificate) {
    publicKey = await getPublicKeyFromSignedData(
      signerCert.subjectPublicKeyInfo
    );
  }

  if (!signedData.signerInfos[0].signedAttrs?.attributes)
    throw Error("Signed data has no attributes object!");

  if (!signedData.encapContentInfo.eContent)
    throw Error("Signed data has no eContent object!");

  const signedDataBuffer = signedData.signerInfos[0].signedAttrs.encodedValue;

  const signatureValue =
    signedData.signerInfos[0].signature.valueBlock.valueHexView;

  const eContentInfoBytes = new Uint8Array(
    signedData.encapContentInfo.eContent.getValue()
  );

  return {
    signature: signatureValue,
    signedData: signedDataBuffer,
    publicKey,
    eContentInfoBytes,
  };
};

function getPublicKeyFromSignedData(
  publicKeyInfo: PublicKeyInfo
): Promise<any /* CryptoKey */> {
  const publicKeyInfoBuffer = publicKeyInfo.toSchema().toBER(false);

  return subtle.importKey(
    "spki",
    publicKeyInfoBuffer,
    { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } },
    true,
    ["verify"]
  );
}

function splitToWords(number: bigint, wordsize: bigint, numberElement: bigint) {
  let t = number;
  const words: string[] = [];
  for (let i = BigInt(0); i < numberElement; ++i) {
    const baseTwo = BigInt(2);

    words.push(`${t % BigInt(Math.pow(Number(baseTwo), Number(wordsize)))}`);
    t = BigInt(t / BigInt(Math.pow(Number(BigInt(2)), Number(wordsize))));
  }
  if (!(t == BigInt(0))) {
    throw `Number ${number} does not fit in ${(
      wordsize * numberElement
    ).toString()} bits`;
  }
  return words;
}
