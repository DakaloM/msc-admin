import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: null,
        isfetching: false,
        error: false,
        errorMessage: null,
        
    },

    reducers: {
        loginStart: (state) => {
            state.isfetching = true;
        },
        loginSuccess: (state, action) => {
            state.isfetching = false;
            state.currentUser = action.payload;
            state.error = false;
        },
        loginFailure: (state, action) => {
            state.isfetching = false;
            state.error = true;
            state.errorMessage = action.payload
        },
        logout: (state) => {
            state.currentUser = null
        },
        updateUser: (state, action) => {

        },
        setErrorMessage: (state, action) => {
            state.errorMessage = action.payload
        }
    }
})

export const {loginStart, loginSuccess, loginFailure, logout, setErrorMessage} = userSlice.actions
export default userSlice.reducer