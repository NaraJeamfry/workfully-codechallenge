import { Account } from "../../business/entities/Account"


describe('Account.getDepositedToday', () => {
    it('should returns depositedToday when 0', () => {
        const account = new Account("a", {lastDepositDay: new Date()})
        expect(account.getDepositedToday()).toBe(0)
    })
    it('should returns depositedToday as 0 when no lastDepositDay', () => {
        const account = new Account("a", {depositedToday: 100})
        expect(account.getDepositedToday()).toBe(0)
    })
    it('should returns depositedToday when non 0', () => {
        const account = new Account("a", {
            depositedToday: 100.0,
            lastDepositDay: new Date(new Date().setUTCHours(0, 0, 0, 0))
        })

        expect(account.getDepositedToday()).toBe(100.0)
    })
    it('should returns depositedToday with time in lastDepositDay', () => {
        const account = new Account("a", {
            depositedToday: 100.0,
            lastDepositDay: new Date()
        })

        expect(account.getDepositedToday()).toBe(100.0)
    })
    it('should returns depositedToday as 0 when lastDepositDay is old', () => {
        const account = new Account("a", {
            depositedToday: 100.0,
            lastDepositDay: new Date("2023-12-11")
        })

        expect(account.getDepositedToday(new Date("2023-12-13"))).toBe(0)
    })
})

describe('Account.depositMoney', () => {
    it('should update the balance', () => {
        const account = new Account("a", {
            balance: 100.0
        })

        account.depositMoney(100.0)

        expect(account.balance).toBe(200.0)
    })
    it('should update the depositedToday value', () => {
        const account = new Account("a", {
            depositedToday: 100.0,
            lastDepositDay: new Date("2023-12-11")
        })

        account.depositMoney(100.0)

        expect(account.depositedToday).toBe(200.0)
        expect(account.lastDepositDay! > new Date("2023-12-11")).toBeTruthy()
    })
})

describe('Account.withdrawMoney', () => {
    it('should update the balance', () => {
        const account = new Account("a", {
            balance: 100.0
        })

        account.withdrawMoney(100.0)

        expect(account.balance).toBe(0.0)
    })
})