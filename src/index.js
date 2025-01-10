class Bridge {
    constructor(port = 51510) {
        this.webSocketManager = new window.WebSocketManager(port);
    }

    connect() {
        this.webSocketManager.connect();
    }

    print(configs, html)  {
        const message = { type: 'printFile', data: html, clientConfigs: configs };
        this.webSocketManager.sendMessage(message);
    }

    sendToDisplay(var1, var2) {
        const message = { type: 'portMessage', data: { messageA: var1, messageB: var2 } };
        this.webSocketManager.sendMessage(message);
    }

    disconnect() {
        this.webSocketManager.disconnect();
    }
}

window.Bridge = Bridge;