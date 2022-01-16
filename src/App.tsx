import React from 'react'
import './App.scss'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Dashboard } from './components/Dashboard/Dashboard'
import { Login } from './components/Login/login'

export default function App(): React.ReactElement {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path='/login' element={<Login />}/>
                    <Route path='/dashboard' element={<Dashboard />}/>
                </Routes>
            </Router>
        </div>
    )
}
