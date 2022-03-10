import { Provider } from 'react-redux'
import {
  WalletProvider,
  UIProvider,
  AccountProvider,
  PoolProvider,
  MintProvider,
} from '@senhub/providers'

import PageView from 'app/page'
import WidgetView from 'app/widget'

import model from 'app/model'
import configs from 'app/configs'

import 'app/static/styles/index.less'

const {
  manifest: { appId },
} = configs

export const Page = () => {
  return (
    <UIProvider appId={appId} antd>
      <WalletProvider>
        <PoolProvider>
          <MintProvider>
            <AccountProvider>
              <Provider store={model}>
                <PageView />
              </Provider>
            </AccountProvider>
          </MintProvider>
        </PoolProvider>
      </WalletProvider>
    </UIProvider>
  )
}

export const widgetConfig: WidgetConfig = {
  size: 'small',
  type: 'solid',
}

export const Widget = () => {
  return (
    <UIProvider appId={appId} antd>
      <Provider store={model}>
        <WidgetView />
      </Provider>
    </UIProvider>
  )
}
