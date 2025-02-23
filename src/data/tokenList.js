import jsonrpc from './jsonrpc'
import listItemMapper from './tokenListMapper'
//todo replace with real server api
const getListAPI = (chain) => {
  return jsonrpc('getTokenList', { url: 'sponsor', params: [chain] })
}

const chainDataStore = {}

function buildMap(tokenList) {
  const tokenMap = tokenList.reduce((pre, cur) => {
    if (cur.reference) {
      pre[cur.reference.toLowerCase()] = { ...cur, fromRef: true } //operation history data
    }
    if (cur.ctoken) {
      pre[cur.ctoken] = { ...cur, fromCtoken: true } //operation history data
    }
    return pre
  }, {})
  return { tokenList, tokenMap }
}

//lazy initializtion with cache
export const getTokenList = (chain) => {
  if (!chainDataStore[chain]) {
    chainDataStore[chain] = getListAPI(chain)
      .then((list) => list.map(listItemMapper))
      .then(buildMap)
  }
  return chainDataStore[chain]
}

//It can be updated dynamicallt when searched token come through
export function updateTokenList(chain, data) {
  return (chainDataStore[chain] = chainDataStore[chain].then(
    ({ tokenList }) => {
      return buildMap([...tokenList, listItemMapper(data)])
    }
  ))
}
