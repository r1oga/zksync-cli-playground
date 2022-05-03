import * as zksync from 'zksync'
import * as ethers from 'ethers'

function handleError() {
  return function (
    target: unknown,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const original = descriptor.value
    descriptor.value = async function (networkName: string) {
      let result
      try {
        result = await original.apply(this, networkName)
      } catch (error) {
        console.log(`Could not connect to ${networkName}`)
        console.log(error)
      }

      return result
    }
    return descriptor
  }
}

class Provider {
  constructor(private networkName: zksync.types.Network) {
  }

  @handleError()
  async zkSync() {
    return zksync.getDefaultProvider(this.networkName)
  }

  @handleError()
  async evm() {
    return ethers.getDefaultProvider(this.networkName)
  }
}

export { Provider }