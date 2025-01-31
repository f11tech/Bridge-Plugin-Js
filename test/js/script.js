let bridge = new Bridge(51510);
let configs = [];

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

        console.log("Private key: ", privateKeyPem);

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

function convertBlobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

function getReceiptData() {
    const receiptData = {
        data: {
            operation_type: document.getElementById("operation_type").text,
            rate_used: parseFloat(document.getElementById("rate_used").value),
            foreign_amount: parseFloat(document.getElementById("foreign_amount").value),
            base_amount: parseFloat(document.getElementById("base_amount").value),
            amount_received: parseFloat(document.getElementById("amount_received").value),
            amount_delivered: parseFloat(document.getElementById("amount_delivered").value),
            foreign_currency_code: document.getElementById("foreign_currency_code").text,
            created_at: document.getElementById("created_at").text,
            consecutive: document.getElementById("consecutive").text,
            deviceData: {
                ticket_type: document.getElementById("ticket_type").text,
                branch: {
                    address: document.getElementById("branch_address").text,
                    cashier_number: document.getElementById("cashier_number").text,
                    company: {
                        register_number: document.getElementById("register_number").text,
                        register_date: document.getElementById("register_date").text,
                        legal_name: document.getElementById("legal_name").text,
                        address: document.getElementById("company_address").text,
                        rfc: document.getElementById("rfc").text
                    }
                }
            }
        }
    };

    console.log("Formatted Receipt Data:", receiptData);

    // Convert JSON data to string and embed it in the receipt
    return JSON.stringify(receiptData);
}

const printReceiptButton = document.getElementById("btn-print-receipt");
printReceiptButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const input = document.getElementById("configNames").value;
    const filePath = "assets/receipt-files/money-express/";
    const fileName = "receipt.html";
    const cssFileName = "style.css";
    const jsFileName = "script.js";
    const dataFilePath = "data/ticket-data.json";

    if (input) {
        configs = input.split(',').map(item => item.trim());
        console.log(configs);
    }
    try {
        console.log(filePath + fileName);
        let response = await fetch(filePath + fileName);
        let html = await response.text();

        const cssResponse = await fetch(filePath + cssFileName);
        const css = await cssResponse.text();
        html = html.replace("</head>", `<style>${css}</style></head>`);

        const jsResponse = await fetch(filePath + jsFileName);
        let js = await jsResponse.text();
        console.log(js);

        const dataResponse = await fetch(filePath + dataFilePath);
        const data = await dataResponse.json();
        js = js.replace("const receiptData = data;", `const receiptData = ${JSON.stringify(data)};`);

        html = html.replace("</body>", `<script>${js}</script></body>`);

        const imagePath = filePath + "ad.jpg";
        const imageResponse = await fetch(imagePath);
        const imageBlob = await imageResponse.blob();
        const imageBase64 = await convertBlobToBase64(imageBlob);

        html = html.replace("<img>", `<img src="${imageBase64}" alt="Receipt Logo" class="ad-image">`);

        console.log(html);

        console.log(html);
        bridge.print(configs, html);
        console.log("Print request sent.");
    } catch (error) {
        console.error("Error printing receipt:", error);
    }
});

const sendMessageButton = document.getElementById("btn-send-message");
sendMessageButton.addEventListener("click", async (e) => {
    e.preventDefault();

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
closeConnectionButton.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
        disconnectClient();
    } catch (error) {
        console.error("Error disconnecting connection:", error);
    }
});

window.onclose = () => {
    disconnectClient();
}

function disconnectClient() {
    bridge.disconnect();
    console.log('WebSocket connection disconnected.');
    bridge = null;
}