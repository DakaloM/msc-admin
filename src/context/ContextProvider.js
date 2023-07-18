import React, { createContext, useContext, useState} from 'react'

const StateContext = createContext();

const initialState = {

    
}

export const ContextProvider = ({children}) => {
    const [activeMenu, setActiveMenu] = useState(true);
    const [screenSize, setScreenSize] = useState(undefined)
    const [sidebarWidth, setSidebarWidth] = useState(undefined)

    return (
        <StateContext.Provider value = {
            {
                activeMenu, setActiveMenu,
                screenSize, setScreenSize, 
                sidebarWidth, setSidebarWidth
            }
        }>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)