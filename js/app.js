const balanceElement = document.getElementById("balance");
const loanElement = document.getElementById("loan");
const payElement = document.getElementById("pay");

const loanButtonElement = document.getElementById("loan-button");
const repayLoanButtonElement = document.getElementById("repay-loan-button");
const bankButtonElement = document.getElementById("bank-button");
const workButtonElement = document.getElementById("work-button");
const buyButtonElement = document.getElementById("buy-now-button");

const laptopsElement = document.getElementById("laptops");
const laptopSelection = document.getElementById("select-laptop");
const laptopFeature = document.getElementById("laptop-features");
const laptopTitle = document.getElementById("laptop-title");
const laptopPrice = document.getElementById("laptop-price");
const laptopInfo = document.getElementById("laptop-info");
const laptopImg = document.getElementById("laptop-img");
const laptopFeatureHeader = document.getElementById("laptop-feature-header");
const laptopColumn = document.getElementById("laptop-column");

const url = "https://noroff-komputer-store-api.herokuapp.com/computers/";

let balance = 200;
let pay = 0;
let haveLoan = false;
let loan = 0;
let laptops = [];


/**
 * Fetches the laptops from the API when program starts and store it in laptops array and add them to the dropdown list.
 */
(async () => {
    try {
        const response = await fetch(url);
        const laptopJson = await response.json();
        laptops = laptopJson;
        listLaptops(laptops);
    }
    catch (error) {
        console.log("Error: ", error);
    }
})();


/**
 * List all the laptops in the dropdown menu.
 * @param {*} laptops arraylist of laptops.
 */
const listLaptops = (laptops) => {
    laptops.forEach(laptop => {
        let selectOptions = document.createElement("option");
        selectOptions.setAttribute("id", laptop.id);
        selectOptions.appendChild(document.createTextNode(laptop.title));
        laptopSelection.appendChild(selectOptions);
    });
}


/**
 * Display the information about the computer that are chosen in the dropdown menu.
 */
const displayLaptop = () => {
    let id = parseInt(laptopSelection.options[laptopSelection.selectedIndex].id); //id of the chosen laptop in dropdown menu

    laptops.forEach(laptops => {
        if (laptops.id === id) {
            laptopFeature.innerText = `- ${laptops.specs.join('\r\n- ')}`;
            laptopTitle.innerText = `${laptops.title}`;
            laptopPrice.innerText = `${laptops.price}`;
            laptopInfo.innerText = `${laptops.description}`;
            laptopImg.innerHTML = `<img src = "https://noroff-komputer-store-api.herokuapp.com/${laptops.image}" width= "200" />`;
            laptopFeatureHeader.style.display = "block";
            laptopColumn.style.display = "block";
            return;
        }
    });

}
/**
 * Check if the balance is enough to buy a computer and alert message.
 */
const buyLaptop = () => {
    let price = laptopPrice.innerText;
    if (parseInt(price) > balance) {
        alert("You do not have the balance to buy the super computer " + `${laptopTitle.innerText}`);
    } else if (parseInt(price) <= balance) {
        alert("You are now the owner of the super computer " + `${laptopTitle.innerText}`);
        balance -= `${laptopPrice.innerText}`;
        balanceElement.innerText = balance;
    }
}
/**
 * increase the pay with 100.
 */
const work = () => {
    pay += 100;
    payElement.innerText = `${pay}`;
}
/**
 * Transfers work pay to bank. Check if a loan is active and transfer 10% to pay the loan.
 */
const transferWorkPay = () => {
    if (haveLoan) {
        if ((pay * 0.1) >= loan) {
            balance += (pay - loan);
            loan = 0;
            haveLoan = false;
            loanElement.style.display = "block";
            repayLoanButtonElement.display = "block";
        } else {
            loan -= (pay * 0.1);
            console.log(loan);
            balance += (pay * 0.9);
        }
    } else {
        balance += pay;
    }
    pay = 0;
    loanElement.innerText = `Loan: ${loan}kr`;
    payElement.innerText = `${pay}`;
    balanceElement.innerText = `${balance}`;
}
/**
 * Check if user are allowed to take a loan and alerts the outcome.
 * The user can only have one loan and only take a loan for max of dubbel the current balance.
 */
const getLoan = () => {
    if (!haveLoan) {
        askedLoan = parseInt(prompt("Enter the amount you want to borrow."));
        if (askedLoan > balance * 2) {
            alert("You can only borrow your balance times two, (" + (balance * 2) + "kr)");
            console.log(balance);
        } else if (askedLoan <= balance * 2) {
            alert("Your request have been approved.");
            balance += askedLoan;
            haveLoan = true;
            loan += askedLoan;
            loanElement.style.display = "block";
            repayLoanButtonElement.style.display = "block";
            balanceElement.innerText = `${balance}`;
            loanElement.innerText = `Loan: ${loan}kr`;

        }
    } else {
        alert("You need to pay back the money you borrowed in order to apply for a new loan!")
    }
}

/**
 * Pay back the loan function. If the user have enough to cover or just a specific amount, then updates values.
 */
const payLoan = () => {
    if (pay === 0) {
        alert("You dont have any money to pay with. Increase you Work pay!")
    } else {
        if (loan > pay) {
            loan -= pay;
            pay = 0;
            payElement.innerText = `${pay}`;
            loanElement.innerText = `Loan: ${loan}kr`;
        } else {
            pay -= loan;
            loan = 0;
            haveLoan = false;
            payElement.innerText = `${pay}`;
            loanElement.innerText = `Loan: ${loan}kr`;
            loanElement.style.display = "none";
            repayLoanButtonElement.style.display = "none";
        }

    }
}

/**
 * Event listerners that waits and listens for button to be pressed.
 */
bankButtonElement.addEventListener("click", transferWorkPay);
workButtonElement.addEventListener("click", work);
loanButtonElement.addEventListener("click", getLoan);
repayLoanButtonElement.addEventListener("click", payLoan);
buyButtonElement.addEventListener("click", buyLaptop);
laptopSelection.addEventListener("change", displayLaptop);