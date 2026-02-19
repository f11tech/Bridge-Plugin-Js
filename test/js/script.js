let bridge = new Bridge(51510);
let configs = [];

export const RECEIPT_FILES = {
    FORMATO: {
        path: "assets/receipt-files/formato/",
        files: ["receipt.html", "css/style.css"],
        requiresJS: false,
        requiresData: false,
        requiresImage: false
    },
    FORMATO_ORIGINAL: {
        path: "assets/receipt-files/formato-original/",
        files: ["receipt.html"],
        requiresJS: false,
        requiresData: false,
        requiresImage: false
    },
    HACIENDA_SOLER: {
        path: "assets/receipt-files/hacienda-soler/",
        files: ["receipt.html", "css/style.css", "js/script.js", "data/data.json", "images/logo.png"],
        requiresJS: true,
        requiresData: true,
        requiresImage: true
    },
    MODO: {
        path: "assets/receipt-files/modo/",
        files: ["receipt.html", "css/style.css", "js/script.js", "data/data.json", "ad.jpg"],
        requiresJS: true,
        requiresData: true,
        requiresImage: true
    },
    MONEY_EXPRESS: {
        path: "assets/receipt-files/money-express/",
        files: ["receipt.html", "css/style.css", "js/script.js", "data/data.json", "ad.jpg"],
        requiresJS: true,
        requiresData: true,
        requiresImage: true
    },
};

async function fetchTextFile(filePath) {
    try {
        const response = await fetch(filePath);
        return await response.text();
    } catch (error) {
        console.error(`Error fetching file: ${filePath}`, error);
        return "";
    }
}

async function fetchJSONFile(filePath) {
    try {
        const response = await fetch(filePath);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching JSON file: ${filePath}`, error);
        return {};
    }
}

async function convertBlobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

async function fetchImageAsBase64(filePath) {
    try {
        const response = await fetch(filePath);
        const blob = await response.blob();
        return await convertBlobToBase64(blob);
    } catch (error) {
        console.error(`Error fetching image file: ${filePath}`, error);
        return "";
    }
}

async function createReceiptFile(typeName) {
    const type = RECEIPT_FILES[typeName]; // 🛠️ Get the receipt type object
    if (!type) {
        console.error(`Receipt type '${typeName}' is not defined.`);
        return;
    }

    const { path, files, requiresJS, requiresData, requiresImage } = type;
    try {
        console.log(`Loading receipt: ${typeName}`);

        // Fetch HTML file
        let response = await fetch(path + files[0]);
        let html = await response.text();

        // Fetch CSS file if it exists
        if (files.includes("css/style.css")) {
            const css = await fetchTextFile(path + "css/style.css");
            html = html.replace("</head>", `<style>${css}</style></head>`);
        }

        // Fetch JavaScript and replace data if required
        if (requiresJS && files.includes("js/script.js")) {
            let js = await fetchTextFile(path + "js/script.js");

            if (requiresData && files.includes("data/data.json")) {
                let data = await fetchJSONFile(path + "data/data.json");
                data = data[0];
                js = js.replace("const receiptData = data;", `const receiptData = ${JSON.stringify(data)};`);
            }

            html = html.replace("</body>", `<script>${js}</script></body>`);
        }

        // Fetch and embed image if required
        if (requiresImage && files.includes("ad.jpg")) {
            const imageBase64 = await fetchImageAsBase64(path + "ad.jpg");
            html = html.replace("<img>", `<img src="${imageBase64}" alt="Receipt Ad" class="ad-image">`);
        }

        if (requiresImage && files.includes("images/logo.png")) {
            const imageBase64 = await fetchImageAsBase64(path + "images/logo.png");
            html = html.replace("<img>", `<img src="${imageBase64}" alt="Receipt Logo" class="ad-image">`);
        }

        console.log("Generated HTML:", html);
        return html;
    } catch (error) {
        console.error("Error generating receipt:", error);
    }
}


// Automatically connect to the WebSocket server on page load
window.onload = () => {
    bridge.connect();
    console.log('WebSocket connection initialized.');
};

const printReceiptButton = document.getElementById("btn-print-receipt");
printReceiptButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const input = document.getElementById("configNames").value;
    if (input) {
        configs = input.split(',').map(item => item.trim());
        console.log(configs);
    }
    try {
        const html = await createReceiptFile("MODO");

        console.log("Generated html:", html);
        console.log(configs);

        if (html) {
            bridge.print(configs, html);
            console.log("Print request sent.");
        } else {
            console.error("Failed to generate HTML. Cannot print.");
        }
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

const getDeviceDataButton = document.getElementById("btn-get-device-data");
const deviceDataOutput = document.getElementById("device-data-output");
getDeviceDataButton.addEventListener("click", async (e) => {
    e.preventDefault();
    deviceDataOutput.textContent = "Loading...";
    bridge.getDeviceData(
        (data) => {
            deviceDataOutput.textContent = typeof data === "object"
                ? JSON.stringify(data, null, 2)
                : String(data);
            console.log("Device data:", data);
        },
        (err) => {
            deviceDataOutput.textContent = "Error: " + (err?.message || err);
            console.error("Error getting device data:", err);
        }
    );
});

window.onclose = () => {
    disconnectClient();
}

function disconnectClient() {
    bridge.disconnect();
    console.log('WebSocket connection disconnected.');
    bridge = null;
}