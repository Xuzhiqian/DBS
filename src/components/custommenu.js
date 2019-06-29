import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import {Menu, Icon} from 'antd';
const menus = [
    {
        title: '支行管理',
        icon: 'page',
        key: '/'
    },
    {
        title: '员工管理',
        icon: 'user',
        key: '/person'
        //subs: [
         //   { key: '/page/AlertDemo', title: '弹出框', icon: '' },
        //]
    },
    {
        title: '客户管理',
        icon: 'user',
        key: "/customer"
    },
    {
        title: '账户管理',
        icon: 'user',
        key: '/account',
        subs: [
            { key: '/account/bank', title: '储蓄账户' },
            { key: '/account/cheque', title: '支票账户' }
        ]
    },
    {
        title: '贷款管理',
        icon: 'user',
        key: '/debt'
    },
    {
        title: '业务统计',
        icon: 'pie-chart',
        key: '/stat'
    }
];

//此组件的意义就是将数据抽离出来，通过传递数据去渲染
class CustomMenu extends Component {

    renderSubMenu = ({key, icon, title, subs}) => {
        return (
            <Menu.SubMenu key={key} title={<span>{icon && <Icon type={icon}/>}<span>{title}</span></span>}>
                {
                    subs && subs.map(item => {
                        return item.subs && item.subs.length > 0 ? this.renderSubMenu(item) : this.renderMenuItem(item)
                    })
                }
            </Menu.SubMenu>
        )
    }
    renderMenuItem = ({key, icon, title,}) => {
        return (
            <Menu.Item key={key}>
                <Link to={key}>
                    {icon && <Icon type={icon}/>}
                    <span>{title}</span>
                </Link>
            </Menu.Item>
        )
    }
    render() {
        return (
            <Menu
                theme="dark"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
            >
                {
                    menus.map(item => {
                        return item.subs && item.subs.length > 0 ? this.renderSubMenu(item) : this.renderMenuItem(item)
                    })
                }
            </Menu>
        )
    }
}
export default CustomMenu