import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthForm from './components/AuthForm'
import  { Toaster } from 'react-hot-toast';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
const App = () => {
  return (
   <>
   <BrowserRouter>
     <Routes>
       <Route path="/" element={<AuthForm />} />
         <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
     </Routes>
   </BrowserRouter>
   <Toaster />
  
   </>
  )
}

export default App
