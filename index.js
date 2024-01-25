/**
 * SET YOUR VARIABLES
 */

const EXCHANGE_RATES = {
  USD: 1.35, // 1 USD = 1.27 CAD
  CAD: 1, // 1 CAD = 1 CAD
};

let portfolio = {
  AAPL: {
    shares: 1,
    price: 150,
    currency: "USD",
  },
  GOOG: {
    shares: 1,
    price: 150,
    currency: "CAD",
  },
};

let cash = 10;

let desiredAllocations = {
  AAPL: 0.4,
  GOOG: 0.4,
  CASH: 0.2,
};

/**
 * END
 */

// Calculate the sum of values
let sum = Object.values(desiredAllocations).reduce((acc, value) => acc + value, 0);

// Check if the sum is above, below, or equal to 100
if (sum > 1) {
  console.log(`Your portfolio allocation is above 100%: ${sum}`);
} else if (sum < 1) {
  console.log(`Your portfolio allocation is below 100%: ${sum}`);
} else {
  console.log(`Your portfolio allocation is equal to 100%: ${sum}`);
}

console.log(`\n`);

function rebalancePortfolio(portfolio, cash, desiredAllocations) {
  portfolio["CASH"] = {
    shares: cash,
    price: 1, // Cash value always equals its amount
    currency: "CAD",
  };

  let totalValue = 0;
  for (let ticker in portfolio) {
    totalValue +=
      portfolio[ticker].price *
      portfolio[ticker].shares *
      EXCHANGE_RATES[portfolio[ticker].currency];
  }

  console.log(`Total portfolio value: ${totalValue.toFixed(2)}$ CAD`);

  for (let ticker in portfolio) {
    let currentValue =
      portfolio[ticker].price *
      portfolio[ticker].shares *
      EXCHANGE_RATES[portfolio[ticker].currency];
    let currentPercentage = (currentValue / totalValue) * 100;
    console.log(
      `Current percentage of ${ticker}: ${currentPercentage.toFixed(2)}%`
    );
  }

  let transactions = {};

  for (let ticker in desiredAllocations) {
    let desiredValue = totalValue * desiredAllocations[ticker];
    let currentValue =
      (portfolio[ticker]?.price || 0) *
      (portfolio[ticker]?.shares || 0) *
      EXCHANGE_RATES[portfolio[ticker]?.currency || "CAD"];
    let diffValue = desiredValue - currentValue;
    let diffShares =
      diffValue /
      ((portfolio[ticker]?.price || 1) *
        EXCHANGE_RATES[portfolio[ticker]?.currency || "CAD"]);

    if (diffShares > 0) {
      if (
        portfolio["CASH"].shares *
          portfolio["CASH"].price *
          EXCHANGE_RATES[portfolio["CASH"].currency] >=
        diffValue
      ) {
        portfolio["CASH"].shares -=
          diffValue / EXCHANGE_RATES[portfolio["CASH"].currency];
        transactions[ticker] = `Buy ${diffShares.toFixed(
          2
        )} shares of ${ticker}`;
      } else {
        transactions[ticker] = `Not enough cash to buy ${diffShares.toFixed(
          2
        )} shares of ${ticker}`;
      }
    } else if (diffShares < 0) {
      portfolio["CASH"].shares -=
        diffValue / EXCHANGE_RATES[portfolio["CASH"].currency]; // Add the amount to cash
      transactions[ticker] = `Sell ${(-diffShares).toFixed(
        2
      )} shares of ${ticker}`;
    } else {
      transactions[ticker] = `No action required for ${ticker}`;
    }
  }

  return transactions;
}

console.log(`DESIRED RATIO : `);

for (let key in desiredAllocations) {
  if (desiredAllocations.hasOwnProperty(key)) {
    let value = desiredAllocations[key];
    console.log(`${key} : ${value * 100}%`);
  }
}

console.log(`\n`);

console.log(rebalancePortfolio(portfolio, cash, desiredAllocations));
