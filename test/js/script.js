const bridge = new Bridge(51510);

// Automatically connect to the WebSocket server on page load
window.onload = () => {
    bridge.connect();
    console.log('WebSocket connection initialized.');
};

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