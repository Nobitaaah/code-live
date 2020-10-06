import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";

import './dashboard.css'

import { TimelineLite, TweenMax, Power3 } from 'gsap';

import jwt_decode from 'jwt-decode'

const Dashboard = (props) => {

  const socket = props.socket
  const headings = ["Bonjour", "Hola", "Namaste"]
  const [currentCount, setCount] = useState(0);
  const [render, setRender] = useState(true)
  const [name, setName] = useState("")

  const timer = () => setCount(currentCount + 1);
  const char_list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  const length = 6
  const [code, setCode] = useState("")


  // GSAP ref
  let hello = useRef(null)
  let helloHidden = useRef(null)
  let infoHidden = useRef(null)
  let infoHiddenContinue = useRef(null)
  let linkInfo = useRef(null)
  let button = useRef(null)
  let history = useHistory();

  // New GSAP timeline.
  let tl = new TimelineLite({ delay: .4 });

  if (render == true) {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decoded = jwt_decode(token);
      setName(decoded.name)
      setRender(false)
    }
  }


  // For Hello headings.
  useEffect(() => {
    if (currentCount > 1) {
      return;
    }
    const id = setInterval(timer, 1000);
    return () => clearInterval(id);
  }, [currentCount]);

  // Create a code for the room.
  const generateCode = () => {
    let text = ""
    for (let i = 0; i < length; i++) {
      text += char_list.charAt(Math.floor(Math.random() * char_list.length));
    }
    setCode(text)
  }

  // Create a room and redirect user.
  useEffect(() => {
    if (code !== "") {
      if (name === "") {
        history.push(`/register`)
      } else {
        socket.emit('created-room', code)
        console.log('CREATED-ROOM')
        history.push(`/editor/${code}`)
      }
    }

  }, [code])

  useEffect(() => {

    // GSAP animations, no timeline :(
    TweenMax.to(hello, 2, { css: { display: 'none' } })
    TweenMax.to(helloHidden, 1, { css: { display: 'inherit' }, delay: 4.5 })
    TweenMax.to(helloHidden, 1, { y: -60, ease: Power3.easeOut, delay: 4.5 })
    TweenMax.to(infoHidden, 3, { css: { display: 'inherit' }, delay: 4.5 })
    TweenMax.to(infoHidden, 1, { y: -40, opacity: 1, ease: Power3.easeInOut, delay: 5.5 })
    TweenMax.to(infoHiddenContinue, 4, { css: { display: 'inherit' }, delay: 4.5 })
    TweenMax.to(infoHiddenContinue, 1, { y: -20, opacity: 1, ease: Power3.easeInOut, delay: 6.5 })
    TweenMax.to(linkInfo, 5, { css: { display: 'inherit' }, delay: 4.5 })
    TweenMax.to(linkInfo, 1, { y: 0, opacity: 1, ease: Power3.easeInOut, delay: 7.5 })
    TweenMax.to(button, 0.5, { opacity: 1, delay: 5.5 });

  }, [tl])

  return (

    <div className="dashboard">
      <h1 ref={el => hello = el} className="heading">{headings[`${currentCount}`]}</h1>
      <h1 ref={el => helloHidden = el} className="heading-visible">Hello, {name}</h1>
      <h1 className="intro" ref={el => infoHidden = el}>Your dashboard is pretty empty right now.</h1>
      <h1 className="introContinue" ref={el => infoHiddenContinue = el}>More features have been planned for this project.</h1>
      <h1 className="introContinue" ref={el => linkInfo = el}>Have fun.</h1>
      <div className="create-room ui text container" style={{ textAlign: "center" }} ref={el => button = el}>
        <div onClick={generateCode}
          className="ui huge black button"
          style={{ marginTop: "0vh", marginRight: "0em" }}
        >Create a Room</div>
      </div>
    </div>
  );
}

export default Dashboard;

