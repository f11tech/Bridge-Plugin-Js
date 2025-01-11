let bridge = new Bridge(51510);
let configs = [];

// Automatically connect to the WebSocket server on page load
window.onload = () => {
    bridge.connect();
    console.log('WebSocket connection initialized.');
};

const printReceiptButton = document.getElementById("btn-print-receipt");
printReceiptButton.addEventListener("click", async () => {
    const input = document.getElementById("configNames").value;
    const filePath = "assets/receipt-files/hacienda-soler/";
    const fileName = "receipt.html";

    if (input) {
        configs = input.split(',').map(item => item.trim());
        console.log(configs);
    }

    try {
        console.log(filePath + fileName);
        const response = await fetch(filePath + fileName);
        if (!response.ok) {
            console.error("Failed to load receipt HTML file:", response.statusText);
            return;
        }
        let receiptHtml = await response.text();
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
        disconnectClient();
    } catch (error) {
        console.error("Error disconnecting connection:", error);
    }
})

window.onclose = () => {
    disconnectClient();
}

function disconnectClient() {
    bridge.disconnect();
    console.log('WebSocket connection disconnected.');
    bridge = null;
}