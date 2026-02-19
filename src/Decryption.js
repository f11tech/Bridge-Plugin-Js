const forge = require('node-forge');

export function decryptData(encryptedData, privateKeyPem) {
    try {
        if (!privateKeyPem) {
            throw new Error("Private key is required for decryption");
        }

        const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
        const encryptedBytes = forge.util.decode64(encryptedData);
        const decryptedBytes = privateKey.decrypt(encryptedBytes, 'RSA-OAEP');
        return forge.util.decodeUtf8(decryptedBytes);
    } catch (error) {
        throw new Error("Failed to decrypt data: " + error.message);
    }
}
