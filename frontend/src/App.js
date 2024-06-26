import './App.css';
import React from 'react'
import { Switch, BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import Navbar from './components/navbar'
import Home from './pages/home'
import About from './pages/about'
import Use from './pages/use'
import Search from './pages/search'
import Restaurant from './pages/restaurant'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className='navbar'>
          <Navbar/>
        </div>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/how-to-use" element={<Use/>}/>
          <Route path="/search/:query" element={<Search/>}/>
          <Route path="/restaurant/id/:id" element={<Restaurant/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
//<Route path="/restaurant/id/:" Component={<Restaurant/>}/>

/*
<Route path="/restaurant/id/:id" render={(props) => (
            <Restaurant {...props}/>
          )}
          />
          */
