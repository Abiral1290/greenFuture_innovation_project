import { useState } from 'react'
import SignUpForm from './signup'
import { BrowserRouter as Router, Routes,
  Route, Link } from "react-router-dom";
import LoginPage from './ui/login';
import Dashboard from './ui/dashboard';
import Ideas from './ui/ideasList';

 

function App() {
  const [count, setCount] = useState(0)
  return (
     
     
    <div>
        
      <Routes>

        <Route path="/signup"
         element={<SignUpForm />} />
        <Route path="/"
         element={<LoginPage />} />
          <Route path="/dashboard"
         element={<Dashboard />} />
         <Route path="/ideasList"
         element={<Ideas/>} />
      </Routes>
    </div>
      

  
    
    
  )
}

export default App