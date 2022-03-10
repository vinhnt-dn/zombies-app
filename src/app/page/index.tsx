import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useWallet, useAccount } from '@senhub/providers'
import { utils } from '@senswap/sen-js'

import { Row, Col, Typography, Button, Space, Card, Input } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { AppDispatch, AppState } from 'app/model'
import {
  generateZombie,
  Zombie as ZombieModel,
} from 'app/model/zombie.controller'
import configs from 'app/configs'
import { createPDB } from 'shared/pdb'
import Zombie from 'app/components/zombie'

const {
  manifest: { appId },
} = configs

interface AccountInfo {
  accountAddress: any
  balance: any
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

  const pdb = useMemo(() => createPDB(address, appId), [address])
  const generate = useCallback(async () => {
    const newZombie: ZombieModel = {
      id: Math.random(),
      name: 'Test',
    }
    dispatch(generateZombie({ newZombie }))
  }, [dispatch])

  const getBlanceValue = useCallback(
    async (accountAddress: string) => {
      let mintData = await window.sentre.splt.getMintData(
        accounts[accountAddress].mint,
      )
      let accountData = await window.sentre.splt.getAccountData(accountAddress)
      return Number(utils.undecimalize(accountData.amount, mintData.decimals))
    },
    [accounts],
  )

  const getAccountData = useCallback(async () => {
    // const nodeUrl = 'https://api.devnet.solana.com'
    // const lamports = new Lamports(nodeUrl)
    let balance = await window.sentre.lamports.getLamports(address)
    setBalance(balance)
    // console.log('balance: ', balance)
    // console.log('accounts: ', accounts)
    let listAccountInfo: AccountInfo[] = []
    for (const accountAddress in accounts) {
      // let mintData = await window.sentre.splt.getMintData(
      //   accounts[accountAddress].mint,
      // )
      // let accountData = await window.sentre.splt.getAccountData(accountAddress)
      // console.log('accountData: ', accountAddress, accountData)
      // console.log('minData: ', accounts[accountAddress].mint, mintData)
      // console.log('listAccount: ', listAccount)

      let accountInfo = {
        accountAddress: accountAddress,
        balance: await getBlanceValue(accountAddress),
      }
      listAccountInfo = [...listAccountInfo, accountInfo]
    }
    setListAccount(listAccountInfo)
  }, [address, accounts, getBlanceValue])

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
                <div key={index}>
                  <Col span={24}>
                    <Typography.Text>
                      Account Address: {account.accountAddress}
                    </Typography.Text>
                  </Col>
                  <Col span={24} key={index}>
                    <Typography.Text>Amount: {account.balance}</Typography.Text>
                  </Col>
                  <Col span={24}>
                    <Typography.Text>Receiver Address</Typography.Text>
                  </Col>

                  <Col span={24}>
                    <Space>
                      <Input
                        size="large"
                        placeholder={`${address.substring(0, 12)}...`}
                      />
                      <Button>Transfer</Button>
                    </Space>
                  </Col>
                </div>
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
