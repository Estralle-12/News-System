import React from 'react'
import {HashRouter,Route,Switch,Redirect} from 'react-router-dom'
import Login from '../views/Login/Login'
import NewsSandBox from '../views/sandbox/NewsSandBox'

export default function IndexRouter() {
  return (
    <HashRouter>
      <Switch>
        <Route path='/login' component={Login}/>
        <Route path='/' render={()=>
          localStorage.getItem('token') ? 
          <NewsSandBox></NewsSandBox> : 
          <Redirect to="/login"/>
          // <NewsSandBox></NewsSandBox>
        }/>
      </Switch>
    </HashRouter>
  )
}
