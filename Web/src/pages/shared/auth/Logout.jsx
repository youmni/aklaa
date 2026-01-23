import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import authService from "../../../services/authService";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const { t } = useTranslation('auth');
    const navigate = useNavigate();
    const { setUser } = useAuth();

    useEffect(() => {
        authService.logout()
            .then(() => {
                setUser(null);
                navigate("/auth/login");
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            });
    }, [navigate, setUser]);

    return <div>{t('logout.loggingOut')}</div>;
};
export default Logout;