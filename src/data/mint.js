import { getErc20Contract } from './contract'
import jsonrpc from './jsonrpc'

export default function mint(addr, amount, chain, ctoken) {
  let selectedAddress = window.conflux.selectedAddress
  addr = addr
  ctoken = ctoken
  selectedAddress = selectedAddress

  return jsonrpc('getUserWallet', {
    url: 'node',
    params: [
      addr,
      '0x0000000000000000000000000000000000000000',
      'cfx',
      chain,
      'out',
    ],
  }).then((address) => {
    if (ctoken === 'cfx') {
      return window.confluxJS
        .sendTransaction({
          from: selectedAddress,
          to: address,
          value: amount,
        })
        .then((e) => {
          console.log(e)
          return e
        })
    } else {
      return getErc20Contract()
        .transfer(address, amount)
        .sendTransaction({
          from: selectedAddress,
          to: ctoken,
        })
        .then((e) => {
          console.log(e)
          return e
        })
    }
  })
}
