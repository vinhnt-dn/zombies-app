import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useWallet } from '@senhub/providers'

import { Row, Col, Typography, Button, Space } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import Zombie from 'app/components/zombie'

import { AppDispatch, AppState } from 'app/model'
import { increaseCounter } from 'app/model/main.controller'
import configs from 'app/configs'
import { createPDB } from 'shared/pdb'

const {
  manifest: { appId },
} = configs

const Page = () => {
  const {
    wallet: { address },
  } = useWallet()
  const dispatch = useDispatch<AppDispatch>()
  const { counter } = useSelector((state: AppState) => state.main)

  const pdb = useMemo(() => createPDB(address, appId), [address])
  const increase = useCallback(() => dispatch(increaseCounter()), [dispatch])
  useEffect(() => {
    if (pdb) pdb.setItem('counter', counter)
  }, [pdb, counter])

  return (
    <Row gutter={[24, 24]} align="middle">
      <Col span={24}>
        <Space align="center">
          <IonIcon name="newspaper-outline" />
          <Typography.Title level={4}>Page</Typography.Title>
        </Space>
      </Col>
      <Col>
        <Button>Generate Zombie</Button>
      </Col>
      <Col span={24}>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col
            className="gutter-row"
            lg={{ span: 6 }}
            md={{ span: 12 }}
            xs={{ span: 24 }}
          >
            <Zombie></Zombie>
          </Col>
          <Col
            className="gutter-row"
            lg={{ span: 6 }}
            md={{ span: 12 }}
            xs={{ span: 24 }}
          >
            <Zombie></Zombie>
          </Col>
          <Col
            className="gutter-row"
            lg={{ span: 6 }}
            md={{ span: 12 }}
            xs={{ span: 24 }}
          >
            <Zombie></Zombie>
          </Col>
          <Col
            className="gutter-row"
            lg={{ span: 6 }}
            md={{ span: 12 }}
            xs={{ span: 24 }}
          >
            <Zombie></Zombie>
          </Col>
          <Col
            className="gutter-row"
            lg={{ span: 6 }}
            md={{ span: 12 }}
            xs={{ span: 24 }}
          >
            <Zombie></Zombie>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Page
