import {ZkSyncAccount} from '../account'

describe('Accounts', () => {
  const zksync = new ZkSyncAccount('rinkeby')

  describe('init', () => {
    it('initializes wallet', async () => {
      await zksync.init({})

      expect(zksync.wallet).toBeDefined()
      expect(zksync.wallet.cachedAddress.toLowerCase()).toBe('0xa573e709580bcf734cf4e48d496231ca687e809b')
      expect(zksync.wallet.provider.network).toBe('rinkeby')

      expect(await zksync.wallet.ethSigner().provider).not.toBeNull()

    })

    it('checks if a wallet has enough funds for a registration tx', async () => {
      const isEnoughFunded = await zksync.isEnoughFundedToRegister()
      expect(typeof isEnoughFunded).toBe('boolean')
    })

  })


})
