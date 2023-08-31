import { Link } from "react-router-dom"
import './navbar.scss'
import { useContext } from "react"
import { Authcontext } from "../../contextProvider"
import { signOut } from "firebase/auth"
import { auth } from "../../firebaseconfig"

function Navbar(){
    const {currentUser} = useContext(Authcontext)

    return(
        <div className="navbar">
            <Link to='home' className="btns">Home</Link>

            <div className="info">
                <p>{currentUser.displayName}</p>
                <img src={currentUser.photoURL} onClick={()=>signOut(auth)}></img>
            </div>
            
        </div>
    )
}
export default Navbar