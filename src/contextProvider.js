import { createContext, useEffect, useState } from "react";
import { auth } from "./firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const Authcontext = createContext()
export const AuthcontextProvider =({children})=>{
    
    const [currentUser,setCurrentUser] = useState({})
    const [currentBoard,setCurrentBoard] = useState({})

    useEffect(()=>{
        const unsub = onAuthStateChanged(auth,(user)=>{
            setCurrentUser(user)
        })
        return ()=>{
            unsub();
        }
    },[]);
    return(
        <Authcontext.Provider value={{currentUser,currentBoard,setCurrentBoard}}>
            {children}
        </Authcontext.Provider>
    )
    
}