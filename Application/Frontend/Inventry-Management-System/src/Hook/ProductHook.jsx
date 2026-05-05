import { useEffect, useState } from "react";
import * as api from '../api/ProductApi.js'

export default function ProductHook() {
    const [products, setProducts] = useState([])

    const loadProducts = async () => {
        const data = await api.getAllProducts()
        console.log('API response:', data)
        setProducts(data.data)
    }

    useEffect(() => {
        loadProducts()
    }, [])

    return { products, loadProducts }
}