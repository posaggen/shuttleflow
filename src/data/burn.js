import { getContract } from './contract'

export default function burn(addr, ctoken, amount, burnfee) {
  let selectedAddress = window.conflux.selectedAddress

  return getContract('erc777').then((c) => {
    c.burn(
      selectedAddress,
      amount,
      burnfee,
      addr,
      '0x0000000000000000000000000000000000000000'
    ).sendTransaction({ from: selectedAddress, to: ctoken })
  })
}
