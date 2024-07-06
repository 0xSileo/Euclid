pragma circom 2.1.9;

include "@zk-email/circuits/lib/rsa.circom";
include "@zk-email/circuits/lib/sha.circom";

template EUVerifier(sod_n, sod_k, sodMaxDataLength) {
    // Document data signed by the DS public key
    signal input dsPublicKey[sod_k];
    signal input SODSignedDataPadded[sodMaxDataLength];
    signal input SODSignedDataPaddedLength;
    // SOD signature
    signal input SODSignature[sod_k];

    // Verify the signature of the document
    // Hash SOD content
    signal sodSha[256] <== Sha256Bytes(sodMaxDataLength)(SODSignedDataPadded, SODSignedDataPaddedLength);

    // Verify RSA signature of the SOD
    component sodRsa = RSAVerifier65537(sod_n, sod_k);
    var sodRsaMsgLength = (256 + sod_n) \ sod_n;
    component sodRsaBaseMsg[sodRsaMsgLength];
    for (var i = 0; i < sodRsaMsgLength; i++) {
        sodRsaBaseMsg[i] = Bits2Num(sod_n);
    }
    for (var i = 0; i < 256; i++) {
        sodRsaBaseMsg[i \ sod_n].in[i % sod_n] <== sodSha[255 - i];
    }
    for (var i = 256; i < sod_n * sodRsaMsgLength; i++) {
        sodRsaBaseMsg[i \ sod_n].in[i % sod_n] <== 0;
    }
    for (var i = 0; i < sodRsaMsgLength; i++) {
        sodRsa.message[i] <== sodRsaBaseMsg[i].out;
    }
    for (var i = sodRsaMsgLength; i < sod_k; i++) {
        sodRsa.message[i] <== 0;
    }

    sodRsa.modulus <== dsPublicKey;
    sodRsa.signature <== SODSignature;
}

component main { public [dsPublicKey] } = EUVerifier(121, 17, 512);
