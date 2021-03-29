import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import useSWR from 'swr'
import { getTokenList } from './tokenList'
import useAddress from './useAddress'
import jsonrpc from '../data/jsonrpc'
import { getIdFromSponsorInfo } from '../util/id'

export default function useMyCaptain() {
  const address = useAddress()
  const { chain } = useParams()
  console.log('useMyCaptain', chain)
  return useSWR(['useMyCaptain', chain, address], fetcher, {
    revalidateOnMount: true,
    suspense: true,
  })
}

function fetcher(key, chain, address) {
  return Promise.all([
    getTokenList(chain),
    jsonrpc('getSponsorInfo', { url: 'sponsor', params: [address] }),
  ]).then(([{ tokenMap }, tokens]) => {
    console.log('tokens', tokens)
    return tokens
      .filter(({ origin, to_chain }) => origin === chain || to_chain === chain)
      .map((tokenInfo) => {
        const { status } = tokenInfo
        const pairId = getIdFromSponsorInfo(tokenInfo)
        return { ...tokenMap[pairId], status }
      })
      .sort(({ status }) => {
        if (status === 'done') {
          return 1
        } else {
          return -1
        }
      })
  })
}
