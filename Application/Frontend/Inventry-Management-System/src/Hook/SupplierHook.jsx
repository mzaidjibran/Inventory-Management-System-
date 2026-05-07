import { useEffect, useState } from "react";
import { getAllSuppliers } from '../Api/supplier.js'

export default function SupplierHook() {
    const [suppliers, setSuppliers] = useState([])

    const loadSuppliers = async () => {
        try {
            const data = await getAllSuppliers()
            console.log('Supplier API response:', data)
            setSuppliers(data.data || data)
        } catch (error) {
            console.error('Error loading suppliers:', error)
            setSuppliers([])
        }
    }

    useEffect(() => {
        loadSuppliers()
    }, [])

    return { suppliers, loadSuppliers }
}
