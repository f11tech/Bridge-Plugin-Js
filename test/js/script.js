const bridge = new Bridge(51510);

// Automatically connect to the WebSocket server on page load
window.onload = () => {
    bridge.connect();
    console.log('WebSocket connection initialized.');
};

// Add event listener to the "Print Receipt" button
const printReceiptButton = document.getElementById("print-receipt-button");
printReceiptButton.addEventListener("click", async () => {
    try {
        const response = await fetch("assets/formato/receipt.html");
        if (!response.ok) {
            console.error("Failed to load receipt HTML file:", response.statusText);
            return;
        }
        const receiptHtml = await response.text();
        const configs = ["Cliente"];
        bridge.print(configs, receiptHtml);
        console.log("Print request sent.");
    } catch (error) {
        console.error("Error printing receipt:", error);
    }
});

const sendMessageButton = document.getElementById("send-message-button");
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