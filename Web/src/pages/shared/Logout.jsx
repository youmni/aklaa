import { useEffect } from "react";
import api from "../../api/axiosConfig";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    useEffect(() => {
        api.post("/auth/logout")
            .then(() => {
                setUser(null);
                navigate("/auth/login");
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            });
    }, [navigate, setUser]);

    return <div>Logging out...</div>;
};
export default Logout;