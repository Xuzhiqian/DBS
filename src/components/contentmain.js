import React from 'react'
//引入路由
import {Route, Switch} from 'react-router-dom'
import KeyRow from './keyrow';

class ContentMain extends React.Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path='/' component={KeyRow}/>
                    <Route exact path='/person' component={KeyRow}/>
                </Switch>
            </div>
        )
    }
}

export default ContentMain