import{BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css';


function Home(){
  return <h1>Home Page</h1>;
}

function About(){
  return <h1>About Page</h1>;
}

function Contact(){
  return <h1>Contact Page</h1>;
}

function App() {
  return(
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/contact" element={<Contact/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App;