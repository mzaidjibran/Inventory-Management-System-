import { useState } from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import User from './Pages/User.jsx'
import SignInPage from './Pages/SignIn.jsx'
import SignUpPage from './Pages/SignUp.jsx'
import { isLoggedIn, isAdmin } from './Api/authApi.js'

// Protected Route — agar login nahi toh signin par bhejo
function ProtectedRoute({ children }) {
    return isLoggedIn() ? children : <Navigate to="/signin" />;
}

// Admin Route — sirf admin access kar sakte hain
function AdminRoute({ children }) {
    return isLoggedIn() && isAdmin() ? children : <Navigate to="/signin" />;
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
            <Route path='/' element={<Navigate to={isLoggedIn() ? "/user" : "/signin"} />} />
            {/* Fallback for unauthorized access */}
            <Route path='*' element={<Navigate to="/signin" />} />
        </Routes>
    );
}

export default App