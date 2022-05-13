describe('Accounts', () => {
  it('initializes providers', async () => {
    expect(zksync.providers).toEqual(providers)
  })

  it.skip('init an account on mainnet', async () => {
    await zksync.init(process.env.PRIVATE_KEY!)
    console.log(zksync.wallet)
    expect(zksync.wallet).toBeDefined()
  })
})
