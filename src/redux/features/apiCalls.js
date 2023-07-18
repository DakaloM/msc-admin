
import { publicRequest } from "../../requestMethod";
import { loginStart, loginSuccess, loginFailure, logout, setErrorMessage } from "./userSlice";
import { useNavigate } from "react-router-dom";



export const login = async (dispatch, user, navigate) => {
    dispatch(loginStart());
    try {
        const res = await publicRequest.post('auth/login',user);
        dispatch(loginSuccess(res.data));
        navigate("/?user=true");
    } catch (error) {
        dispatch(loginFailure(error))
        dispatch(setErrorMessage(
            error.response ? error.response.data.message ? error.response.data.message : "Something went wrong" : "Network Error"
        ))
    }
}

export const logoutUser = (dispatch) => {
    localStorage.removeItem('persist:root');
    dispatch(logout)
}