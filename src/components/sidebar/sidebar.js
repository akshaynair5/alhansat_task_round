import { useContext, useEffect, useState } from 'react'
import './sidebar.scss'
import { db } from '../../firebaseconfig';
import { collection, orderBy, query, updateDoc, where } from "firebase/firestore";
import { getDocs, doc } from "firebase/firestore";
import { Authcontext } from '../../contextProvider';

function Sidebar (){
    const [popUpVis,setPUV] = useState('hidden');
    const [newBoardName,setBN] = useState('')
    const userDataRef = collection(db,'userData')
    const [userBoards,setBoards] = useState([])
    const {currentUser} = useContext(Authcontext)
    const {currentBoard,setCurrentBoard} = useContext(Authcontext)

    useEffect(()=>{
        console.log(userBoards)
    },[userBoards])
    useEffect(()=>{
        const fetchUserChaps =async()=>{
          const q1 = query(userDataRef,where('uid','==',`${currentUser.uid}`))
          let temp1 = []
          const querySnapShot1 = await getDocs(q1)
          try {
              querySnapShot1.forEach((doc) => {
                  temp1.push(doc.data())
              })
              setBoards(temp1[0].boards)
              console.log(temp1)
          } catch (err) {
              console.log(err)
          }
        }
        fetchUserChaps()
      },[])
    const handleAdd1 = () =>{
        setPUV('visible')
    }
    const handleAdd2= async() =>{
        const id = userBoards.length;
        let temp = userBoards;
        if(userBoards.length < 1){
            temp = [{id:id,cards:[],boardName:newBoardName}]
        }
        else{
            temp = [{id:id,cards:[],boardName:newBoardName},...userBoards]
        }
        await updateDoc(doc(db, "userData", currentUser.uid), {
            "boards" : temp
        })
        setBoards(temp)
        setPUV('hidden')
    }
    const handleBoardView = (board) =>{
        localStorage.setItem('currentBoard', JSON.stringify(board));
        setCurrentBoard(board)
    }

    return(
        <div className="sidebar">
            <div className='popUp' style={{visibility:`${popUpVis}`}} onClick={()=>{setPUV('hidden')}}>
                <div className='content'>
                    <input className='cardTitle' placeholder='List Title (Eg: To Do, Doing etc..)' onChange={(e)=>{setBN(e.target.value)}}></input>
                    <button className='done' onClick={()=>{handleAdd2()}}>Create</button>
                </div>
            </div>
            <p className='heading'>Your Boards</p>
            <button className='Add' onClick={()=>{handleAdd1()}}>+</button>
            <div className='boards'>
                { 
                    userBoards.map((board)=>(
                            <>
                                {currentBoard == board && 
                                    <p onClick={()=>{handleBoardView(board)}} className='curBoard'>{board.boardName}</p>
                                }
                                {currentBoard != board && 
                                    <p onClick={()=>{handleBoardView(board)}} className='notCurBoard'>{board.boardName}</p>
                                }
                            </>
                    ))
                }
            </div>
        </div>
    )
}
export default Sidebar