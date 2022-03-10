import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useWallet, useAccount } from '@senhub/providers'
import { utils } from '@senswap/sen-js'
import { explorer } from 'shared/util'

import { Row, Col, Typography, Button, Space, Card, Input, Spin } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { AppDispatch, AppState } from 'app/model'
import {
  generateZombie,
  Zombie as ZombieModel,
} from 'app/model/zombie.controller'
import configs from 'app/configs'
import { createPDB } from 'shared/pdb'
import Zombie from 'app/components/zombie'
import NumericInput from 'shared/antd/numericInput'

const {
  manifest: { appId },
} = configs

interface AccountInfo {
  accountAddress: string
  balance: number
  mint: string
  decimals: number
}

const Page = () => {
  const {
    wallet: { address },
  } = useWallet()

  const { accounts } = useAccount()
  const dispatch = useDispatch<AppDispatch>()
  const { zombies } = useSelector((state: AppState) => state.zombie)
  const [balance, setBalance] = useState(0)
  const [listAccount, setListAccount] = useState<AccountInfo[]>([])
  const [listAmountTransfer, setListAmountTransfer] = useState(Object)
  const [listDstAddressTransfer, setListDstAddressTransfer] = useState(Object)
  const [listLoading, setListLoading] = useState(Object)
  const pdb = useMemo(() => createPDB(address, appId), [address])

  const generate = useCallback(async () => {
    let zombieID = Math.floor(Math.random() * 101)
    const newZombie: ZombieModel = {
      id: zombieID,
      name: 'Zombie: ' + zombieID,
    }
    dispatch(generateZombie({ newZombie }))
  }, [dispatch])

  const getInfoAccount = useCallback(
    async (accountAddress: string) => {
      let mintData = await window.sentre.splt.getMintData(
        accounts[accountAddress].mint,
      )
      let accountData = await window.sentre.splt.getAccountData(accountAddress)
      return {
        accountAddress: accountAddress,
        balance: Number(
          utils.undecimalize(accountData.amount, mintData.decimals),
        ),
        mint: accounts[accountAddress].mint,
        decimals: mintData.decimals,
      }
    },
    [accounts],
  )

  const getAccountData = useCallback(async () => {
    let balance = await window.sentre.lamports.getLamports(address)
    setBalance(balance)
    let listAccountInfo: AccountInfo[] = []
    for (const accountAddress in accounts) {
      let accountInfo = await getInfoAccount(accountAddress)
      listAccountInfo = [...listAccountInfo, accountInfo]
    }

    setListAccount(listAccountInfo)
  }, [address, accounts, getInfoAccount])

  const onChangeAmount = (value: any, accountAddress: string) => {
    let listAmountAddress = {
      ...listAmountTransfer,
      [`${accountAddress}`]: value,
    }
    setListAmountTransfer(listAmountAddress)
  }

  const onChangeDstAddress = (event: any, accountAddress: string) => {
    let listDstAddress = {
      ...listDstAddressTransfer,
      [`${accountAddress}`]: event.target.value,
    }
    setListDstAddressTransfer(listDstAddress)
  }

  const transfer = async (account: AccountInfo) => {
    setListLoading({ [`${account.accountAddress}`]: true })
    try {
      const { splt } = window.sentre
      const wallet: any = window.sentre.wallet
      const amountTransfer = utils.decimalize(
        listAmountTransfer[account.accountAddress],
        account.decimals,
      )
      const dstAssociatedAddr = await splt.deriveAssociatedAddress(
        listDstAddressTransfer[account.accountAddress],
        account.mint,
      )

      console.log(
        'Data transfer: ',
        amountTransfer,
        account.accountAddress,
        dstAssociatedAddr,
        wallet,
      )

      const { txId } = await splt.transfer(
        amountTransfer,
        account.accountAddress,
        dstAssociatedAddr,
        wallet,
      )
      setListLoading({ [`${account.accountAddress}`]: false })
      window.open(explorer(txId), '_blank')
      window.notify({
        type: 'success',
        description: 'Transfer',
      })
    } catch (error: any) {
      window.notify({
        type: 'error',
        description: error.message,
      })
    } finally {
      setListLoading({ [`${account.accountAddress}`]: false })
    }
  }

  useEffect(() => {
    if (pdb) pdb.setItem('zombies', zombies)
  }, [pdb, zombies])

  return (
    <Row gutter={[24, 24]} align="middle">
      <Col span={24}>
        <Space align="center">
          <IonIcon name="newspaper-outline" />
          <Typography.Title level={4}>Page</Typography.Title>
        </Space>
      </Col>
      <Col span={24}>
        <Card className="card-page card-sen-test scrollbar">
          <Row gutter={[24, 24]} align="middle">
            {/* Header */}
            <Col flex="auto">
              <Typography.Title level={4}>Sen Test</Typography.Title>
            </Col>
            <Col span={24}>
              <Typography.Text>Address: {address}</Typography.Text>
            </Col>
            <Col span={24}>
              <Typography.Text>Lamports: {balance}</Typography.Text>
            </Col>
            {listAccount &&
              listAccount.map((account, index) => (
                <Col
                  xl={{ span: 12 }}
                  lg={{ span: 12 }}
                  md={{ span: 12 }}
                  xs={{ span: 24 }}
                  key={index}
                >
                  <Spin
                    size="small"
                    spinning={listLoading[account.accountAddress] || false}
                  >
                    <Col span={24}>
                      <Typography.Text>
                        Account Address: {account.accountAddress}
                      </Typography.Text>
                    </Col>
                    <Col span={24} key={index}>
                      <Typography.Text>
                        Amount: {account.balance}
                      </Typography.Text>
                    </Col>
                    <Col span={24}>
                      <Typography.Text>Receiver Address</Typography.Text>
                    </Col>
                    <Col span={24}>
                      <Space>
                        <Input
                          size="large"
                          placeholder={`${address.substring(0, 12)}...`}
                          onChange={(event) =>
                            onChangeDstAddress(event, account.accountAddress)
                          }
                        />
                        <NumericInput
                          placeholder="0"
                          onValue={(event) =>
                            onChangeAmount(event, account.accountAddress)
                          }
                        />
                        <Button onClick={() => transfer(account)}>
                          Transfer
                        </Button>
                      </Space>
                    </Col>
                  </Spin>
                </Col>
              ))}
          </Row>
        </Card>
      </Col>
      <Col>
        <Button onClick={getAccountData}>Get account data</Button>
      </Col>
      <Col>
        <Button onClick={generate}>Generate Zombie</Button>
      </Col>
      <Col span={24}>
        <Row gutter={[24, 24]} justify="space-between">
          {zombies &&
            zombies.map((zombie, index) => (
              <Col
                className="gutter-row"
                lg={{ span: 6 }}
                md={{ span: 12 }}
                xs={{ span: 24 }}
                key={index}
              >
                <Zombie zombieName={zombie.name}></Zombie>
              </Col>
            ))}
        </Row>
      </Col>
    </Row>
  )
}

export default Page
