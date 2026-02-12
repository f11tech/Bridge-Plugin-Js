// index.js
(function () {
    class Bridge {
        constructor(port = 51510) {
            this.webSocketManager = new window.WebSocketManager(port);
        }

        connect(onSuccess, onError, onClose) {
            return this.webSocketManager.connect(onSuccess, onError, onClose);
        }

        sendKey(publicKey, onSuccess, onError) {
            const message = { type: "publicKey", data: publicKey };
            this.webSocketManager.sendMessage(message, onSuccess, onError);
        }

        print(configs, html, onSuccess, onError) {
            const message = { type: 'printFile', data: { selectedConfigs: configs, htmlContent: html } };
            this.webSocketManager.sendMessage(message, onSuccess, onError);
        }

        sendToDisplay(var1, var2, port, onSuccess, onError) {
            const message = { type: 'portMessage', data: { messageA: var1, messageB: var2, selectedPort: port } };
            this.webSocketManager.sendMessage(message, onSuccess, onError);
        }

        disconnect() {
            this.webSocketManager.disconnect();
        }
    }

    window.Bridge = Bridge;
})();
