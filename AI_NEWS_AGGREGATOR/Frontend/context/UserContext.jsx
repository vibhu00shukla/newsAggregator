import { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const UserContext = createContext()

function UserProvider ({ children }) {
    const navigate = useNavigate()
    const [token, setToken] = useState(() => {
        const saved = localStorage.getItem('token')
        return saved && saved !== 'undefined' ? saved : null
    })
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved && saved !== 'undefined' ? JSON.parse(saved) : null;
    }) 

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user') // <-- remove user on logout
        navigate('/login')
    }

    const updateUser = (userObj) => {
        setUser(userObj);
        localStorage.setItem('user', JSON.stringify(userObj));
    }

    return(
        <UserContext.Provider value = { {user, setUser: updateUser, token, setToken, logout}}>
            {children}
        </UserContext.Provider>
    )

}

export { UserContext, UserProvider}