import { useEffect,useState } from "react"; 
import * as api from '../api/EmployeeApi.js'

export default function EmployeeHook() {
    const [employees, setEmployees] = useState([])

    const loadEmployees = async () => {
        const data = await api.getAllEmployees()
         console.log('API response:', data)
        setEmployees(data.data)
    }

    useEffect(() => {
        loadEmployees()
    }, [])

    return { employees, loadEmployees } 
}