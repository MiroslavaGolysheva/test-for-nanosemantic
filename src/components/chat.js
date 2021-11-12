import React, { useRef, useEffect, useState, createRef } from "react";
import imageBot from '../assets/header/bot.jpg'
import imageSend from '../assets/textinput/send.png'
import imageDelete from '../assets/textinput/delete.png'
import { v4 as uuidv4 } from 'uuid';

export default function Chat() {

    const [list, setList] = useState([{"text" : resJson.result.text.value, sending : "bot", id: uuidv4()}]);
    const [text, setText] = useState(''); 
    const messagesEndRef = useRef(null)

    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }) 
    } 

    const handleChange = (event) => {
        setText(event.target.value);
    } 
    
    const handleAdd = () =>{ 

        fetch("https://biz.nanosemantics.ru/api/bat/nkd/json/Chat.request", {
        method: "POST",
        body: JSON.stringify({
            cuid: "d31f2720-fe65-46ae-aa16-e05b6f3a7b42",
            text: text
        })
        })
        .then(res => {
            res.json()
            .then(resJson => {
               
                const newList = list.concat(
                    {text, sending : "user" , id: uuidv4()}, 
                    {"text" : resJson.result.text.value, sending : "bot", id: uuidv4()}) 
        
                setList(newList);
                localStorage.setItem('list', JSON.stringify(newList));
                setText('');
            })
        }) 
        .catch(error => console.log(error)); 
        
    }

    const handleDelete = () => {
        localStorage.clear()
        setList([]);
    }
 
    useEffect(() => { 
        const list = JSON.parse(localStorage.getItem('list')) 
        const listitem = list != null ? list : []
        setList(listitem);  
    }, []);

    useEffect(() => {  
        scrollToBottom()  
    });
    
    return (
        <div className="chat">
            <div className="chat__header">
                <div className="chat__header-item">
                    <img src={imageBot} alt="imageBot" /> 
                    <p>Bot_Name</p>
                </div> 
            </div>
            <div className="chat__messenger"> 
                <div className="chat__messenger-scroll" >
                {list.map((item) => (
                    <div key={item.id} className={item.sending == "bot" ? "bot" : "user"} >
                        <div className="itemlist" dangerouslySetInnerHTML={{ __html: item.text }}></div> 
                        <div ref={messagesEndRef} />
                    </div>
                ))}
                </div>
            </div>
            <div className="chat__textinput"> 
                <input 
                    type="text" 
                    value={text} 
                    onChange={handleChange} 
                    placeholder="Написать сообщение..." 
                    className="chat__textinput-input"  
                /> 
              
                <div className="chat__textinput-conBtn">
                    <button className="chat__textinput-btn" onClick={handleAdd}>
                        <img src={imageSend} alt="imageSend" /> 
                    </button>
                    <button className="chat__textinput-btn delete" onClick={handleDelete}>
                        <img src={imageDelete} alt="imageDelete" /> 
                    </button>
                </div>
                
            </div>
        </div>
    );
}