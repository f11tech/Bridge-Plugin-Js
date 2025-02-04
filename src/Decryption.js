const forge = require('node-forge');

export function decryptData(encryptedData) {
    try {
        // Retrieve the private key from localStorage
        const privateKeyPem = localStorage.getItem("privateKey");
        if (!privateKeyPem) {
            throw new Error("Private key not found in localStorage");
        }

        // Convert the PEM-encoded private key to a forge private key object
        const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

        // Convert the encrypted data from base64 to binary
        const encryptedBytes = forge.util.decode64(encryptedData);

        // Decrypt the data using RSA-OAEP
        const decryptedBytes = privateKey.decrypt(encryptedBytes, 'RSA-OAEP');

        // Convert the decrypted bytes back to a string
        const decryptedData = forge.util.decodeUtf8(decryptedBytes);

        return decryptedData;
    } catch (error) {
        throw new Error("Failed to decrypt data: " + error.message);
    }
}
