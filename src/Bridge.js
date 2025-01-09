class Bridge {
    constructor(port = 51510) {
        this.webSocketManager = new window.WebSocketManager(port); // Use global WebSocketManager
    }

    connect() {
        this.webSocketManager.connect();
    }

    print(configs, html) {
        const message = { type: 'printFile', data: html, configs };
        this.webSocketManager.sendMessage(message);
    }

    sendToDisplay(var1, var2) {
        const message = { type: 'portMessage', data: { messageA: var1, messageB: var2 } };
        this.webSocketManager.sendMessage(message);
    }
}

// Attach Bridge to the global window object
window.Bridge = Bridge;
