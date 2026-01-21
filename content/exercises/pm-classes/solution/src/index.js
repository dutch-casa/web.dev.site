// Solution

class Counter {
  constructor(initial = 0) {
    this.initial = initial;
    this.count = initial;
  }

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }

  reset() {
    this.count = this.initial;
  }

  getCount() {
    return this.count;
  }
}

class BankAccount {
  constructor(owner, balance = 0) {
    this.owner = owner;
    this.balance = balance;
  }

  deposit(amount) {
    this.balance += amount;
    return this.balance;
  }

  withdraw(amount) {
    if (amount > this.balance) {
      throw new Error("Insufficient funds");
    }
    this.balance -= amount;
    return this.balance;
  }

  getBalance() {
    return this.balance;
  }

  static createJointAccount(account1, account2) {
    const combined = account1.getBalance() + account2.getBalance();
    return new BankAccount("Joint", combined);
  }
}

module.exports = { Counter, BankAccount };
