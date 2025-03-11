// index.js
(function () {
    class Bridge {
        constructor(port = 51510) {
            this.webSocketManager = new window.WebSocketManager(port);
        }

        connect(callbackSuccess, callbackError) {
            const result = this.webSocketManager.connect();
            if (result.success && typeof callbackSuccess === "function") {
                callbackSuccess(result.message);
            } else if (typeof callbackError === "function") {
                callbackError(result.message);
            }
        }

        sendKey(publicKey, callbackSuccess, callbackError) {
            const message = { type: "publicKey", data: publicKey };
            const result = this.webSocketManager.sendMessage(message);
            if (result.success && typeof callbackSuccess === "function") {
                callbackSuccess(result.message);
            } else if (typeof callbackError === "function") {
                callbackError(result.message);
            }
        }

        print(configs, html, callbackSuccess, callbackError) {
            const message = { type: 'printFile', data: { selectedConfigs: configs, htmlContent: html } };
            const result = this.webSocketManager.sendMessage(message);
            if (result.success && typeof callbackSuccess === "function") {
                callbackSuccess(result.message);
            } else if (typeof callbackError === "function") {
                callbackError(result.message);
            }
        }

        sendToDisplay(var1, var2, port, callbackSuccess, callbackError) {
            const message = { type: 'portMessage', data: { messageA: var1, messageB: var2, selectedPort: port } };
            const result = this.webSocketManager.sendMessage(message);
            if (result.success && typeof callbackSuccess === "function") {
                callbackSuccess(result.message);
            } else if (typeof callbackError === "function") {
                callbackError(result.message);
            }
        }

        disconnect(callbackSuccess, callbackError) {
            this.webSocketManager.disconnect();
            const result = { success: true, message: "Disconnected successfully" };
            if (result.success && typeof callbackSuccess === "function") {
                callbackSuccess(result.message);
            } else if (typeof callbackError === "function") {
                callbackError(result.message);
            }
        }
    }

    window.Bridge = Bridge;
})();
