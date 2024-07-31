import axios from "axios";
import { useState, useContext, createContext, useEffect } from "react";

const AuthContext = createContext();

const AuthContextComponent = ({ children }) => {

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getCurrentuser = async () => {
            const {data} = await axios.get('/api/tasks/getcurrentuser');
            setUser(data);
            setIsLoading(false);
        }
        getCurrentuser();
    }, []);

    // if (isLoading) {
    //     return <h1>Loading...</h1>
    // }

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => useContext(AuthContext);

export { AuthContextComponent, useAuth }