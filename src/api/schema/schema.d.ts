/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/deposit/{accountId}": {
    /**
     * Deposit money
     * @description Deposit a given amount of money into the given Account.
     */
    post: operations["accountDeposit"];
  };
  "/withdraw/{accountId}": {
    /**
     * Withdraw money
     * @description Withdraw a given amount of money from the given Account.
     */
    post: operations["accountWithdraw"];
  };
  "/transfer/{accountId}": {
    /**
     * Transfer money
     * @description Transfer money from your account to a different account.
     */
    post: operations["accountTransfer"];
  };
  "/account/{accountId}": {
    /**
     * Get current account status
     * @description Returns the current status for the requested Account.
     */
    get: operations["accountStatus"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    /**
     * @example {
     *   "amount": 1234.56
     * }
     */
    DepositRequest: {
      /**
       * Format: float
       * @description Amount to deposit to your account.
       */
      amount: number;
    };
    /**
     * @example {
     *   "accountId": "2ab918d0-c600-4477-ac22-0842907e553f",
     *   "amount": 1234.56,
     *   "balance": 2234.56
     * }
     */
    Deposit: {
      /** Format: uuid */
      accountId: string;
      /**
       * Format: float
       * @description Amount deposited.
       */
      amount: number;
      /**
       * Format: float
       * @description Balance after the deposit.
       */
      balance: number;
    };
    /**
     * @example {
     *   "amount": 42.42
     * }
     */
    WithdrawRequest: {
      /**
       * Format: float
       * @description Amount to withdraw from your account.
       */
      amount: number;
    };
    /**
     * @example {
     *   "accountId": "6d3d2f0e-7e06-4e3d-bcd3-c0177a2ec549",
     *   "amount": 42.42,
     *   "balance": 1042.42
     * }
     */
    Withdrawal: {
      /** Format: uuid */
      accountId: string;
      /**
       * Format: float
       * @description Amount withdrawn from your account.
       */
      amount: number;
      /**
       * Format: float
       * @description Balance after the withdrawal.
       */
      balance: number;
    };
    /**
     * @example {
     *   "toAccount": "e710a3d6-94da-4165-bac4-a21599785bae",
     *   "amount": 100
     * }
     */
    TransferRequest: {
      /**
       * Format: uuid
       * @description Account that will receive the money.
       */
      toAccount: string;
      /**
       * Format: float
       * @description Amount to send to the `toAccount`.
       */
      amount: number;
    };
    /**
     * @example {
     *   "fromAccount": "5a1bd11b-0e56-433f-91cc-f4eb5710882d",
     *   "toAccount": "e710a3d6-94da-4165-bac4-a21599785bae",
     *   "amount": 100,
     *   "balance": 900
     * }
     */
    Transfer: {
      /**
       * Format: uuid
       * @description Account that sent the money.
       */
      fromAccount: string;
      /**
       * Format: uuid
       * @description Account that received the money.
       */
      toAccount: string;
      /**
       * Format: float
       * @description Amount transferred from `fromAccount` to `toAccount`.
       */
      amount: number;
      /**
       * Format: float
       * @description Balance of the `fromAccount` after the transfer.
       */
      balance: number;
    };
    /**
     * @example {
     *   "accountId": "66013ace-d51e-45a2-aec8-2924f7a1861e",
     *   "balance": 1337.2,
     *   "depositedToday": 0,
     *   "limits": {
     *     "dailyDeposit": 5000,
     *     "overdraft": 200
     *   }
     * }
     */
    AccountStatus: {
      /** Format: uuid */
      accountId: string;
      /** Format: float */
      balance: number;
      /**
       * Format: float
       * @description Amount deposited today. An account may have a limit to deposits per day; check the limits object.
       */
      depositedToday?: number;
      /** @description Current limits for the account. */
      limits: {
        /** Format: float */
        dailyDeposit?: number;
        /** Format: float */
        overdraft?: number;
      };
    };
    /** @description An error occurred. This object holds info about the error. */
    GenericError: {
      /** @description Internal error code to identify different errors. */
      errorCode: string;
      /** @description User-readable error message in English, explaining more details. */
      errorMessage: string;
    };
  };
  responses: never;
  parameters: {
    /** @description The ID for the Account. */
    accountId: string;
  };
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export interface operations {

  /**
   * Deposit money
   * @description Deposit a given amount of money into the given Account.
   */
  accountDeposit: {
    parameters: {
      path: {
        accountId: components["parameters"]["accountId"];
      };
    };
    requestBody?: {
      content: {
        "application/json": components["schemas"]["DepositRequest"];
      };
    };
    responses: {
      /** @description Deposit processed successfully. */
      201: {
        content: {
          "application/json": components["schemas"]["Deposit"];
        };
      };
      /** @description An error occurred while processing the deposit. */
      400: {
        content: {
          "application/json": components["schemas"]["GenericError"];
        };
      };
    };
  };
  /**
   * Withdraw money
   * @description Withdraw a given amount of money from the given Account.
   */
  accountWithdraw: {
    parameters: {
      path: {
        accountId: components["parameters"]["accountId"];
      };
    };
    requestBody?: {
      content: {
        "application/json": components["schemas"]["WithdrawRequest"];
      };
    };
    responses: {
      /** @description Withdrawal processed successfully. */
      201: {
        content: {
          "application/json": components["schemas"]["Withdrawal"];
        };
      };
      /** @description An error occurred while processing withdrawal. */
      400: {
        content: {
          "application/json": components["schemas"]["GenericError"];
        };
      };
    };
  };
  /**
   * Transfer money
   * @description Transfer money from your account to a different account.
   */
  accountTransfer: {
    parameters: {
      path: {
        accountId: components["parameters"]["accountId"];
      };
    };
    requestBody?: {
      content: {
        "application/json": components["schemas"]["TransferRequest"];
      };
    };
    responses: {
      /** @description Transfer sent successfully. */
      201: {
        content: {
          "application/json": components["schemas"]["Transfer"];
        };
      };
      /** @description An error occurred while sending money. */
      400: {
        content: {
          "application/json": components["schemas"]["GenericError"];
        };
      };
    };
  };
  /**
   * Get current account status
   * @description Returns the current status for the requested Account.
   */
  accountStatus: {
    parameters: {
      path: {
        accountId: components["parameters"]["accountId"];
      };
    };
    responses: {
      /** @description Account successfully retrieved. */
      200: {
        content: {
          "application/json": components["schemas"]["AccountStatus"];
        };
      };
      /** @description An error occurred while retrieving the account status. */
      400: {
        content: {
          "application/json": components["schemas"]["GenericError"];
        };
      };
    };
  };
}
