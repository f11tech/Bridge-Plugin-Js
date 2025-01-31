(function () {
    class Bridge {
        constructor(port = 51510) {
            this.webSocketManager = new window.WebSocketManager(port);
        }

        connect() {
            this.webSocketManager.connect();
        }

        sendKey(publicKey) {
            const message = {type: "publicKey", data: publicKey};
            this.webSocketManager.sendMessage(message);
        }

        print(configs, html)  {
            const message = { type: 'printFile', data: { selectedConfigs: configs, htmlContent: html } };
            this.webSocketManager.sendMessage(message);
        }

        sendToDisplay(var1, var2, port) {
            const message = { type: 'portMessage', data: { messageA: var1, messageB: var2, selectedPort: port } };
            this.webSocketManager.sendMessage(message);
        }

        disconnect() {
            this.webSocketManager.disconnect();
        }
    }

    window.Bridge = Bridge;
})();
