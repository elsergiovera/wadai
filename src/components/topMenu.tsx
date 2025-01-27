
import { useState } from 'react'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import { UnorderedListOutlined } from '@ant-design/icons'

type MenuItem = Required<MenuProps>['items'][number]

const TopMenu = () => {
   const [current, setCurrent] = useState('mail')
   const items: MenuItem[] = [
      {
         label: '',
         key: 'mail',
         icon: <UnorderedListOutlined />,
      }]

   const onClick: MenuProps['onClick'] = (e) => {
      console.log('click ', e);
      setCurrent(e.key);
   }

   return (
      <div className='min-w-[400px]'>
         <Menu
            items={items}
            mode="horizontal"
            selectedKeys={[current]}
            onClick={onClick}
         />
      </div>
   )
}

export default TopMenu