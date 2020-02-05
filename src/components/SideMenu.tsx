import React from 'react'
import { Menu, Layout, Typography, Row, Icon } from 'antd'

const { Sider } = Layout
const { SubMenu } = Menu
const { Text } = Typography

function SideMenu({ collapsed, setCollapsed }) {
  return (
    <Sider collapsed={collapsed} onCollapse={setCollapsed}>
      <Row type="flex" justify="center" align="middle">
        <Text
          style={{
            color: '#fff',
            margin: 0,
            padding: '8px 0',
            fontSize: 16,
          }}
          strong
        >
          Kostnadr
        </Text>
      </Row>
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        <Menu.Item key="1">
          <Icon type="rise" />
          <span>Expenses</span>
        </Menu.Item>
        <Menu.Item key="2">
          <Icon type="dashboard" />
          <span>Bills</span>
        </Menu.Item>
        <SubMenu
          key="sub1"
          title={
            <span>
              <Icon type="user" />
              <span>User</span>
            </span>
          }
        >
          <Menu.Item key="3">Tom</Menu.Item>
          <Menu.Item key="4">Bill</Menu.Item>
          <Menu.Item key="5">Alex</Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub2"
          title={
            <span>
              <Icon type="team" />
              <span>Team</span>
            </span>
          }
        >
          <Menu.Item key="6">Team 1</Menu.Item>
          <Menu.Item key="8">Team 2</Menu.Item>
        </SubMenu>
        <Menu.Item key="9">
          <Icon type="file" />
          <span>File</span>
        </Menu.Item>
      </Menu>
    </Sider>
  )
}

export { SideMenu }
