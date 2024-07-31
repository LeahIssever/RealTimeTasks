import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext"
import { useEffect } from "react";
import axios from "axios";

const Logout = () => {

    const { setUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            await axios.post("api/account/logout");
            setUser(null);
            navigate('/');
        }
        logout();
    }, []);

    return(<></>)
}

export default Logout;