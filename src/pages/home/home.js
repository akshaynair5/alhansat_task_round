import { useContext, useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import { Authcontext } from "../../contextProvider";
import Sidebar from "../../components/sidebar/sidebar";
import Board from "../../components/board/board";
import { collection, orderBy, query, updateDoc, where } from "firebase/firestore";
import { getDocs, doc } from "firebase/firestore";
import { db } from "../../firebaseconfig";

function Home(){

    // const {currentUser} = useContext(Authcontext)
    // const userDataRef = collection(db,'userData')
    // const [userData,setData] = useState([])
    
    return (
        <div className="Home">
            <Navbar></Navbar>
            <Sidebar></Sidebar>
            <Board></Board>
        </div>
    )
}

export default Home;