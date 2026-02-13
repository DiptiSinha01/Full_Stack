import './App.css';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Home = lazy(() => import('./pages/Home.js'));
const About = lazy(() => import('./pages/About.js'));
const Contact = lazy(() => import('./pages/Contact.js'));

function App() {
  return(
    <BrowserRouter>
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/contact" element={<Contact/>}/>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App;