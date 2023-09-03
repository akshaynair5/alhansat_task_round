import { useContext, useEffect, useState } from 'react'
import './board.scss'
import { Authcontext } from '../../contextProvider'
import { db } from '../../firebaseconfig';
import { collection, orderBy, query, updateDoc, where } from "firebase/firestore";
import { getDocs, doc } from "firebase/firestore";
import icon from '../../images/icon1.jpg'

function Board(){
    const {currentUser} = useContext(Authcontext)
    const {currentBoard,setCurrentBoard} = useContext(Authcontext)
    const [defaultBoard,setDefaultBoard] = useState(false)
    const [newCardName,setNewCardName] = useState('')
    const [cards,setCards] = useState([])
    const [vis,setVis] = useState(false)
    const [optView,setOptView] = useState(false)
    const [editMess,setEditMess] = useState(false)
    const [data,setData] = useState([])
    const [newMessage,setNewMessage] = useState('')
    const [addMessVis,setMV] = useState(false)
    const [currCardNo,setCCN] = useState()
    const [currMessNo,setCMN] = useState()
    const [updatedMessage,setUpdatedMessage] = useState('')
    const userDataRef = collection(db,'userData')

    useEffect(()=>{
        setCards(currentBoard.cards)
        setDefaultBoard(false)
    },[currentBoard])
    // useEffect(()=>{
    //     let temp = currentBoard
    //     temp.cards = cards
    //     setCurrentBoard(temp)
    //     console.log(cards)
    // },[cards])

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
              if(temp1[0].boards[0]){
                setCurrentBoard(temp1[0].boards[0])
              }
              else{
                setDefaultBoard(true)
              }
              console.log(temp1)
          } catch (err) {
              console.log(err)
          }
        }
        fetchUserChaps()
      },[])



    const cardDelete = (c) =>{
        let temp = cards;
        for(let i=0;i<temp.length;i++){
            if(temp[i].cardID == c.cardID){
                temp.splice(i,1);
            }
        }
        updateChanges(temp);
        setCards(temp)
    }


    
    const updateChanges = async (temp)=>{
        let temp2 = currentBoard
        temp2.cards = temp;
        let boards = data.boards;
        if(boards && currentBoard){
            for(let i=0;i<boards.length;i++){
                if(boards[i].id == currentBoard.id){
                    boards[i] = temp2;
                    break;
                }
            }
            await updateDoc(doc(db, "userData", currentUser.uid), {
                "boards" : boards
            }).then(()=>{
                setCCN('')
                setCMN('')
            })
        }
    }




    const handleAddCard1=()=>{
        setVis('visible')
    }
    const HandleSubmit = async()=>{
        let temp = currentBoard.cards
        let temp2 = currentBoard
        const id = Math.floor(Date.now() / 1000);
        temp = [...temp,{CardTitle:`${newCardName}`,messages:[],cardID:'C'+`${id}`}]
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
        setCurrentBoard(temp2)
        setCards(temp)
    }



    const addMessInitiator = (card)=>{
        setMV(true)
        setCCN(card.cardID)
    }
    const handleAddMessage = (card) =>{
        let messCur = card.messages;
        const id = Math.floor(Date.now() / 1000);
        messCur = [...messCur,{message:newMessage,messID:'M'+`${id}`}];
        let temp = cards;
        for(let i=0;i<temp.length;i++){
            if(temp[i].CardTitle == card.CardTitle){
                temp[i].messages = messCur
                break;
            }
        }
        setMV(false)
        setCCN()
        setCards(temp)
        updateChanges(temp)
    }



    const editMessInitiator = (messID) =>{
        setCMN(messID)
        setEditMess(true)
    }
    const HandleEdit = (message,card) =>{
        let m = message
        let c = card;
        m.message = updatedMessage;
        for(let i=0;i<c.messages.length;i++){
            if(c.messages[i].messID == m.messID){
                c.messages[i] = m;
            }
        }
        let temp = cards
        for(let i=0;i<temp.length;i++){
            if(temp[i].cardID == c.cardID){
                temp[i] = c;
            }
        }
        updateChanges(temp)
        setCards(temp);
        setEditMess(false)
        setCMN();
    }




    const optViewInitial = (messID) =>{
        setOptView(true)
        setCMN(messID)
    }
    const handleMoveMess = (message,c,card) =>{
        let newC = c;
        let old = card;
        for(let i=0;i<old.messages.length;i++){
            if(old.messages[i].messID == message.messID){
                old.messages.splice(i,1);
            }
        }
        let newCMessages = newC.messages
        newCMessages = [...newCMessages,message];
        newC.messages = newCMessages;

        let AllCards = cards;
        for(let i=0;i<AllCards.length;i++){
            if(AllCards[i].cardID == newC.cardID){
                AllCards[i] = newC
            }
            else if(AllCards[i].cardID == old.cardID){
                AllCards[i] = old
            }
        }
        updateChanges(AllCards)
        setCards(AllCards)
        setOptView(false)
        setCMN()
    }


    return(
        <div className="board">
            {
                !defaultBoard && 
                <>
                    <p className='heading'>{currentBoard.boardName}</p>
                    <div className='cards' >
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
                                        <div className='cardHeading'>
                                            <p>{card.CardTitle}</p>
                                            {/* <button className='edit'>✎</button> */}
                                            <button className='delete' onClick={()=>{cardDelete(card)}}>🗑</button>
                                        </div>
                                        {messages && 
                                            messages.map((message)=>{
                                                return(
                                                    <>
                                                        {
                                                            (currMessNo != message.messID || !editMess) &&
                                                            <div className='message'>
                                                                <p onClick={()=>{optViewInitial(message.messID)}}>{message.message}</p>
                                                                {
                                                                    optView && currMessNo == message.messID &&
                                                                    <div className='options'>
                                                                            <p>Move to:</p>
                                                                            {
                                                                                cards.map((c)=>{
                                                                                    return(
                                                                                        <>
                                                                                            {
                                                                                                c != card && 
                                                                                                <p onClick={()=>{handleMoveMess(message,c,card)}} className='cardsList'>{c.CardTitle}</p>
                                                                                            }
                                                                                        </>
                                                                                    )
                                                                                })
                                                                            }
                                                                    </div>
                                                                }
                                                                <button className='editMess' onClick={()=>{editMessInitiator(message.messID)}}>✎</button>
                                                            </div>
                                                        }
                                                        {
                                                                currMessNo == message.messID && editMess &&
                                                                <div className='message'>
                                                                    <input onChange={(e)=>{setUpdatedMessage(e.target.value)}}   
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') {
                                                                                HandleEdit(message,card)
                                                                            }
                                                                        }} 
                                                                        placeholder={`${message.message}`} type='text'>
                                                                    </input>
                                                                </div>
                                                        }
                                                    </>
                                                )
                                            })
                                        }
                                        {(!addMessVis || currCardNo != card.cardID) &&
                                            <button className='addMessage' onClick={()=>{addMessInitiator(card)}}>Add message +</button>
                                        }
                                        {addMessVis && currCardNo == card.cardID &&
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
                </>
            }
            {
                defaultBoard &&
                <div className='defaultBoard'>
                    {/* <img src={icon}></img> */}
                    <div className='content'>
                        <p className='p1'>You currently have no boards!!!</p>
                        <p className='p2'>Click on the 'Add new board +' button on the sidebar to plan out and manage your new objectives!!</p>
                        {/* <button onClick={()=>{handleAddCard1()}} className='addCard'>Add new Card +</button> */}
                    </div>  
                </div>
            }
        </div>
    )
}
export default Board