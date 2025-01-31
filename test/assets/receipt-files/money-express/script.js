
document.addEventListener('DOMContentLoaded', () => {
        const receiptData = data;

        const is_buy = receiptData.data.operation_type === "buy";
        const exchange_rate = "$" + receiptData.data.rate_used.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
        });
        const amount = is_buy ? receiptData.data.foreign_amount : receiptData.data.base_amount;
        const amount_received = receiptData.data.amount_received;

        const amount_delivered = is_buy ? receiptData.data.base_amount : receiptData.data.foreign_amount;
        const amount_change = receiptData.data.amount_delivered;
        const currency_code = is_buy ? receiptData.data.foreign_currency_code : "MXN";

        const date = new Date(receiptData.data.created_at);
        const formattedDate = new Date(receiptData.data.created_at).toLocaleString("es-ES", {
                day: "2-digit", month: "2-digit", year: "numeric",
                hour: "2-digit", minute: "2-digit", second: "2-digit"
        }).replace(",", " a las");

        const generalDateFormatted = new Date(receiptData.data.deviceData.branch.company.register_date)
            .toLocaleDateString("es-ES");

        const branchName = receiptData.data.deviceData.branch.company.legal_name;
        const branchRFC = receiptData.data.deviceData.branch.company.rfc;
        const branchAddress = receiptData.data.deviceData.branch.address;
        const branchCompanyAddress = receiptData.data.deviceData.branch.company.address;
        const dataConsecutive = receiptData.data.consecutive;
        const branchCompanyRegisterNumber = receiptData.data.deviceData.branch.company.register_number;
        const branchCashierNumber = receiptData.data.deviceData.branch.cashier_number;

        document.getElementById("operation-title").textContent = `OPERACIÓN: ${is_buy ? "COMPRA" : "VENTA"}`;
        document.getElementById("exchange-rate").textContent = `${exchange_rate} MXN`;

        document.getElementById("amount").textContent =
            `${amount.toLocaleString("en-US", { style: "currency", currency: currency_code })} ${currency_code}`;
        document.getElementById("amount-received").textContent =
            `${amount_received.toLocaleString("en-US", { style: "currency", currency: currency_code })} ${currency_code}`;
        document.getElementById("amount-delivered").textContent =
            `${amount_delivered.toLocaleString("en-US", { style: "currency", currency: currency_code })} ${currency_code}`;
        document.getElementById("amount-change").textContent =
            `${amount_change.toLocaleString("en-US", { style: "currency", currency: currency_code })} ${currency_code}`;

        document.getElementById("general-date").textContent = generalDateFormatted;

        document.getElementById("branch-legal-name").textContent = branchName;
        document.getElementById("branch-address").textContent = branchAddress;
        document.getElementById("branch-rfc").textContent = branchRFC;
        document.getElementById("formatted-date").textContent = formattedDate;
        document.getElementById("branch-company-address").textContent = branchCompanyAddress;
        document.getElementById("data-consecutive").textContent = dataConsecutive;
        document.getElementById("branch-company-register-number").textContent = branchCompanyRegisterNumber;
        document.getElementById("branch-cashier-number").textContent = branchCashierNumber;
});