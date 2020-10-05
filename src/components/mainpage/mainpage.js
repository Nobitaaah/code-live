import React, { useState, useEffect, useRef } from 'react';
import {
    BrowserRouter as Router,
    Link,
    useHistory
} from "react-router-dom";
import './mainpage.css'
import codeShare from './codeShare.gif'
import { TimelineLite, TweenMax, Power3 } from 'gsap';
import jwt_decode from "jwt-decode";
import jwt from 'jsonwebtoken'
import {FaGithub } from 'react-icons/fa';

function MainPage(props) {
    const socket = props.socket
    const char_list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    const length = 6
    const [code, setCode] = useState("")
    const [name, setName] = useState("")
    const [render, setRender] = useState(true)
    const history = useHistory();
    let app = useRef(null)
    let content = useRef(null)
    let image = useRef(null)
    let button = useRef(null)
    let headlineFirst = useRef(null)
    let headlineSecond = useRef(null)
    let headlineThird = useRef(null)
    let tl = new TimelineLite({ delay: .4 });

    if (render == true) {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decoded = jwt_decode(token);
            
            // jwt.verify(token, 'rohanforpm', function(err, decoded) {
            //     console.log(err)
            //     console.log(decoded) // bar
            //   });
            // console.log(decoded_)
            setName(decoded.name)
            setRender(false)
        }
    }

    const generateCode = () => {
        let text = ""
        for (let i = 0; i < length; i++) {
            text += char_list.charAt(Math.floor(Math.random() * char_list.length));
        }
        setCode(text)
    }

    useEffect(() => {
        if (code != "") {
            if (name == "") {
                history.push(`/register`)
            } else {
                socket.emit('created-room', code)
                console.log('CREATED-ROOM')
                history.push(`/editor/${code}`)
            }
        }

    }, [code])

    useEffect(() => {

        //content vars

        const contentP = content.children[1];

        //Remove initial flash
        TweenMax.to(app, 0, { css: { visibility: 'visible' } })
        // TweenMax.to(button, 5.5, { css: { visibility: 'visible' } })
        TweenMax.to(headlineThird, 0.5, { opacity: 1, delay: 2 });
        TweenMax.to(button, 0.5, { opacity: 1, delay: 2.5 });
        


        tl.from(image, 0.6, { y: 1280, ease: Power3.easeOut }, 'Start')

        // Content Animation
        tl.staggerFrom([headlineSecond], 1, {
            y: 0,
            ease: Power3.easeOut,
            delay: .2
        }, .15, 'Start')
            .from(contentP, 1, { y: 40, opacity: 0, ease: Power3.easeOut }, 0.6)
        // .from(contentButton, 1, { y: 20, opacity: 0, ease: Power3.easeOut }, 1.6)

    }, [tl])

    const newTo = {
        pathname: `/editor/${code}`,
        state: code
    };

    const onLogoutClick = (e) => {
        localStorage.removeItem("jwtToken");
        window.location.reload();
    };

    return (
        <div className="mainPage" ref={el => app = el}>
            <nav class="navbar">
                <Link to="/" className="logo">CodeLive</Link>
                <ul class="nav-links">
                    {name != "" ?
                        <>
                        <li class="nav-item linkAnim"><a href="https://github.com/Nobitaaah/code-live">Github</a></li>
                        <li class="nav-item">Hello, {name}</li>
                            <li class="nav-item login linkAnim "><Link to="/" onClick={onLogoutClick}>Log out</Link></li></ > :
                        <>
                        <li class="nav-item linkAnim"><a href="https://github.com/Nobitaaah/code-live">Github</a></li>
                        <li class="nav-item linkAnim"><Link to="/register">Sign up</Link></li>
                            <li class="nav-item login linkAnim "><Link to="/login">Log in</Link></li></ >}
                </ul>
            </nav>

            <div className="container-flex">
                <div className="container-flex-info" ref={el => content = el}>
                    <div className="container-flex-title" ref={el => headlineFirst = el}>
                        Live code sharing made easy.
                    </div>
                    <div className="container-flex-intro" ref={el => headlineSecond = el}>
                        Share your code with others for interviews, troubleshooting, teaching & more!
                    </div>

                    <div className="container-flex-intro-video">
                        <img src={codeShare} className="codeShareGIF" ref={el => image = el} />
                    </div>
                    <div className="headlineThird container-flex-intro-continue" ref={el => headlineThird = el}>
                        Supports multiple languages with no limit on participants.
                    </div>
                </div>

            </div>
            <div className="create-room-main ui text container" style={{ textAlign: "center" }} ref={el => button = el}>
                <div onClick={generateCode}
                    className="ui huge black button"
                    style={{ marginTop: "5vh", marginRight: "0em" }}
                >
                    Create a Room
                </div>
            </div>


        </div >);
}

export default MainPage;
