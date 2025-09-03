import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from '../services/api';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', {username, password});
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Login</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium">Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border rounded-md" required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium" >Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border rounded-md" required/>
                    </div>
                    <button type="submit" className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">Login</button>
                </form>
                <p className="text-sm text-center">
                    Don't have an account? <Link to="/register" className="text-blue-600">Register here</Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage;