
export interface AccountLockProvider<T> {

    /**
     * Acquire a mutually exclusive lock that blocks access to an account.
     *
     * This lock should be used for operations that modify values, like
     * deposits, withdrawals or transfers.
     *
     * After you are done with the account, you should free the lock. To do so,
     * you need to send back the value received when acquiring the lock.
     *
     * @param accountId The Account ID to lock
     * @returns A value that should be used to free the lock
     */
    acquireLock(accountId: string): Promise<T>

    /**
     * Free a mutually exclusive lock that was previously acquired.
     *
     * To free a lock, you need the lock data received from the acquireLock
     * method.
     *
     * Freeing a lock is an idempotent action.
     *
     * @param accountId The Account ID to free the lock from
     * @param lock The value received when the lock was acquired
     */
    freeLock(accountId: string, lock: T): void
}
