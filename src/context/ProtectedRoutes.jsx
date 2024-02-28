import { useState, useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";

export const useAuth = () => {
    const user = useContext(UserContext);
    return Boolean(user && user.userEmail && user.userName);
};

const ProtectedRoutes = () => {
    // const location = useLocation();
    const isAuth = useAuth();
    if (!isAuth) {
        return <Navigate to="/" replace />; // Redirect to the login page
    }
    else {

        const user = useContext(UserContext);

        if (!user.userCompletedGame && !user.userCompletedPostTest) {
            return <Navigate to="/game" />; // Redirect to the game page
        }
        else if (user.userCompletedGame && !user.userCompletedPostTest) {
            return <Navigate to="/post-test" />; // Redirect to the post-test page
        }
        else if (user.userCompletedGame && user.userCompletedPostTest) {
            return <Navigate to="/end" />; // Redirect to the end page
        }
        else {
            alert("Error: user data is not correct at ProtectedRoutes.jsx. Please contact the administrator.");
            return <Outlet />;
        }
    }
};

export default ProtectedRoutes;