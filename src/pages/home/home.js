import { useContext, useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import { Authcontext } from "../../contextProvider";
import Sidebar from "../../components/sidebar/sidebar";
import Board from "../../components/board/board";
import { collection, orderBy, query, updateDoc, where } from "firebase/firestore";
import { getDocs, doc } from "firebase/firestore";
import { db } from "../../firebaseconfig";

function Home(){

    const {currentUser} = useContext(Authcontext)
    const userDataRef = collection(db,'userData')
    const [userData,setData] = useState([])

    useEffect(()=>{
        console.log(currentUser)
    },[])
    useEffect(()=>{
        const fetchUserChaps =async()=>{
          const q1 = query(userDataRef,where('uid','==',`${currentUser.uid}`))
          let temp1 = []
          const querySnapShot1 = await getDocs(q1)
          try {
              querySnapShot1.forEach((doc) => {
                  temp1.push(doc.data())
              })
              setData(temp1[0])
              console.log(temp1)
          } catch (err) {
              console.log(err)
          }
        }
        fetchUserChaps()
      },[])
    return (
        <div className="Home">
            <Navbar></Navbar>
            <Sidebar></Sidebar>
            <Board></Board>
        </div>
    )
}

export default Home;