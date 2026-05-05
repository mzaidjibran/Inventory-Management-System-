import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Product from './pages/product.jsx'
import User from "./pages/user.jsx";
import Employee from "./pages/employee.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";




function App() {
    return (
        
            <Routes>
                <Route path="/signin" element={<SignIn/>}/>
                <Route path="/signup" element={<SignUp/>}/>
                <Route path="/" element={<SignIn/>}/>
                
                {/* Protected Routes */}
                <Route path="/product" element={
                    <ProtectedRoute>
                        <Product/>
                    </ProtectedRoute>
                }/>
                <Route path="/employee" element={
                    <ProtectedRoute>
                        <Employee/>
                    </ProtectedRoute>
                }/>
                <Route path="/user" element={
                    <ProtectedRoute>
                        <User/>
                    </ProtectedRoute>
                }/>
            </Routes>
        
    );
}

export default App;