const API_BASE = 'http://localhost:5000'

// creating Product

const createProduct = async (data) => {

    const response = await fetch(`${API_BASE}/api/product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`Create failed: ${response.status}`);
    return response.json();
};
export default createProduct;


//get all products

export const getAllProducts = async () => {
    const response = await fetch(`${API_BASE}/api/product`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error(`Get all failed: ${response.status}`);
    return response.json();
};

//update product

export const updateProduct = async (id, data) => {
    const response = await fetch(`${API_BASE}/api/product/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`Update failed: ${response.status}`);
    return response.json();
};

//Delete product

export const deleteProduct = async (id) => {
    const response = await fetch(`${API_BASE}/api/product/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error(`Delete failed: ${response.status}`);
    return response.json();
};