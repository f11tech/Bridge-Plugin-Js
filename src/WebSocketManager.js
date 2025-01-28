import {decryptData} from "./Decryption";

(function () {
    class WebSocketManager {
        constructor(port = 51510) {
            this.port = port;
            this.socket = null;
        }

        connect() {
            this.socket = new WebSocket(`ws://localhost:${this.port}`);

            this.socket.onopen = () => {
                console.log('Connected to WebSocket server');
            };

            this.socket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log('Message from server:', message);

                this.handleMessage(message);
            };

            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            this.socket.onclose = () => {
                console.log('WebSocket connection closed');
            };
        }

        sendMessage(message) {
            if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
                console.error('WebSocket is not connected');
                return;
            }
            this.socket.send(JSON.stringify(message));
        }

        handleMessage(message) {
            console.log('Handling message:', message);
            if (message.type === 'encryptedToken') {
                const decrypted = decryptData(message.data);
                console.log("Decrypted data:", decrypted);
            } else if (message.type === 'printStatus') {
                console.log('Print status:', message.data);
            } else if (message.type === 'portMessageStatus') {
                console.log('Port message status:', message.data);
            }
        }

        disconnect() {
            this.socket.close();
        }
    }

    window.WebSocketManager = WebSocketManager;
})();
