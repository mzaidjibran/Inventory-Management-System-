const API_BASE = 'http://localhost:3000'

// add user

const addUser = async (data) => {
    const response = await fetch(`${API_BASE}/api/user/createUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        throw new Error(`Create failed: ${response.status} - ${errorText}`);
    }
    return response.json();
};
export default addUser;


//get all users

export const getAllUsers = async () => {
    const response = await fetch(`${API_BASE}/api/user/getAllUsers`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error(`Get all failed: ${response.status}`);
    return response.json();
};

//update user

export const updateUser = async (id, data) => {
    const response = await fetch(`${API_BASE}/api/user/updateuser/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        throw new Error(`Update failed: ${response.status} - ${errorText}`);
    }
    return response.json();
};

//Delete user

export const deleteUser = async (id) => {
    const response = await fetch(`${API_BASE}/api/user/deleteuser/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        throw new Error(`Delete failed: ${response.status} - ${errorText}`);
    }
    return response.json();
};