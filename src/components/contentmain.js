import React, { Component } from 'react'
//引入路由
import {Route, Switch} from 'react-router-dom'
import Bank from './bank';
import KeyRow from './keyrow';
import Person from './person';
import Customer from './customer';
import Saving from './account_saving';
import Cheque from './account_cheque';
import Loan from './loan';

class ContentMain extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path='/' component={Bank}/>
                    <Route exact path='/person' component={Person} />
                    <Route exact path='/customer' component={Customer} />
                    <Route exact path='/account/saving' component={Saving} />
                    <Route exact path='/account/cheque' component={Cheque} />
                    <Route exact path='/loan' component={Loan} />
                    <Route exact path='/stat' component={KeyRow} />
                </Switch>
            </div>
        )
    }
}

export default ContentMain