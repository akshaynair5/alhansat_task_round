import { useContext, useEffect, useState } from 'react'
import './board.scss'
import { Authcontext } from '../../contextProvider'
import { db } from '../../firebaseconfig';
import { collection, orderBy, query, updateDoc, where } from "firebase/firestore";
import { getDocs, doc } from "firebase/firestore";

function Board(){
    const {currentUser} = useContext(Authcontext)
    const {currentBoard,setCurrentBoard} = useContext(Authcontext)
    const [newCardName,setNewCardName] = useState('')
    const [cards,setCards] = useState([])
    const [vis,setVis] = useState(false)
    const [data,setData] = useState([])
    const [newMessage,setNewMessage] = useState('')
    const [addMessVis,setMV] = useState(false)
    const userDataRef = collection(db,'userData')

    useEffect(()=>{
        setCards(currentBoard.cards)
        localStorage.setItem('currentBoard', JSON.stringify(currentBoard));
        updateChanges()
    },[currentBoard])
    useEffect(()=>{
        let temp = currentBoard
        temp.cards = cards
        setCurrentBoard(temp)
        console.log(cards)
    },[cards])
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

    const updateChanges = async()=>{
        let temp = currentBoard
        let boards = data.boards;
        for(let i=0;i<boards.length;i++){
            if(boards[i].id == currentBoard.id){
                boards[i] = temp;
                break;
            }
        }
        await updateDoc(doc(db, "userData", currentUser.uid), {
            "boards" : boards
        })
    }
    const handleAddCard1=()=>{
        setVis('visible')
    }
    const HandleSubmit = async()=>{
        let temp = currentBoard.cards
        let temp2 = currentBoard
        temp = [...temp,{CardTitle:`${newCardName}`,messages:[]}]
        temp2.cards = temp
        let boards = data.boards;
        for(let i=0;i<boards.length;i++){
            if(boards[i].id == currentBoard.id){
                boards[i] = temp2;
                break;
            }
        }
        console.log(boards)
        await updateDoc(doc(db, "userData", currentUser.uid), {
            "boards" : boards
        })
        setVis(false)
        setCurrentBoard(temp)
    }

    const handleAddMessage = (card) =>{
        let messCur = card.messages;
        messCur = [...messCur,newMessage];
        let temp = cards;
        for(let i=0;i<temp.length;i++){
            if(temp[i].CardTitle == card.CardTitle){
                temp[i].messages = messCur
                break;
            }
        }
        setCards(temp)
        setMV(false)

    }
    return(
        <div className="board">
            <p className='heading'>{currentBoard.boardName}</p>
            <div className='cards'>
                {
                    !vis && 
                    <button onClick={()=>{handleAddCard1()}} className='addCard'>Add new Card +</button>
                }
                {
                    vis && 
                    <div className='card'>
                        <input onChange={(e)=>{setNewCardName(e.target.value)}}   
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    HandleSubmit();
                                }
                            }} 
                            placeholder='Card Title' type='text'>
                        </input>
                    </div>
                }
                {cards &&
                    cards.map((card)=>{
                        let messages = card.messages;
                        return(
                            <div className='card'>
                                <p className='cardHeading'>{card.CardTitle}</p>
                                {messages && 
                                    messages.map((message)=>(
                                        <p>{message}</p>
                                    ))
                                }
                                {!addMessVis &&
                                    <button className='addMessage' onClick={()=>{setMV(true)}}>Add message</button>
                                }
                                {addMessVis && 
                                    <input onChange={(e)=>{setNewMessage(e.target.value)}}   
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleAddMessage(card);
                                            }
                                        }} 
                                        placeholder='Message Title' type='text'>
                                    </input>
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
export default Board