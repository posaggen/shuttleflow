import React, { useState } from 'react'
import useStyle from '../component/useStyle'
import inputStyles from '../component/input.module.scss'
import buttonStyles from '../component/button.module.scss'
import formStyles from './Form.module.scss'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { object } from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import Header from './FormHeader'
import PaddingContainer from '../component/PaddingContainer/PaddingContainer'
import Toggle from '../component/Toggle/Toggle'
import createInput from './createInput'
import getFields from './fields'
import Modal from '../component/Modal'

export default function CaptainForm({
  pendingCount,
  countdown,
  address,
  icon,
  beCaptain,
  cethBalanceBig,
  burn_fee,
  mint_fee,
  minimal_burn_value,
  minimal_mint_value,
  reference_symbol,
  reference_name,
  wallet_fee,
  supported,
  sponsor,
  decimals,
  minMortgageBig,
  currentMortgageBig,
  defaultMortgageBig,
  cethBalanceDisplay,
}) {
  const { t } = useTranslation(['captain'])
  const [inputCx, buttonCx, formCx] = useStyle(
    inputStyles,
    buttonStyles,
    formStyles
  )
  const [mortgagePopup, setMortgagePopup] = useState(false)

  function clickLabel() {
    setMortgagePopup(true)
  }
  const isMe = address === sponsor
  const [showMortgage, setShowMortgage] = useState(!isMe)

  const onSubmit = (data) => {
    // return
    console.log(data)
    beCaptain({
      amount: data.mortgage_amount,
      burnFee: data.burn_fee,
      mintFee: data.mint_fee,
      walletFee: data.wallet_fee,
      minimalMintValue: data.minimal_mint_value,
      minimalBurnValue: data.minimal_burn_value,
    })
  }
  const fields = getFields({
    reference_symbol,
    mint_fee,
    burn_fee,
    countdown,
    decimals,
    minimal_burn_value,
    minimal_mint_value,
    wallet_fee,
    showMortgage,
    cethBalanceBig,
    defaultMortgageBig,
  })

  const { defaultValues, schema } = fields.reduce(
    (pre, { name, defaultValue, validate }) => {
      if (validate) {
        pre.schema[name] = validate
      }
      pre.defaultValues[name] = defaultValue
      return pre
    },
    { defaultValues: {}, schema: {} }
  )

  const { register, handleSubmit, errors, setValue } = useForm({
    resolver: yupResolver(object().shape(schema)),
    shouldUnregister: true,
    defaultValues,
    mode: 'onSubmit',
  })
  const inputCtx = { errors, register, inputCx, formCx, t }
  return (
    <>
      <PaddingContainer bottom top>
        <Header
          {...{
            icon,
            formCx,
            t,
            reference_symbol,
            reference_name,
            supported,
            currentMortgageBig,
            sponsor,
            pendingCount,
            countdown,
          }}
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          {fields
            .slice(0, 5)
            .map((props) => createInput({ ...props, ...inputCtx }))}
          {isMe && (
            <div className={formCx('update', 'input-container')}>
              <span>{t('update-mortgage')}</span>
              <Toggle
                value={showMortgage}
                onChange={() => setShowMortgage((x) => (x = !x))}
              ></Toggle>
            </div>
          )}
          {showMortgage && (
            <>
              {createInput({ ...inputCtx, ...fields[5], clickLabel })}
              <div className={formCx('small-text', 'bottom-text')}>
                <div>
                  {t('min-mortgage', { minMortgage: minMortgageBig + '' })}
                </div>
                <div>
                  <span>
                    {t('ceth-balance', { amount: cethBalanceDisplay })}
                  </span>
                  <span
                    onClick={() => {
                      setValue('mortgage_amount', cethBalanceBig)
                    }}
                    className={formCx('all')}
                  >
                    {t('all')}
                  </span>
                </div>
              </div>
            </>
          )}

          <input
            type="submit"
            value={!showMortgage ? t('update') : t('be-captain')}
            className={buttonCx('btn') + ' ' + formCx('btn')}
          />
        </form>
      </PaddingContainer>
      <Modal
        show={mortgagePopup}
        onClose={() => setMortgagePopup(false)}
        title="Mortgage popup"
      ></Modal>
    </>
  )
}
