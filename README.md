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

3. Import the plugin into your project:
   ```js
   const Bridge = require('./bridge');
   ```

4. Initialize an instance:
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

Establishes a WebSocket connection to the specified port.

**Usage:**
```js
bridge.connect();
```

---

### `sendKey(publicKey)`

Sends a **public key** for secure communication.

**Parameters:**
- `publicKey` *(string)* – The public key to be sent.

**Usage:**
```js
bridge.sendKey("your-public-key");
```

---

### `print(configs, html)`

Sends an **HTML receipt** for printing with specified configurations.

**Parameters:**
- `configs` *(array of strings)* – A list of configuration settings for printing.
- `html` *(string)* – The formatted HTML content of the receipt.

**Usage:**
```js
const receiptHTML = "<html><body><h1>Receipt</h1></body></html>";
bridge.print(["config1", "config2"], receiptHTML);
```

---

### `sendToDisplay(var1, var2)`

Sends a message to an external display.

**Parameters:**
- `var1` *(string)* – The first message string.
- `var2` *(string)* – The second message string.

**Usage:**
```js
bridge.sendToDisplay("Welcome", "Processing...");
```

---

### `disconnect()`

Closes the WebSocket connection.

**Usage:**
```js
bridge.disconnect();
```

---

## Example Usage

```js
const bridge = new Bridge();
bridge.connect();

bridge.sendKey("your-public-key");

const receiptHTML = "<html><body><h1>Receipt</h1></body></html>";
bridge.print(["default"], receiptHTML);

bridge.sendToDisplay("Hello", "World");

bridge.disconnect();
```

---

## License

This project is licensed under the **MIT License**.