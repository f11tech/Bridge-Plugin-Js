fetch("ticket-data.json")
    .then(response => response.json())
    .then(({ data, deviceData }) => {
        const is_buy = data.operation_type === "buy";
        const exchange_rate = "$" + data.rate_used.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        const amount = is_buy ? data.foreign_amount : data.base_amount;
        const amount_received = data.amount_received;
        const amount_delivered = is_buy ? data.base_amount : data.foreign_amount;
        const amount_change = data.amount_delivered;
        const currency_code = is_buy ? data.foreign_currency_code : "MXN";

        const date = new Date(data.created_at);
        const formattedDate = new Date(data.created_at).toLocaleString("es-ES", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit", second: "2-digit"
        }).replace(",", " a las");

        const generalDateFormatted = new Date(deviceData.branch.company.register_date)
            .toLocaleDateString("es-ES");
        
        const branchName = deviceData.branch.company.legal_name;
        const branchRFC = deviceData.branch.company.rfc;
        const branchAddress = deviceData.branch.address;
        const branchCompanyAddress = deviceData.branch.company.address;
        const dataConsecutive = data.consecutive;
        const branchCompanyRegisterNumber = deviceData.branch.company.register_number;
        const branchCashierNumber = deviceData.branch.cashier_number;

        document.getElementById("operation-title").textContent = `OPERACIÓN: ${is_buy ? "COMPRA" : "VENTA"}`;
        document.getElementById("exchange-rate").textContent = `${exchange_rate} MXN`;
        document.getElementById("amount").textContent = `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency_code}`;
        document.getElementById("amount-received").textContent = `$${amount_received.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency_code}`;
        document.getElementById("amount-delivered").textContent = `$${amount_delivered.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;
        document.getElementById("amount-change").textContent = `$${amount_change.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;

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

