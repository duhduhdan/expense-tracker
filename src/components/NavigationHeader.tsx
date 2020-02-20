import React from 'react'
import moment from 'moment'
import {
  Dropdown,
  Button,
  Layout,
  Typography,
  Icon,
  Row,
  Col,
  Menu,
  Avatar,
} from 'antd'

import { useAuth } from '../hooks/use-auth'

const { Header } = Layout
const { Title, Text } = Typography

function NavigationHeader({ collapsed, setCollapsed, showModal, month }) {
  const { user, signout } = useAuth()

  return (
    <>
      <Header
        style={{
          background: '#fff',
          padding: '0 16px',
          width: '100%',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
        }}
      >
        <Row type="flex" justify="space-between" align="middle">
          <Col>
            <Row type="flex" align="middle">
              <Icon
                type={collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: 20, marginRight: 16 }}
              />
              <Button type="link" onClick={showModal}>
                <Title level={4} style={{ margin: 0, padding: 0 }}>
                  {month || moment().format('MMMM YYYY')}
                </Title>
              </Button>
            </Row>
          </Col>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                <Menu.Item>
                  <Button type="link" onClick={signout} size="large">
                    Sign out
                  </Button>
                </Menu.Item>
              </Menu>
            }
          >
            <div>
              <Button>
                <Avatar icon="user" size="small" />
                <Text style={{ paddingLeft: 8 }}>
                  {user && user.email}
                </Text>{' '}
                <Icon type="down" />
              </Button>
            </div>
          </Dropdown>
        </Row>
      </Header>
    </>
  )
}

export { NavigationHeader }
