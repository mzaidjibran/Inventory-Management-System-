import { useEffect,useState } from "react"; 
import * as api from '../Api/UserApi.js'

export default function UserHook() {
    const [users, setUser] = useState([])

    const loadUser = async () => {
        const data = await api.getAllUsers()
         console.log('API response:', data)
        setUser(data.data)
    }

    useEffect(() => {
        loadUser()
    }, [])

    return { users, loadUser }
}