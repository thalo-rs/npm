# Thalo NPM

NPM package for working with Thalo in TypeScript.

## Example

```ts
import type { Aggregate } from "thalo";
// generated with https://crates.io/crates/esdl
import {
  BankAccountEvent,
  BankAccountCommand,
  OpenedAccountEvent,
  DepositedFundsEvent,
  WithdrewFundsEvent,
} from "./bank-account-schema";

export class BankAccount
  implements Aggregate<BankAccount, BankAccountEvent, BankAccountCommand>
{
  id: string;
  opened: boolean;
  balance: number;

  $new(id: string): BankAccount {
    let bank_account = new BankAccount();
    bank_account.id = id;
    return bank_account;
  }

  $apply(event: BankAccountEvent): void {
    switch (event.$type) {
      case "OpenedAccount":
        this.opened = true;
        this.balance = event.initial_balance;
        break;

      case "DepositedFunds":
        this.balance += event.amount;
        break;

      case "WithdrewFunds":
        this.balance -= event.amount;
        break;
    }
  }

  open_account(initial_balance: number): OpenedAccountEvent {
    if (initial_balance < 0) {
      throw new Error("initial balance must be greater than 0");
    }

    if (this.opened) {
      throw new Error("account already opened");
    }

    return { $type: "OpenedAccount", initial_balance };
  }

  deposit_funds(amount: number): DepositedFundsEvent {
    if (!this.opened) {
      throw new Error("account not opened");
    }

    if (amount <= 0) {
      throw new Error("amount must not be negative");
    }

    return { $type: "DepositedFunds", amount };
  }

  withdraw_funds(amount: number): WithdrewFundsEvent {
    if (!this.opened) {
      throw new Error("account not opened");
    }

    if (amount <= 0) {
      throw new Error("amount must not be negative");
    }

    const new_balance = this.balance - amount;
    if (new_balance < 0.0) {
      throw new Error("insufficient balance for withdrawal");
    }

    return { $type: "WithdrewFunds", amount };
  }
}
```
