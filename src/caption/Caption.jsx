import MainContainer from '../component/MainContainer/MainContainer'
import useStyle from '../component/useStyle'
import Choose from '../token/Choose'
import styles from './Caption.module.scss'
import CaptionForm from './Form'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Caption(props) {
  const {
    match: { url, path },
  } = props
  const [cx] = useStyle(styles)
  const fullHeight = useRouteMatch({ path, exact: true })

  return (
    <MainContainer
      styles={{ minHeight: '100%' }}
      className={fullHeight ? cx('container') : ''}
    >
      <Switch>
        <Route exact path={path}>
          <div className={cx('container')}>
            <Choose next={(token) => `${url}/${token}`} caption />
          </div>
        </Route>
        <Route path={`${path}/:erc20`}>
          <CaptionForm />
        </Route>
      </Switch>
    </MainContainer>
  )
}
