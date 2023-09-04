import { Link, Navigate, useNavigate } from "react-router-dom"
import './navbar.scss'
import { useContext } from "react"
import { Authcontext } from "../../contextProvider"
import { signOut } from "firebase/auth"
import { auth } from "../../firebaseconfig"

function Navbar(){
    const {currentUser} = useContext(Authcontext)
    const navigate = useNavigate()
    const signout = ()=>{
        signOut(auth)
        navigate('/login')
    }

    return(
        <div className="navbar">
            <div className="btns">
                <button className="btn"><Link to='home' style={{color:'aliceblue',textDecoration:'none'}}>Home</Link></button>
                <button onClick={()=>signout()} className="btn">Logout</button>
            </div>

            <div className="info">
                <p>{currentUser.displayName}</p>
                <img src={currentUser.photoURL} ></img>
            </div>
            
        </div>
    )
}
export default Navbar