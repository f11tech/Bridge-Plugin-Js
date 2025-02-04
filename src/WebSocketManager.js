import { decryptData } from "./Decryption";

(function () {
    class WebSocketManager {
        constructor(port = 51510) {
            this.port = port;
            this.socket = null;
        }

        connect() {
            try {
                this.socket = new WebSocket(`ws://localhost:${this.port}`);

                this.socket.onopen = () => {
                    console.log("Connected to WebSocket server");
                    this.dispatchStatus("connected");
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
                };

                this.socket.onclose = () => {
                    console.log("WebSocket connection closed");
                    this.dispatchStatus("disconnected");
                };

                return { success: true, message: "Connecting..." };
            } catch (error) {
                console.error("Failed to establish WebSocket connection:", error);
                return { success: false, message: "Failed to connect to WebSocket" };
            }
        }

        sendMessage(message) {
            if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
                console.error("WebSocket is not connected");
                return { success: false, message: "WebSocket is not connected" };
            }

            try {
                this.socket.send(JSON.stringify(message));
                return { success: true, message: "Message sent successfully" };
            } catch (error) {
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
                    this.dispatchStatus("decryption_success", decrypted);
                } else if (message.type === "printStatus") {
                    console.log("Print status:", message.data);
                    this.dispatchStatus("print_status", message.data);
                } else if (message.type === "portMessageStatus") {
                    console.log("Port message status:", message.data);
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
    }

    window.WebSocketManager = WebSocketManager;
})();
