import { AccountLockProvider } from "../business/interfaces/AccountLockProvider"
import { Mutex, MutexInterface } from "async-mutex"

/**
 * Lock provider that utilizes the library `async-mutex` to create VM-level
 * mutexes. It is not ideal, as it has no timeout for locks and no secret to
 * free locks, but it's good for simplicity and it's enough to avoid basic
 * race conditions.
 *
 * It also implements idempotent releasing of mutexes by using a `Releaser`
 * function that can be sent as the secret.
 */
export class AccountInMemoryLockProvider implements AccountLockProvider<MutexInterface.Releaser> {
    private mutexes: Map<string, MutexInterface>

    constructor() {
        this.mutexes = new Map()
    }

    async acquireLock(accountId: string): Promise<MutexInterface.Releaser> {
        if (!this.mutexes.has(accountId)) {
            console.log(`No locks for account ${accountId}, creating...`)
            this.mutexes.set(accountId, new Mutex())
        }

        console.log(`Requesting lock for ${accountId}...`)
        const release = await this.mutexes.get(accountId)?.acquire()
        console.log(`Acquired lock for ${accountId}!`)

        return release!
    }

    freeLock(accountId: string, release: MutexInterface.Releaser) {
        console.log(`Trying to release lock for ${accountId}`)
        release()

        console.log(`Validating: lock for ${accountId} is locked: ${this.mutexes.get(accountId)?.isLocked()}`)
    }

}