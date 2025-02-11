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

3. Import the plugin

- **Option 1:** Local Import

   ```js
  <script src="dist/bridge.min.js"></script>
   const Bridge = require('./bridge');
   ```
  
- **Option 2: CDN Import (jsDelivr)**
   
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

Sends an **HTML receipt** to be printed via the **BRIDGE Electron Service**, which manages the printing process based on predefined configurations.


#### How It Works

- The **configs** parameter is an array of **configuration names** (aliases).
- When connected to the **BRIDGE Electron Service**, the service will search for the corresponding **alias configuration**.
- If a matching config is found, the service retrieves **width, height, page settings, and other parameters** for printing.
- #### Printing will not occur if:
  - The plugin is **not connected** to the **BRIDGE Electron Service**. 
  - The **printing module is disabled** in the **BRIDGE Electron Service**. 
  - The **specified config alias does not exist** or **no matching config** is found.


#### Parameters

- `configs` *(string[], required)* – An array of configuration names (aliases) that reference printer settings stored in the BRIDGE Electron Service.
- `html` *(string, required)* – The formatted HTML content of the receipt.


#### Usage 
```js
const receiptHTML = "<html><body><h1>Receipt</h1></body></html>";
bridge.print(["config1", "config2"], receiptHTML);
```

#### Behavior Based on Connection & Configuration Status

| **Condition** | **Will Print?** | **Notes** |
|--------------|-------------|---------|
| Connected to BRIDGE Electron Service | ✅ Yes | If a valid **config alias** is found. |
| Not connected to BRIDGE Electron Service | ❌ No | Printing **requires an active connection**. |
| Printing module disabled in BRIDGE Electron Service | ❌ No | The **module must be enabled** for printing to proceed. |
| Config alias found in BRIDGE | ✅ Yes | Prints using the corresponding **printer settings**. |
| Config alias **not found** or does not exist | ❌ No | If the alias is **invalid or missing**, printing is skipped. |

This ensures **structured print handling** and prevents unintended printing attempts. The **BRIDGE Electron Service** is responsible for managing and executing the print process.


---

### `sendToDisplay(buy, sell, port)`

Sends formatted messages to an **external display** connected to the BRIDGE Electron Service, such as an LED board, to show exchange rates, prices, or other real-time data. **BRIDGE** ensures that messages meet the display's formatting requirements.


#### How It Works

- The **BRIDGE Electron Service** manages the communication with the external display. 
- The display **configuration (alias)** is stored within **BRIDGE Electron Service** and includes **port settings and formatting rules**.
- Messages are sent based on the defined alias and port settings.
- **Messages will not be sent if:
  - The plugin is **not connected** to the **BRIDGE Electron Service**. 
  - The **display module is disabled** in the **BRIDGE Electron Service**. 
  - The **specified port does not exist** or is **not configured**.


#### Parameters

- `buy` *(string)* – The first message string (buy rate).
- `sell` *(string)* – The second message string (sell rate).
- `port` *(array of strings, optional)* – A list of serial ports where messages will be sent.
  - If **no port is specified**, the message will be sent to **all configured ports** in the **BRIDGE Electron Service**.


#### Usage
```js
// Send to a specific port
bridge.sendToDisplay("19.500", "20.00", ["COM3"]);

// Send to all configured ports
bridge.sendToDisplay("19.500", "20.00");
```


#### Behavior Based on Connection & Configuration Status

| **Condition** | **Will Send Message?** | **Notes** |
|--------------|-----------------|---------|
| Connected to BRIDGE Electron Service | ✅ Yes | If a valid **display configuration** is found. |
| Not connected to BRIDGE Electron Service | ❌ No | **Messages require an active connection**. |
| Display module disabled in BRIDGE Electron Service | ❌ No | The **module must be enabled** for messages to be sent. |
| Specified port exists and is configured | ✅ Yes | Messages are sent to the **configured display port**. |
| Specified port does not exist or is not configured | ❌ No | If the **port is invalid or missing**, no message is sent. |
| No port specified | ✅ Yes | The message is sent to **all configured ports**. |

This ensures **structured display message handling** and prevents unnecessary transmission attempts. The **BRIDGE Electron Service** is responsible for determining the correct **port and format** for sending messages.

---

### `disconnect()`

Terminates the WebSocket connection, freeing up resources and preventing unwanted communication after the session ends.

**Usage:**
```js
bridge.disconnect();
```

---

## Included Resources for Printing Service
This project includes several pre-configured receipt templates for testing, located in the `receipt-files` folder. These templates are dynamically populated and printed within the application using a centralized receipt management system.


### Receipt Template Structure
Each receipt template is stored in RECEIPT_FILES as an object containing:

- `path` – The directory where the receipt assets are stored. 
- `files` – An array of required files (HTML, CSS, JS, data, images). 
- `requiresJS` – Specifies whether JavaScript is required for the receipt. 
- `requiresData` – Specifies whether external data (data.json) is needed. 
- `requiresImage` – Specifies whether images need to be embedded in the receipt.

### Available Receipt Templates

| **Template Name**   | **Includes JavaScript?** | **Requires Data?** | **Requires Images?** | **Description** |
|---------------------|-----------------|----------------|----------------|----------------|
| `FORMATO`          | ❌ No | ❌ No | ❌ No | A structured form receipt with fields for client input. |
| `FORMATO_ORIGINAL` | ❌ No | ❌ No | ❌ No | The original, unmodified receipt structure. |
| `HACIENDA_SOLER`   | ✅ Yes | ✅ Yes | ✅ Yes | A **detailed invoice** for room rentals, including expenses. |
| `MODO`             | ✅ Yes | ✅ Yes | ✅ Yes | A **buy/sell transaction receipt**, showing cash breakdown. |
| `MONEY_EXPRESS`    | ✅ Yes | ✅ Yes | ✅ Yes | A **currency exchange receipt**, providing transaction details. |


### Centralized Receipt Generation

The system dynamically **fetches and composes receipt templates** by assembling the required assets based on their configurations. The function `createReceiptFile(typeName)` handles this process.

### How It Works
1. The **requested receipt type** is looked up in `RECEIPT_FILES`.
2. The **HTML file** is fetched as the base template.
3. If **CSS exists**, it is embedded within `<style>` tags.
4. If **JavaScript exists**, it is injected into the `<script>` tag.
5. If **data.json is required**, it is fetched and **replaces placeholders** in the script.
6. If **images are required**, they are **converted to Base64** and embedded.


### Example Usage
```js
const receiptHTML = await createReceiptFile("MONEY_EXPRESS");
```

---

## Usage

```js
const bridge = new Bridge();
bridge.connect();

bridge.sendKey("your-public-key");

const receiptHTML = await createReceiptFile("MONEY_EXPRESS");
bridge.print(["default"], receiptHTML);

bridge.sendToDisplay("20.50", "21.00", ["COM1"]);

bridge.disconnect();
```
---

## License

This project is licensed under the **MIT License**.
