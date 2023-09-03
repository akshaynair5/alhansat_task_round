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
            <div className="btns">
                <button className="btn"><Link to='home' style={{color:'aliceblue',textDecoration:'none'}}>Home</Link></button>
                <button onClick={()=>signOut(auth)} className="btn">Logout</button>
            </div>

            <div className="info">
                <p>{currentUser.displayName}</p>
                <img src={currentUser.photoURL} ></img>
            </div>
            
        </div>
    )
}
export default Navbar