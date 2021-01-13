import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../component/Button/Button'

import PaddingContainer from '../component/PaddingContainer/PaddingContainer'
import pocket from '../component/pocket.png'
import TokenList from './TokenList'
import Search from './Search'

import useStyle from '../component/useStyle'
import chooseStyles from './Choose.module.scss'
import useUrlSearch from '../data/useUrlSearch'
import useIsSamll from '../component/useSmallScreen'
import { useHistory } from 'react-router'

export default function ChooseToken({ captain, cToken, next }) {
  const [chooseCx] = useStyle(chooseStyles)
  const [searchTxt, setSearchTxt] = useState('')
  const [isNotAvailable, setIsNotAvailable] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const { token } = useUrlSearch()
  const isSmall = useIsSamll()
  const history = useHistory()
  const { t } = useTranslation(['token'])

  return (
    <div className={chooseCx('container')}>
      <PaddingContainer bottom={false}>
        <Search searchTxt={searchTxt} setSearchTxt={setSearchTxt} />
      </PaddingContainer>
      <TokenList
        search={searchTxt}
        frequent={!captain}
        captain={captain}
        cToken={cToken}
        notFound={notFound}
        setNotFound={setNotFound}
        setIsNotAvailable={setIsNotAvailable}
      />

      {!notFound && (
        <PaddingContainer>
          {[
            <Button
              key="btn"
              className={chooseCx('btn')}
              onClick={() => {
                history.push(
                  isNotAvailable
                    ? `/captain/${token}`
                    : typeof next === 'function'
                    ? next(token)
                    : next
                )
              }}
              disabled={captain ? !token : !token && !isNotAvailable}
            >
              {captain
                ? t('be-captain')
                : t(isNotAvailable ? 'add-token' : 'choose-btn')}
            </Button>,
            !captain && (
              <div
                key="benefit"
                className={chooseCx('benefit')}
                onClick={() => {
                  window.open(`/captain/${token ? token : ''}`, '_blank')
                }}
              >
                {t('captain-benefit')}
                <img
                  className={chooseCx('pocket')}
                  src={pocket}
                  alt="pocket"
                ></img>
              </div>
            ),
          ][isSmall ? 'reverse' : 'slice']()}
        </PaddingContainer>
      )}
    </div>
  )
}
