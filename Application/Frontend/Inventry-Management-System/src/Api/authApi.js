const API_BASE = 'http://localhost:3000';

// SIGNIN
export const signIn = async (email, password) => {

    const response = await fetch(`${API_BASE}/api/account/SignIn`, {
      
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');

    // Tokens save karo
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
};

// LOGOUT
export const logOut = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    await fetch(`${API_BASE}/api/account/logOut`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
    });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};

// TOKEN REFRESH
export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch(`${API_BASE}/api/account/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
    });
    const data = await response.json();
    if (!response.ok) throw new Error('Session expired');
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
};

// Check login hai ya nahi
export const isLoggedIn = () => !!localStorage.getItem('accessToken');