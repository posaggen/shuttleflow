import jsonrpc from './jsonrpc'
import { getContract } from './contract/contract'
import Big from 'big.js'
import useSWR from 'swr'
import useAddress from './useAddress'
import CHAIN_CONFIG from '../config/chainConfig'
import { useParams } from 'react-router'
import { ZERO_ADDR } from '../config/config'
import { getTokenList } from './tokenList'

//txHash is used to flush data from server
export default function useCaptain(tokenInfo) {
  const address = useAddress()
  const { chain } = useParams()
  return useSWR(
    tokenInfo
      ? [
          'captain',
          tokenInfo.reference,
          tokenInfo.ctoken,
          address,
          chain,
          tokenInfo.decimals,
          tokenInfo.origin,
        ]
      : null,
    fetcher,
    {
      suspense: true,
    }
  ).data
}

//todo: Shuttle in/out page still read from API rather than the contract
//some level of inconsistancy, tend to be fixed when reverse captain roll out
//The meaning of mint/burn and in/out is a mess currectly
//expect to be sorted out in the future
function fetcher(key, reference, ctoken, address, chain, decimals, origin) {
  let toCfxOrFromCfx, referenceOrCtoken, _in, _out
  if (origin === 'cfx') {
    toCfxOrFromCfx = 'fromCfx'
    referenceOrCtoken = ctoken
    if (referenceOrCtoken === 'cfx') {
      referenceOrCtoken = ZERO_ADDR
    }
    _in = 'burn'
    _out = 'mint'
  } else {
    toCfxOrFromCfx = 'toCfx'
    referenceOrCtoken = reference
    _in = 'mint'
    _out = 'burn'
  }

  return getTokenList(chain).then(({ tokenMap }) => {
    const { mainPair } = CHAIN_CONFIG[chain]
    const mairPairInfo = tokenMap[mainPair]
    const { symbol: mainPairSymbol, ctoken: mainPairCtoken } = mairPairInfo
    console.log(mairPairInfo)
    return Promise.all([
      jsonrpc('getPendingOperationInfo', {
        url: 'node',
        params: [referenceOrCtoken],
      }),
      getContract(`custodian.${toCfxOrFromCfx}.${chain}`).then((c) => {
        return Promise.all(
          [
            c.burn_fee(referenceOrCtoken),
            c.mint_fee(referenceOrCtoken),
            c.wallet_fee(referenceOrCtoken),
            c.minimal_mint_value(referenceOrCtoken),
            c.minimal_burn_value(referenceOrCtoken),
            c.token_cooldown(referenceOrCtoken),
            c.minimal_sponsor_amount(),
            c.default_cooldown(),
            c.safe_sponsor_amount(),
          ].map((fn) => fn.call())
        )
      }),
      getContract(`sponsor.${toCfxOrFromCfx}.${chain}`).then((c) => {
        return Promise.all(
          [
            c.sponsorOf(referenceOrCtoken),
            c.sponsorValueOf(referenceOrCtoken),
          ].map((fn) => fn.call())
        )
      }),

      getContract('balance').then((c) => {
        return c.tokenBalance(address, mainPairCtoken).call()
      }),
    ]).then(([pendingInfo, custodianData, sponsorData, myBaclance]) => {
      const { cnt } = pendingInfo || { cnt: 0 }
      const [
        burn_fee,
        mint_fee,
        wallet_fee,
        minimal_mint_value,
        minimal_burn_value,
        token_cooldown,
        minimal_sponsor_amount,
        default_cooldown,
        safe_sponsor_amount,
      ] = custodianData.map((x) => Big(x + ''))

      const values = {
        burn_fee,
        mint_fee,
        wallet_fee,
        minimal_mint_value,
        minimal_burn_value,
      }

      const sponsor = sponsorData[0]
      const sponsorValue = Big(sponsorData[1] + '')
      // displayed in popup
      const default_cooldown_minutes = parseInt(default_cooldown) / 60

      const diff = parseInt(Date.now() / 1000 - parseInt(token_cooldown))

      return {
        pendingCount: cnt,
        out_fee: values[`${_out}_fee`].div(`1e${decimals}`),
        in_fee: values[`${_in}_fee`].div(`1e${decimals}`),
        wallet_fee: wallet_fee.div(`1e${decimals}`),
        minimal_in_value: values[`minimal_${_in}_value`].div(`1e${decimals}`),
        minimal_out_value: values[`minimal_${_out}_value`].div(`1e${decimals}`),
        minMortgage: minimal_sponsor_amount,
        default_cooldown_minutes,
        countdown: Math.max(0, parseInt(default_cooldown + '') - diff),
        cethBalance: Big(myBaclance + '').div('1e18'),
        sponsor,
        currentMortgage: sponsorValue.div('1e18'),
        safeSponsorAmount: safe_sponsor_amount.div('1e18'),
        mainPairSymbol,
      }
    })
  })
}
