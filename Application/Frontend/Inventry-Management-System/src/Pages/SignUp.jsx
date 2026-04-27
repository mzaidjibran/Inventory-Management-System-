import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../Api/authApi.js';
import { toast } from 'react-toastify';

export default function SignUpPage() {
    const [form, setForm] = useState({ User_Name: '', email: '', password: '' });
    const navigate = useNavigate();

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await signUp(form);
            toast.success('Account ban gaya! Ab login karo.');
            navigate('/signin');
        } catch (err) {
            toast.error(err.message);
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4" style={{ width: '400px' }}>
                <h4 className="mb-3 text-center">Sign Up</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">User Name</label>
                        <input name="User_Name" type="text" className="form-control"
                            placeholder="Enter name" onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input name="email" type="email" className="form-control"
                            placeholder="Enter email" onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input name="password" type="password" className="form-control"
                            placeholder="Enter password" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                </form>
                <p className="text-center mt-3">
                    Pehle se account hai? <a href="/signin">Sign In karo</a>
                </p>
            </div>
        </div>
    );
}