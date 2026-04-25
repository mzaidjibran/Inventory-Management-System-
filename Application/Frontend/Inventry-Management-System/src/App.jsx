import { useState } from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import User from './Pages/User.jsx'
import SignInPage from './Pages/SignIn.jsx'
import SignUpPage from './Pages/SignUp.jsx'
import { isLoggedIn } from './api/authApi.js'

// Protected Route — agar login nahi toh signin par bhejo
function ProtectedRoute({ children }) {
    return isLoggedIn() ? children : <Navigate to="/signin" />;
}

function App() {
    return (
        <Routes>
            <Route path='/signin' element={<SignInPage />} />
            <Route path='/signup' element={<SignUpPage />} />
            <Route path='/user' element={
                <ProtectedRoute>
                    <User />
                </ProtectedRoute>
            } />
            {/* Default route */}
            <Route path='/' element={<Navigate to="/signin" />} />
        </Routes>
    );
}

export default App