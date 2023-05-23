'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ''; // <----- Empties the container

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements">
      <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => (acc += mov), 0);
  labelSumIn.textContent = `${income}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => (acc += mov), 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(depopsit => (depopsit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => (acc += int), 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// Event handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

// TRANSFER FUNCTION
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});

// LOAN FUNCTION
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

// CLOSE FUNCTION
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    //Delete account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/*
let arr = ['a', 'b', 'c', 'd', 'e'];

// SLICE
console.log('SLICE - does not mutate => makes a shallow copy');
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice());
console.log([...arr]);

// SPLICE
console.log('SPLICE - does mutate');
// console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);
arr.splice(1, 2);
console.log(arr);

// REVERSE
console.log('REVERSE - does mutate');
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());

// CONCAT
console.log('CONCAT - does not mutate original array');
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

// JOIN
console.log('JOIN - creates a string');
console.log(letters.join('-'));



const arr = [23, 11, 64];
console.log(arr[0]); // Old way
console.log(arr.at(0));

// getting last array element
console.log(arr[arr.length - 1]); // Old way
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));

console.log('jonas'.at(0));
console.log('jonas'.at(-1));


// forEach
// for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
}

console.log('------FOREACH-------');

//forEach does a CALLBACK! OBS! and also you cannot use continue or break in forEach it will loop the whole array always.

movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Movement ${i + 1}: You deposited ${mov}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
  }
});
// 0: function(200)
// 1: function(450)
// 2: function(400)
// ...


// Map forEach
currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

// Set forEach
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}: ${value}`);
});
*/

/*
Coding Challenge #1

Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Your tasks:

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the first and the last two dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)

2. Create an array with both Julia's (corrected) and Kate's data

3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶 ")

4. Run the function for both test datasets

Test data:
§ Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
§ Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

Hints: Use tools from all lectures in this section so far 😉

GOOD LUCK 😀


const juliaData1 = [3, 5, 2, 12, 7];
const kateData1 = [4, 1, 15, 8, 3];

const juliaData2 = [9, 16, 6, 8, 3];
const kateData2 = [10, 5, 6, 1, 4];

const checkDogs = function (dogsAgeJulia, dogsAgeKate) {
  const onlyJuliaDogsAge = dogsAgeJulia.slice(1, -2);

  const dogsAgesDataCombined = [...onlyJuliaDogsAge, ...dogsAgeKate];

  dogsAgesDataCombined.forEach(function (dogsAge, i) {
    const dogsMaturity =
      dogsAge >= 3
        ? `Dog number ${i + 1} is an adult, and is ${dogsAge} years old`
        : `Dog number ${i + 1} is still a puppy 🐶 `;

    console.log(dogsMaturity);
  });
};

checkDogs(juliaData1, kateData1);
console.log('----------DATA 2------------');
checkDogs(juliaData2, kateData2);
*/

/*
//----------array.map METHOD----------

const eurToUsd = 1.1;

// array.map does not mutate the original array!!
// const movementsUsd = movements.map(function (mov) {
//   return mov * eurToUsd;
// });

const movementsUsd = movements.map(mov => mov * eurToUsd);
console.log(movements);
console.log(movementsUsd);

const movementsUSDfor = [];
for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
console.log(movementsUSDfor);

const movementsDescriptions = movements.map((mov, i) => {
  return `Movement ${i + 1}: You ${
    mov > 0 ? 'depostied' : 'withdrew'
  } ${Math.abs(mov)}`;
});

console.log(movementsDescriptions);
*/

/*
//----------array.filter() METHOD---------------

const deposits = movements.filter(mov => mov > 0);
console.log(movements);
console.log(deposits);

const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);
console.log(depositsFor);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);
*/

/*
// ---------array.reduce() METHOD---------------
console.log(movements);

//arra.reduce( function(accumulator, current value, index, whole array){}, accumulators starting value);

// accumulator -> SNOWBALL
const balance = movements.reduce(
  (acc, cur) => acc + cur,
  0 //<---------- acc starting value
);
console.log(balance);

let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2);

// Maximum value
const max = movements.reduce(
  (acc, mov) => (acc > mov ? acc : mov),
  movements[0]
);
console.log(max);
*/

/*
Coding Challenge #2
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Your tasks:
Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4

2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)

3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)

4. Run the function for both test datasets

Test data:
§ Data 1: [5, 2, 4, 1, 15, 8, 3]
§ Data 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀


const calcAverageHumanAge = function (dogAges) {
  const humanAgesOfAdultDogs = dogAges
    .map(dogAge => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
    .filter(humanAge => humanAge >= 18);

  // const averageHumanAgeOfAdultDogs =
  //   humanAgesOfAdultDogs.reduce(
  //     (acc, youngAdultAge) => (acc += youngAdultAge),
  //     0
  //   ) / humanAgesOfAdultDogs.length;

  const averageHumanAgeOfAdultDogs = humanAgesOfAdultDogs.reduce(
    (acc, youngAdultAge) =>
      (acc += youngAdultAge / humanAgesOfAdultDogs.length),
    0
  );

  return averageHumanAgeOfAdultDogs;
};

const average1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const average2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

console.log(average1, average2);
*/

/*
//---------CHAINING-----------
const eurToUsd = 1.1;

// PIPELINE
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => {
    // console.log(arr);
    return mov * eurToUsd;
  })
  // .map(mov => mov * eurToUsd)
  .reduce((acc, mov) => (acc += mov), 0);

console.log(totalDepositsUSD);
*/

/*
Coding Challenge #3

Rewrite the 'calcAverageHumanAge' function from Challenge #2, but this time as an arrow function, and using chaining!

Test data:
§ Data 1: [5, 2, 4, 1, 15, 8, 3]
§ Data 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

/*
const calcAverageHumanAge = dogAges =>
  dogAges
    .map(dogAge => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
    .filter(humanAge => humanAge >= 18)
    .reduce(
      (acc, youngAdultAge, i, arr) => (acc += youngAdultAge / arr.length),
      0
    );

const average1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const average2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

console.log(average1, average2);
*/

/*
// Array find method = Returns first element that fulfill the requirment
const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);


// ------------- Array method some(callback) and every(callback);-----------------
console.log(movements);

// EQUALITY
console.log(movements.includes(-130));

// CONDITION
console.log(movements.some(mov => mov === -130));

const anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits);

// EVERY
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

// Separate callback
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

//------------flat and flatMap----------
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

// flat
const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

console.log(overallBalance);

// flatMap
const overallBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);

console.log(overallBalance2);


//------------sort() method Array--------

// Strings
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort()); // <-------- sort() mutates
console.log(owners);

// Numbers
console.log(movements);
// sort() numbers converts it to string and then sorts
// console.log(movements.sort());

// return < 0, A(400), B(-450) (keep order)
// return > 0, B(-450), A(400) (switch order)

// Ascending
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (b > a) return -1;
// });
movements.sort((a, b) => a - b);
console.log(movements);

// Descending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (b > a) return 1;
// });
movements.sort((a, b) => b - a);
console.log(movements);


//-----------Array.from() how to create programatically an a array-------------

const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// Empty arrays + fill method
const x = new Array(7);
console.log(x);
//console.log(x.map(() => 5)); // <--- does not work on this [ empty x 7]

x.fill(1); // <-------- Works because it mutates.
x.fill(1, 3, 5);
console.log(x);

arr.fill(23, 2, 6);
console.log(arr);

// Array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

labelBalance.addEventListener('click', function (e) {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );

  console.log(movementsUI);

  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
});


///////////////////////////////////////////////////

//---------------Array excersice-------------------

// 1.
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);

console.log(bankDepositSum);

// 2.
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;

const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);

console.log(numDeposits1000);

// Prefixed ++ operator
let a = 10;
console.log(a++);
console.log(a);

// 3.
const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals);

// 4.
// this is a nice titel -> This Is a Nice Title
const convertTitelCase = function (titel) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = ['a', 'an', 'the', 'and', 'but', 'or', 'on', 'in', 'with'];

  const titelCase = titel
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(titelCase);
};
console.log(convertTitelCase('this is a nice titel'));
console.log(convertTitelCase('this is a LONG titel but not too long'));
console.log(convertTitelCase('and here is another titel with an EXAMPLE'));
*/

/*
Coding Challenge #4

Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the
recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10%
above and 10% below the recommended portion (see hint).

Your tasks:
1. Loop over the 'dogs' array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do not create a new array, simply loop over the array. Formula:
recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)

2. Find Sarah's dog and log to the console whether it's eating too much or too
little. Hint: Some dogs have multiple owners, so you first need to find Sarah in
the owners array, and so this one is a bit tricky (on purpose) 🤓

3. Create an array containing all owners of dogs who eat too much
('ownersEatTooMuch') and an array with all owners of dogs who eat too little
('ownersEatTooLittle').

4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"

5. Log to the console whether there is any dog eating exactly the amount of food
that is recommended (just true or false)

6. Log to the console whether there is any dog eating an okay amount of food
(just true or false)

7. Create an array containing the dogs that are eating an okay amount of food (try to reuse the condition used in 6.)

8. Create a shallow copy of the 'dogs' array and sort it by recommended food
portion in an ascending order (keep in mind that the portions are inside the
array's objects 😉)

Hints:
§ Use many different tools to solve these challenges, you can use the summary
lecture to choose between them 😉

§ Being within a range 10% above and below the recommended portion means:
current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.
*/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

const convertToKg = curFood => curFood / 100;

const dogMaxFoodPor = recommendedFood => recommendedFood * 0.9;
const dogMinFoodPor = recommendedFood => recommendedFood * 1.1;

const dogEatsTooLittle = (curFood, recommendedFood) =>
  curFood < dogMinFoodPor(recommendedFood);
const dogEatsTooMuch = (curFood, recommendedFood) =>
  curFood > dogMaxFoodPor(recommendedFood);

const dogEatsWithinRange = function (dogEatsTooMuch, dogEatsTooLittle) {
  if (dogEatsTooLittle && !dogEatsTooMuch) return 'eats too little';
  if (dogEatsTooMuch && !dogEatsTooLittle) return 'eats too much';
  else return 'eats within range';
};

/*
1. Loop over the 'dogs' array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do not create a new array, simply loop over the array. Formula:
recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
*/

dogs.forEach(function (dog) {
  dog.recommendedFood = Number(((dog.weight ** 0.75 * 28) / 100).toFixed(2));
});

console.log('This is for task 1');
console.log(dogs);

//-- Teachers solution
// dogs.forEach((dog) => (dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28)));

/*
2. Find Sarah's dog and log to the console whether it's eating too much or too
little. Hint: Some dogs have multiple owners, so you first need to find Sarah in
the owners array, and so this one is a bit tricky (on purpose) 🤓
*/

dogs.forEach(function (dog) {
  const convertedKg = convertToKg(dog.curFood);
  // console.log(convertedKg);

  const eatsTooLittle = dogEatsTooLittle(convertedKg, dog.recommendedFood);
  const eatsTooMuch = dogEatsTooMuch(convertedKg, dog.recommendedFood);

  if (dog.owners.includes('Sarah')) {
    console.log(`Sarahs dog ${dogEatsWithinRange(eatsTooMuch, eatsTooLittle)}`);
  }
});

/*
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little
('ownersEatTooLittle').
*/

const { TooMuch, TooLittle } = dogs.reduce(
  (totals, cur) => {
    totals[
      dogEatsTooLittle(convertToKg(cur.curFood), cur.recommendedFood)
        ? 'TooLittle'
        : 'TooMuch'
    ].push(cur.owners);
    return totals;
  },
  { TooMuch: [], TooLittle: [] }
);

console.log('This is for task 3');
console.log(TooMuch, TooLittle);

const ownersEatTooMuch = dogs
  .filter(dog => convertToKg(dog.curFood) > dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => convertToKg(dog.curFood) < dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

/*
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
*/
console.log('This is for task 4');
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

/*
5. Log to the console whether there is any dog eating exactly the amount of food
that is recommended (just true or false)
*/
console.log('This is for task 5');
console.log(dogs.some(dog => convertToKg(dog.curFood) === dog.recommendedFood));

/* 
6. Log to the console whether there is any dog eating an okay amount of food
(just true or false)
*/
console.log('This is for task 6');
console.log(
  dogs.some(
    dog =>
      !dogEatsTooLittle(convertToKg(dog.curFood)) &&
      !dogEatsTooMuch(convertToKg(dog.curFood))
  )
);

/*
7. Create an array containing the dogs that are eating an okay amount of food (try to reuse the condition used in 6.)
*/

// OBS THIS DID NOT FUNCITON!
const dogsEatsWithinRange = dogs.filter(
  dog =>
    !dogEatsTooLittle(convertToKg(dog.curFood), dog.recommendedFood) &&
    !dogEatsTooMuch(convertToKg(dog.curFood), dog.recommendedFood)
);

console.log(dogsEatsWithinRange);
// --------------------------

console.log(
  dogs.filter(
    dog =>
      convertToKg(dog.curFood) > dog.recommendedFood * 0.9 &&
      convertToKg(dog.curFood) < dog.recommendedFood * 1.1
  )
);
/*
8. Create a shallow copy of the 'dogs' array and sort it by recommended food
portion in an ascending order (keep in mind that the portions are inside the
array's objects 😉)
*/

const shallowDogs = [...dogs];
shallowDogs.sort((a, b) => {
  if (a.recommendedFood > b.recommendedFood) return 1;
  if (b.recommendedFood > a.recommendedFood) return -1;
});
console.log(shallowDogs);
// console.log(dogs);

// Teachers solution
const dogsSorted = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(dogsSorted);
