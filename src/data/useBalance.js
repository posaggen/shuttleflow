import { useEffect, useState } from 'react'
import { getBalanceContract } from './contract'
import useAddress from './useAddress'
// export default function useBalance() {
//   const [] = useState([])
//   useEffect(() => {}, [])
// }

export function useBalance(tokenAddr) {
  const [balance, setBalance] = useState('')
  const address = useAddress()
  useEffect(() => {
    if (address && tokenAddr) {
      getBalanceContract()
        ?.tokenBalance(address, tokenAddr)
        .call()
        .then((x) => {
          setBalance(x && x.toString())
        })
    }
  }, [address, tokenAddr])
  return balance
}