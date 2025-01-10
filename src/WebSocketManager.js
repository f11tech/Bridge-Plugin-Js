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

            // Add custom event logic if needed
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

        // Example: Log different types
        if (message.type === 'printStatus') {
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