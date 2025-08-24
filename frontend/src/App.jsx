import React, { useEffect } from 'react'
import Home from './pages/Home'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from './pages/Profile';
import About from './pages/About';
import Hero from './pages/Hero';
import Navbar from './pages/Navbar';
// import Services from './pages/Services';
import Create from './pages/Create';
import Wallet from './pages/Wallet';
import Explore from './pages/Explore';
import CourseVideo from './pages/CourseVideo';
import { useWallet } from './contexts/walletContext';
import Forum from './pages/Forum';

const App = () => {
  const { initializeContract, account } = useWallet();
  
  useEffect(() => {
    if (account) {
      initializeContract(account);
    }
  }, [initializeContract, account]);
  
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/create" element={<Create />} />
        {/* <Route path="/services" element={<Services />} /> */}
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/hero" element={<Hero />} />
        <Route path="/course-video/:id" element={<CourseVideo />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/forum" element={<Forum/>} />
       
      
      </Routes>
    </Router>
  )
}

export default App


