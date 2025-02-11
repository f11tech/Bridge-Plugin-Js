document.addEventListener('DOMContentLoaded', () => {
    const receiptData = data;

    const is_buy = receiptData.operation_type === "buy";

    const home_currency = `${is_buy ? "USD" : "MXN"}`;
    const foreign_currency = `${is_buy ? "MXN" : "USD"}`;
    const home_denomination = `${is_buy ? "dollars" : "pesos"}`;
    const foreign_denomination = `${is_buy ? "pesos" : "dollars"}`;

    document.getElementById("operation-title").innerText = `Transaction: ${receiptData.operation_type.toUpperCase()} (USD)`;
    document.getElementById("currency").innerText = `${home_currency} - ${foreign_currency}`;
    document.getElementById("exchange-rate").innerText = `$${receiptData.exchange_rate.toFixed(2)} MXN`;
    document.getElementById("amount").innerText = formatAmount(receiptData.base_amount, home_currency);
    document.getElementById("amount-received").innerText = formatAmount(receiptData.amount_received, home_currency);
    document.getElementById("amount-delivered").innerText = formatAmount(receiptData.amount_delivered, foreign_currency);
    document.getElementById("amount-change").innerText = formatAmount(receiptData.amount_change, home_currency);

    document.getElementById("rb-header").innerText = `BILLS ${home_currency}`;
    document.getElementById("rc-header").innerText = `COINS ${home_currency}`;
    document.getElementById("pb-header").innerText = `BILLS ${foreign_currency}`;
    document.getElementById("pc-header").innerText = `COINS ${foreign_currency}`;

    updateBreakdown("received", receiptData.breakdownReceived, home_currency, home_denomination);
    updateBreakdown("paid", receiptData.breakdownPaid, foreign_currency, foreign_denomination);
    updateDeviceData(receiptData.device_data);

});

function updateBreakdown(section, breakdown, currency, denomination) {
    const billsContainer = document.getElementById(`${section}-bills-box`);
    const coinsContainer = document.getElementById(`${section}-coins-box`);
    const billsHeader = document.getElementById(`${section}-bills-header`);
    const coinsHeader = document.getElementById(`${section}-coins-header`);

    const hasBills = Object.values(breakdown.bills).some(value => value > 0);
    const hasCoins = Object.values(breakdown.coins).some(value => value > 0);

    if (hasBills) {
        billsHeader.style.display = 'block';
        billsContainer.innerHTML = formatBreakdown(breakdown.bills);
    } else {
        billsHeader.style.display = 'none';
        billsContainer.innerHTML = '';
    }

    if (hasCoins) {
        coinsHeader.style.display = 'block';
        coinsContainer.innerHTML = formatBreakdown(breakdown.coins);
    } else {
        coinsHeader.style.display = 'none';
        coinsContainer.innerHTML = '';
    }

    document.getElementById(`total-value-${section}`).innerText = `TOTAL ${formatAmount(breakdown.total, currency)}`;
    document.getElementById(`total-text-${section}`).innerText = `${convertNumberToWords(breakdown.total)} ${denomination}`;
}

function formatBreakdown(items) {
    return Object.entries(items)
        .map(([denomination, count]) => count > 0 ? `<div><p>${denomination} <span class="breakdown-amount">x ${count}</span></p></div>` : "")
        .join("");
}

function formatAmount(amount, currency) {
    return `${amount.toLocaleString("en-US", { style: "currency", currency: "USD" })} ${currency}`;
}

function updateDeviceData(deviceData) {
    const formattedDate = new Date(deviceData.transaction_date).toLocaleString("es-ES", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit", second: "2-digit"
    }).replace(",", " ");
    document.getElementById("transaction-id").innerText = deviceData.transaction_id;
    document.getElementById("formatted-date").innerText = formattedDate;
    document.getElementById("branch-legal-name").innerText = deviceData.company.legal_name;
    document.getElementById("branch-address").innerText = deviceData.company.address;
    document.getElementById("branch-employee-number").innerText = deviceData.employee_number;
    document.getElementById("branch-cashier-number").innerText = deviceData.cashier_number;
}

const numbersToWords = {
    0: "zero",
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
    10: "ten",
    11: "eleven",
    12: "twelve",
    13: "thirteen",
    14: "fourteen",
    15: "fifteen",
    16: "sixteen",
    17: "seventeen",
    18: "eighteen",
    19: "nineteen",
    20: "twenty",
    30: "thirty",
    40: "forty",
    50: "fifty",
    60: "sixty",
    70: "seventy",
    80: "eighty",
    90: "ninety",
};

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function convertNumberToWords(amount) {
    if (amount in numbersToWords) return numbersToWords[amount];

    let words = "";

    if (amount >= 1000) {
        words += convertNumberToWords(Math.floor(amount / 1000)) + " thousand";
        amount %= 1000;
    }

    if (amount >= 100) {
        words += convertNumberToWords(Math.floor(amount / 100)) + " hundred";
        amount %= 100;
    }

    if (amount > 0) {
        if (words !== "")
            words += " and ";
        if (amount < 20)
            words += numbersToWords[amount];
        else {
            words += numbersToWords[Math.floor(amount / 10) * 10];

            if (amount % 10 > 0) {
                words += "-" + numbersToWords[amount % 10];
            }
        }
    }
    return capitalizeFirstLetter(words);
}