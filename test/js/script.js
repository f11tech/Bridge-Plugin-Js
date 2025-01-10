import forge from 'node-forge';
const bridge = new Bridge(51510);

// Automatically connect to the WebSocket server on page load
window.onload = () => {
    bridge.connect();
    console.log('WebSocket connection initialized.');

    // Wait for the WebSocket connection to open
    bridge.webSocketManager.socket.addEventListener('open', () => {
        console.log('WebSocket connection established.');

        // Once the WebSocket is open, generate the key pair and send it
        generateKeyPair().then(publicKey => {
            bridge.sendKey(publicKey);
        }).catch(err => {
            console.error("Error generating key pair:", err);
        });
    });
};

function generateKeyPair() {
    return new Promise(function(resolve, reject) {
        forge.pki.rsa.generateKeyPair({ bits: 2048, workers: -1 }, function(err, keypair) {
            if (err) {
                return reject(err);
            }

            // Convert the public key to PEM format
            const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
            // Convert the private key to PEM format
            const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);

            // Store the keys in localStorage
            localStorage.setItem('publicKey', publicKeyPem);
            localStorage.setItem('privateKey', privateKeyPem);

            console.log('RSA key pair generated and saved in localStorage');
            resolve({ publicKey: publicKeyPem, privateKey: privateKeyPem });
        });
    });
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
})

window.onclose = () => {
    bridge.disconnect();
    console.log('WebSocket connection disconnected.');
}