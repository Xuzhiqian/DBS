import React, { Component } from 'react'
//引入路由
import {Route, Switch} from 'react-router-dom'
import KeyRow from './keyrow';

class ContentMain extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path='/' component={KeyRow}/>
                    <Route exact path='/person' component={KeyRow} />
                    <Route exact path='/customer' component={KeyRow} />
                    <Route exact path='/account' component={KeyRow} />
                    <Route exact path='/debt' component={KeyRow} />
                    <Route exact path='/stat' component={KeyRow} />
                </Switch>
            </div>
        )
    }
}

export default ContentMain