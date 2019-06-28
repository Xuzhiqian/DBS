import React from 'react'
//引入路由
import {Route, Switch} from 'react-router-dom'

class ContentMain extends React.Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path='/' component={}/>
                    <Route exact path='/person' component={}/>
                </Switch>
            </div>
        )
    }
}

export default ContentMain