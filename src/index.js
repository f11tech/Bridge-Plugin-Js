// index.js
(function () {
    function arrayBufferToPem(buffer, keyType) {
        const binaryString = String.fromCharCode(...new Uint8Array(buffer));
        const base64String = btoa(binaryString);
        return `-----BEGIN ${keyType}-----\n${base64String.match(/.{1,64}/g).join("\n")}\n-----END ${keyType}-----`;
    }

    async function generateKeyPair() {
        const keyPair = await crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256",
            },
            true,
            ["encrypt", "decrypt"]
        );
        const publicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
        const privateKey = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
        return {
            publicKey: arrayBufferToPem(publicKey, "PUBLIC KEY"),
            privateKey: arrayBufferToPem(privateKey, "PRIVATE KEY"),
        };
    }

    function parseDeviceData(decrypted) {
        try {
            return JSON.parse(decrypted);
        } catch {
            return decrypted;
        }
    }

    class Bridge {
        constructor(port = 51510) {
            this.webSocketManager = new window.WebSocketManager(port);
            this._keys = null;
        }

        connect(onSuccess, onError, onClose) {
            return this.webSocketManager.connect(onSuccess, onError, onClose);
        }

        sendKey(publicKey, callbackSuccess, callbackError) {
            const message = { type: "publicKey", data: publicKey };
            const result = this.webSocketManager.sendMessage(message);
            if (result.success && typeof callbackSuccess === "function") {
                callbackSuccess(result.message);
            } else if (!result.success && typeof callbackError === "function") {
                callbackError(result.message);
            }
        }

        getDeviceData(onSuccess, onError) {
            const promise = new Promise((resolve, reject) => {
                const doRequest = () => {
                    const message = { type: "publicKey", data: this._keys.publicKey };
                    const result = this.webSocketManager.sendMessage(
                        message,
                        (decrypted) => {
                            const data = parseDeviceData(decrypted);
                            resolve(data);
                            if (typeof onSuccess === 'function') onSuccess(data);
                        },
                        (err) => {
                            const error = err || new Error("Failed to get device data");
                            reject(error);
                            if (typeof onError === 'function') onError(error);
                        },
                        { privateKey: this._keys.privateKey }
                    );
                    if (result && result.success === false) {
                        const error = new Error(result.message || "WebSocket is not connected");
                        reject(error);
                        if (typeof onError === 'function') onError(error);
                    }
                };

                const ensureConnection = () => {
                    const socket = this.webSocketManager.socket;
                    if (socket && socket.readyState === WebSocket.OPEN) {
                        return Promise.resolve();
                    }
                    if (socket && socket.readyState === WebSocket.CONNECTING) {
                        return new Promise((res, rej) => {
                            socket.addEventListener('open', () => res(), { once: true });
                            socket.addEventListener('error', () => rej(new Error("Connection failed")), { once: true });
                        });
                    }
                    return new Promise((res, rej) => {
                        this.webSocketManager.connect(res, rej);
                    });
                };

                const ensureKeys = () => {
                    if (this._keys?.publicKey && this._keys?.privateKey) {
                        return Promise.resolve();
                    }
                    return generateKeyPair().then((keys) => {
                        this._keys = keys;
                    });
                };

                ensureConnection()
                    .then(() => ensureKeys())
                    .then(doRequest)
                    .catch((err) => {
                        reject(err);
                        if (typeof onError === 'function') onError(err);
                    });
            });
            return promise;
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
