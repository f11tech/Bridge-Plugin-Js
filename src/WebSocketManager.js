import { decryptData } from "./Decryption";
import { v4 as uuidv4 } from 'uuid';

(function () {
    class WebSocketManager {

        #callbacks = {};

        constructor(port = 51510) {
            this.port = port;
            this.socket = null;
        }

        connect(onSuccess, onError, onClose) {
            try {
                this.socket = new WebSocket(`ws://localhost:${this.port}`);

                this.socket.onopen = () => {
                    console.log("Connected to WebSocket server");
                    this.dispatchStatus("connected");
                    if (typeof onSuccess === 'function') {
                        onSuccess();
                    }
                };

                this.socket.onmessage = (event) => {
                    try {
                        const message = JSON.parse(event.data);
                        console.log("Message from server:", message);
                        this.handleMessage(message);
                    } catch (error) {
                        console.error("Error parsing WebSocket message:", error);
                    }
                };

                this.socket.onerror = (error) => {
                    console.error("WebSocket error:", error);
                    this.dispatchStatus("connection_failed");
                    if (typeof onError === 'function') {
                        onError();
                    }
                };

                this.socket.onclose = () => {
                    console.log("WebSocket connection closed");
                    this.dispatchStatus("disconnected");
                    if (typeof onClose === 'function') {
                        onClose();
                    }
                };

                return { success: true, message: "Connecting..." };
            } catch (error) {
                console.error("Failed to establish WebSocket connection:", error);
                return { success: false, message: "Failed to connect to WebSocket" };
            }
        }

        sendMessage(message, onSuccess, onError) {
            if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
                console.error("WebSocket is not connected");
                return { success: false, message: "WebSocket is not connected" };
            }

            message.uuid = uuidv4();
            this.setCallbacks(message.uuid, onSuccess, onError);

            try {
                this.socket.send(JSON.stringify(message));
                return { success: true, message: "Message sent successfully" };
            } catch (error) {

                this.executeCallbacks(message.uuid, false);

                console.error("Error sending message:", error);
                return { success: false, message: "Error sending message" };
            }
        }

        handleMessage(message) {
            console.log("Handling message:", message);
            try {
                if (message.type === "encryptedToken") {
                    const decrypted = decryptData(message.data);
                    console.log("Decrypted data:", decrypted);
                    this.executeCallbacks(message.uuid, message.status, decrypted);
                    this.dispatchStatus("decryption_success", decrypted);
                } else if (message.type === "printStatus") {
                    console.log("Print status:", message.data);
                    this.executeCallbacks(message.uuid, message.status);
                    this.dispatchStatus("print_status", message.data);
                } else if (message.type === "portMessageStatus") {
                    console.log("Port message status:", message.data);
                    this.executeCallbacks(message.uuid, message.status);
                    this.dispatchStatus("port_message_status", message.data);
                }
            } catch (error) {
                console.error("Error handling message:", error);
            }
        }

        dispatchStatus(type, data = null) {
            console.log(`Event: ${type}`, data);
            if (typeof window !== "undefined" && window.dispatchEvent) {
                const event = new CustomEvent("WebSocketStatus", {
                    detail: { type, data },
                });
                window.dispatchEvent(event);
            }
        }

        disconnect() {
            if (this.socket) {
                this.socket.close();
                console.log("WebSocket disconnected");
            }
        }

        setCallbacks(uuid, onSuccess, onError) {
            let callbackPair = {},
                hasCallback = false;

            if (typeof onSuccess === 'function') {
                callbackPair.onSuccess = onSuccess;
                hasCallback = true;
            }

            if (typeof onError === 'function') {
                callbackPair.onError = onError;
                hasCallback = true;
            }

            if (!hasCallback) {
                return;
            }

            this.#callbacks[uuid] = callbackPair;
        }

        executeCallbacks(uuid, isSuccess, data) {
            let callbackPair = this.#callbacks[uuid] ?? null;
            if (callbackPair === null) {
                return;
            }

            if (isSuccess && (typeof callbackPair.onSuccess === 'function')) {
                callbackPair.onSuccess(data);
            }

            if (!isSuccess && (typeof callbackPair.onError === 'function')) {
                callbackPair.onError(data);
            }

            delete this.#callbacks[uuid];
        }

    }

    window.WebSocketManager = WebSocketManager;
})();
