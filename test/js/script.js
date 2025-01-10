const bridge = new Bridge(51510);

// Automatically connect to the WebSocket server on page load
window.onload = () => {
    bridge.connect();
    console.log('WebSocket connection initialized.');

    // Wait for the WebSocket connection to open
    bridge.webSocketManager.socket.addEventListener('open', async () => {
        console.log('WebSocket connection established.');

        try {
            // Generate the key pair and send the public key
            const publicKey = await generateKeyPair();
            bridge.sendKey(publicKey);
        } catch (err) {
            console.error("Error generating key pair:", err);
        }
    });
};

async function generateKeyPair() {
    try {
        const keyPair = await crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256",
            },
            true, // Whether the key is extractable
            ["encrypt", "decrypt"] // Key usages
        );

        // Export the public key
        const publicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
        const publicKeyPem = convertArrayBufferToPem(publicKey, "PUBLIC KEY");

        // Export the private key
        const privateKey = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
        const privateKeyPem = convertArrayBufferToPem(privateKey, "PRIVATE KEY");

        // Store the keys in localStorage
        localStorage.setItem("publicKey", publicKeyPem);
        localStorage.setItem("privateKey", privateKeyPem);

        console.log("RSA key pair generated and saved in localStorage");
        return publicKeyPem;
    } catch (err) {
        throw new Error("Failed to generate key pair: " + err.message);
    }
}

function convertArrayBufferToPem(buffer, keyType) {
    const binaryString = String.fromCharCode(...new Uint8Array(buffer));
    const base64String = btoa(binaryString);
    const pemString = `-----BEGIN ${keyType}-----\n${base64String.match(/.{1,64}/g).join("\n")}\n-----END ${keyType}-----`;
    return pemString;
}

// Add event listener to the "Print Receipt" button
const printReceiptButton = document.getElementById("btn-print-receipt");
printReceiptButton.addEventListener("click", async () => {
    try {
        const response = await fetch("assets/formato/receipt.html");
        if (!response.ok) {
            console.error("Failed to load receipt HTML file:", response.statusText);
            return;
        }
        const receiptHtml = await response.text();
        const configs = ["Client"];
        bridge.print(configs, receiptHtml);
        console.log("Print request sent.");
    } catch (error) {
        console.error("Error printing receipt:", error);
    }
});

const sendMessageButton = document.getElementById("btn-send-message");
sendMessageButton.addEventListener("click", async () => {
    const messageA = document.getElementById("messageA").value;
    const messageB = document.getElementById("messageB").value;

    try {
        bridge.sendToDisplay(messageA, messageB);
        console.log("Send message:", messageA, messageB);
    } catch (error) {
        console.error("Error sending message:", error);
    }
});

const closeConnectionButton = document.getElementById("btn-close-connection");
closeConnectionButton.addEventListener("click", async () => {
    try {
        bridge.disconnect();
    } catch (error) {
        console.error("Error disconnecting connection:", error);
    }
});

window.onclose = () => {
    bridge.disconnect();
    console.log("WebSocket connection disconnected.");
};
