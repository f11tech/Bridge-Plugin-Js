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

export async function printReceipt(type) {
    if (!RECEIPT_FILES[type]) {
        console.error(`Receipt type '${type}' is not defined.`);
        return;
    }

    const { path, files, requiresJS, requiresData, requiresImage } = RECEIPT_FILES[type];
    try {
        console.log(`Loading receipt: ${type}`);

        // Fetch HTML file
        let html = await fetchTextFile(path + files[0]);

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
        bridge.print(configs, html);
        console.log("Print request sent.");
    } catch (error) {
        console.error("Error generating receipt:", error);
    }
}