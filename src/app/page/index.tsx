import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useWallet } from '@senhub/providers'

import { Row, Col, Typography, Button, Space } from 'antd'
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

const Page = () => {
  const {
    wallet: { address },
  } = useWallet()
  const dispatch = useDispatch<AppDispatch>()
  const { zombies } = useSelector((state: AppState) => state.zombie)

  const pdb = useMemo(() => createPDB(address, appId), [address])
  const generate = useCallback(() => {
    const newZombie: ZombieModel = {
      id: Math.random(),
      name: 'Test',
    }
    console.log('Click', newZombie)
    dispatch(generateZombie({ newZombie }))
  }, [dispatch])
  useEffect(() => {
    if (pdb) pdb.setItem('counter', zombies)
  }, [pdb, zombies])

  return (
    <Row gutter={[24, 24]} align="middle">
      <Col span={24}>
        <Space align="center">
          <IonIcon name="newspaper-outline" />
          <Typography.Title level={4}>Page</Typography.Title>
        </Space>
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
