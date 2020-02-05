import React, { useState } from 'react'
import { Layout } from 'antd'

import { SideMenu } from './SideMenu'
import { NavigationHeader } from './NavigationHeader'

function Screen({ children, showModal, month }) {
  const [collapsed, setCollapsed] = useState<boolean>(true)

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <SideMenu collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout style={{ backgroundColor: '#f0f2f5' }}>
        <NavigationHeader
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          showModal={showModal}
          month={month}
        />
        {children}
      </Layout>
    </Layout>
  )
}

export { Screen }
