# BRIDGE Plugin

The **BRIDGE Plugin** provides a WebSocket-based communication layer for integrating external services with the **BRIGGE Electron Service** application. It enables sending and receiving messages, printing receipts, and managing display messages via WebSocket.

## Features

- **WebSocket Communication**: Handles communication via WebSocket for real-time data exchange.
- **Receipt Printing**: Sends formatted HTML receipts for printing.
- **Display Messaging**: Sends custom messages to external displays.
- **Encryption Key Handling**: Manages public key exchange for secure communication.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/f11tech/Bridge-Plugin-Js.git
   cd Bridge-Plugin-Js
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. **CDN Import (jsDelivr)**
   
   If you prefer to load the plugin via CDN, you can use jsDelivr:
   ```js
   <script src="https://cdn.jsdelivr.net/gh/f11tech/Bridge-Plugin-Js@latest/dist/bridge.min.js"></script>
   ```
   
4. Import the plugin into your project:
   ```js
   const Bridge = require('./bridge');
   ```

5. Initialize an instance:
   ```js
   const bridge = new Bridge();
   bridge.connect();
   ```


---

## API Reference

### `constructor(port = 51510)`

Creates a new instance of the **BRIDGE Plugin** and initializes the WebSocket connection on the specified port.

**Parameters:**
- `port` *(optional, default: 51510)* – The port number used for WebSocket communication.

---

### `connect()`

This function initializes a WebSocket connection to the specified port, allowing real-time communication between the client and the server. It must be called before sending any messages.

**Usage:**
```js
bridge.connect();
```

---

### `sendKey(publicKey)`

Transmits a **public key** to the server for secure communication. This is typically used for encryption, authentication, or establishing a secure session.

**Parameters:**
- `publicKey` *(string)* – The public key to be sent.

**Usage:**
```js
bridge.sendKey("your-public-key");
```

---

### `print(configs, html)`

Sends an **HTML receipt** to be printed using a thermal printer. The function allows customization via configs, enabling different print settings.

**Parameters:**
- `configs` *(array of strings)* – A list of configuration settings for printing.
- `html` *(string)* – The formatted HTML content of the receipt.

**Usage:**
```js
const receiptHTML = "<html><body><h1>Receipt</h1></body></html>";
bridge.print(["config1", "config2"], receiptHTML);
```

---

### `sendToDisplay(buy, sell, port)`

Sends formatted messages to an **external display**, such as an LED board, to show exchange rates, prices, or other real-time data. **BRIDGE** ensures that messages meet the display's formatting requirements.

**Parameters:**
- `buy` *(string)* – The first message string (buy rate).
- `sell` *(string)* – The second message string (sell rate).
- `port` *(array of strings, optional)* – A list of serial ports where messages will be sent.  
  *If no port is provided, the message will be sent to every configured port in BRIDGE.*

**Usage:**
```js
// Send to a specific port
bridge.sendToDisplay("19.500", "20.00", ["COM3"]);

// Send to all configured ports
bridge.sendToDisplay("19.500", "20.00");
```

---

### `disconnect()`

Terminates the WebSocket connection, freeing up resources and preventing unwanted communication after the session ends.

**Usage:**
```js
bridge.disconnect();
```

---

## Included Resources for Printing Service
The project includes several pre-configured receipt templates for testing, located in the receipt-files folder. These templates are dynamically populated and printed within the application.

- **formato**

A receipt template designed as a form with fields to be filled in by the client.

- **hacienda-soler:**

A sample receipt for a business that handles room rentals. It includes a detailed breakdown of the client's expenses and the total amount due.

- **money-express:**

A sample receipt for a currency exchange service, providing an overview of the transaction details.

These templates serve as a foundation for dynamically generating printable receipts within the application.

---

## Example Usage

```js
const bridge = new Bridge();
bridge.connect();

bridge.sendKey("your-public-key");

const receiptHTML = "<html><body><h1>Receipt</h1></body></html>";
bridge.print(["default"], receiptHTML);

bridge.sendToDisplay("20.50", "21.00", ["COM1"]);

bridge.disconnect();
```
---

## License

This project is licensed under the **MIT License**.
