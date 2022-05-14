import {rinkeby as wallet} from '../src'

const amount = process.argv[2]

;(async () => {
    await wallet.init(process.env.PRIVATE_KEY!)
    console.log('initialized wallet')
    console.log('starting deposit...')
    await wallet.deposit({token: 'ETH', amount})
    console.log(`deposited ${amount} to ${wallet.wallet.address()} on zksync ${wallet.wallet.provider.network}`)
})()