import React from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import Home from '../Pages/Home'
import Login from '../Pages/Login'
import Reagister from '../Pages/Reagister'
import SearchResultList from '../Pages/SearchResultList'
import ThankYou from '../Pages/ThankYou'
import CountBlink from '../Pages/CountBlink'
import Result from '../Pages/Result'
import Eye_Blink from '../Pages/Eye_Blink'
import VideoStream from '../Pages/VideoStream'
import BlinkDetect from '../Pages/BlinkDetect'
import InformationPage from '../Pages/InformationPage'
import About from '../Pages/About'
import Contact from '../Pages/Contact'

const Routers = () => {
  return (
    <Routes>
       <Route path ='/' element={<Navigate to = '/login' />}/>
       <Route path='/home' element={<Home/>}/>
       <Route path='/login' element={<Login/>}/>
       <Route path='/register' element={<Reagister/>}/>
       <Route path='/count-blink' element={<CountBlink/>}/>
       <Route path='/result' element={<Result/>}/>
       <Route path='/blink-detect' element={<BlinkDetect/>}/>
       <Route path='/information' element={<InformationPage/>}/>
       <Route path='/about' element={<About/>}/>
       <Route path='/contact' element={<Contact/>}/>
       {/* <Route path='/video' element={<VideoStream/>}/> */}
    </Routes>
  )
}

export default Routers