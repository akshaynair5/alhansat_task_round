import { useContext, useEffect, useState } from 'react'
import './sidebar.scss'
import { db } from '../../firebaseconfig';
import { collection, orderBy, query, updateDoc, where } from "firebase/firestore";
import { getDocs, doc } from "firebase/firestore";
import { Authcontext } from '../../contextProvider';

function Sidebar (){
    const [addBoard,setAB] = useState(false);
    const [windowWidth,setWindowWidth] = useState(window.innerWidth)
    const [newBoardName,setBN] = useState('')
    const userDataRef = collection(db,'userData')
    const [mobVis,setMobVis] = useState(false)
    const [userBoards,setBoards] = useState([])
    const {currentUser} = useContext(Authcontext)
    const {currentBoard,setCurrentBoard} = useContext(Authcontext)

    // useEffect(()=>{
    //     console.log(userBoards)
    // },[userBoards])
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
        setAB(true)
    }
    const handleAdd2= async() =>{
        const id = Math.floor(Date.now() / 1000);
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
        setAB(false)
        setCurrentBoard(temp[0])
    }
    const handleBoardView = (board) =>{
        setCurrentBoard(board)
    }

    const closeBoard = async(board) =>{
        let temp = userBoards;
        for(let i=0;i<temp.length;i++){
            if(board.id == temp[i].id){
                temp.splice(i,1);
            }
        }
        await updateDoc(doc(db, "userData", currentUser.uid), {
            "boards" : temp
        })
        setBoards(temp)
        if(temp[0]){
            setCurrentBoard(temp[0])
        }
    }


    const handleMobVis = () =>{
        if(mobVis){
            setMobVis(false)
        }
        else{
            setMobVis(true)
        }
    }

    const handleBlur = ()=>{
        setAB(false)
    }
    return(
        <>
            {
                windowWidth > 768 &&
                <div className="sidebar">
                    {/* <div className='popUp' style={{visibility:`${popUpVis}`}} onClick={()=>{setPUV('hidden')}}>
                        <div className='content'>
                            <input className='cardTitle' placeholder='List Title (Eg: To Do, Doing etc..)' onChange={(e)=>{setBN(e.target.value)}}></input>
                            <button className='done' onClick={()=>{handleAdd2()}}>Create</button>
                        </div>
                    </div> */}
                    <p className='heading'>Your Boards</p>
                    <button className='Add' onClick={()=>{handleAdd1()}}>Add new board +</button>
                    <div className='boards'>
                        {
                            addBoard && 
                            <input onChange={(e)=>{setBN(e.target.value)}}   
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAdd2();
                                    }
                                }} 
                                placeholder='Card Title' type='text'
                                onBlur={handleBlur}
                                >
                            </input>
                        }
                        { 
                            userBoards.map((board)=>(
                                    <>
                                        {currentBoard == board && 
                                            <p onClick={()=>{handleBoardView(board)}} className='curBoard'><p>{board.boardName} </p>
                                                <button onClick={()=>{closeBoard(board)}} className='btn'> 🗑</button>
                                            </p>
                                        }
                                        {currentBoard != board && 
                                            <p onClick={()=>{handleBoardView(board)}} className='notCurBoard'>{board.boardName}</p>
                                        }
                                    </>
                            ))
                        }
                    </div>
                </div>
            }
            {
                windowWidth < 768 && !mobVis &&
                <button className='sideBarBtn' onClick={()=>{handleMobVis()}}>⇛</button>
            }
            {
                windowWidth < 768 && mobVis && 
                <div className="sidebarMob">
                    {/* <div className='popUp' style={{visibility:`${popUpVis}`}} onClick={()=>{setPUV('hidden')}}>
                        <div className='content'>
                            <input className='cardTitle' placeholder='List Title (Eg: To Do, Doing etc..)' onChange={(e)=>{setBN(e.target.value)}}></input>
                            <button className='done' onClick={()=>{handleAdd2()}}>Create</button>
                        </div>
                    </div> */}
                    <button className='sideBarBtn' onClick={()=>{handleMobVis()}}>⇚</button>
                    <p className='heading'>Your Boards</p>
                    <button className='Add' onClick={()=>{handleAdd1()}}>Add new board +</button>
                    <div className='boards'>
                        {
                            addBoard && 
                            <input onChange={(e)=>{setBN(e.target.value)}}   
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAdd2();
                                    }
                                }} 
                                placeholder='Card Title' type='text'
                                onBlur={handleBlur} autoFocus
                                >
                            </input>
                        }
                        { 
                            userBoards.map((board)=>(
                                    <>
                                        {currentBoard == board && 
                                            <p onClick={()=>{handleBoardView(board)}} className='curBoard'><p>{board.boardName} </p>
                                                <button onClick={()=>{closeBoard(board)}} className='btn'> 🗑</button>
                                            </p>
                                        }
                                        {currentBoard != board && 
                                            <p onClick={()=>{handleBoardView(board)}} className='notCurBoard'>{board.boardName}</p>
                                        }
                                    </>
                            ))
                        }
                    </div>
                </div>
            }
        </>
    )
}
export default Sidebar