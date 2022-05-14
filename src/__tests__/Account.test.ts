describe('Accounts', () => {
    beforeEach(async () => {
        await zksync.init(process.env.PRIVATE_KEY!)

    })

    it('initializes providers', async () => {
        expect(zksync.providers).toEqual(providers)
    })

    it('init an account on rinkeby', async () => {
        expect(zksync.wallet).toBeDefined()
        expect(zksync.wallet.cachedAddress).toBe('0x385a68360B74C70a43Cad647b59B4C9ba6eD8e7E')
        expect(zksync.wallet.provider.network).toBe('rinkeby')
        expect(await zksync.wallet.getAccountId()).toBe(1293371)
    })

    it.skip('deposits ETH from rinkeby to zksync', async () => {
        const balanceBefore = await zksync.wallet.getBalance('ETH')
        await zksync.deposit({ token: 'ETH', amount: '0.001' })
        const balanceAfter = await zksync.wallet.getBalance('ETH')
        expect(balanceBefore > balanceAfter).toBeTruthy()
    })
})
