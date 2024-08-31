import './App.css';
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/navbar'
import Home from './pages/home'
import About from './pages/about'
import Search from './pages/search'
import Restaurant from './pages/restaurant'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {/*we want the navbar to be displayed on every single page so it goes at the top*/}
        <div className='navbar'>
          <Navbar/>
        </div>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path={`/search/:query`} element={<Search/>}/>
          <Route path="/restaurant/id/:id" element={<Restaurant/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
