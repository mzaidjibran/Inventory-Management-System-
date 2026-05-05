const API_BASE = 'http://localhost:5000'

// creating employee

const createEmployee = async (data) => {
  
    const response = await fetch(`${API_BASE}/api/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`Create failed: ${response.status}`);
    return response.json();
};
export default createEmployee;


//get all employees

export const getAllEmployees = async () => {
    const response = await fetch(`${API_BASE}/api/employees/getAllEmployees`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error(`Get all failed: ${response.status}`);
    return response.json();
};

//update employee

export const updateEmployee = async (id, data) => {
    const response = await fetch(`${API_BASE}/api/employees/updateEmployee/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`Update failed: ${response.status}`);
    return response.json();
};

//Delete employee

export const deleteEmployee = async (id) => {
    const response = await fetch(`${API_BASE}/api/employees/deleteEmployee/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error(`Delete failed: ${response.status}`);
    return response.json();
};