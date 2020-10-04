import React, { useState, useEffect, useRef } from 'react';
import {
    BrowserRouter as Router,
    Link
} from "react-router-dom";
import './mainpage.css'
import codeShareGIF from './coded-shareGIF.gif'
import { TimelineLite, TweenMax, Power3 } from 'gsap';

function MainPage(props) {
    const socket = props.socket
    const char_list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    const length = 6
    const [code, setCode] = useState("")

    let app = useRef(null)
    let content = useRef(null)
    let image = useRef(null)
    let button = useRef(null)
    let headlineFirst = useRef(null)
    let headlineSecond = useRef(null)
    let headlineThird = useRef(null)
    let tl = new TimelineLite({ delay: .4 });



    const generateCode = () => {
        let text = ""
        for (let i = 0; i < length; i++) {
            text += char_list.charAt(Math.floor(Math.random() * char_list.length));
        }
        setCode(text)
    }

    useEffect(() => {
        if (code != "") {
            socket.emit('created-room', code)
            console.log('CREATED-ROOM')
        }

    }, [code])

    useEffect(() => {
        //content vars
        // const headlineFirst = content.children[0].children[0];
        // const headlineSecond = headlineFirst.nextSibling;
        // const headlineThird = headlineSecond.nextSibling;
        const contentP = content.children[1];
        // const contentButton = content.children[2];

        //Remove initial flash
        TweenMax.to(app, 0, { css: { visibility: 'visible' } })
        // TweenMax.to(button, 5.5, { css: { visibility: 'visible' } })
        TweenMax.to(button, 1, { opacity:1, delay:3 });
        TweenMax.to(headlineThird, 1, { opacity:1, delay:2 });


        tl.from(image, 0.6, {y: 1280, ease: Power3.easeOut},'Start')

        // Content Animation
        tl.staggerFrom([headlineSecond], 1, {
            y: 0,
            ease: Power3.easeOut,
            delay: .4
        }, .15, 'Start')
            .from(contentP, 1, { y: 40, opacity: 0, ease: Power3.easeOut }, 0.8)
            // .from(contentButton, 1, { y: 20, opacity: 0, ease: Power3.easeOut }, 1.6)

    }, [tl])

    const newTo = {
        pathname: `/editor/${code}`,
        state: code
    };
    return (
        <div className="main" ref={el => app = el}>
            <nav class="navbar">
                <Link to="/" className="logo">CodeLive</Link>
                <ul class="nav-links">

                    <li class="nav-item link"><Link to="/register">Sign up</Link></li>
                    <li class="nav-item login link "><Link to="/login">Log in</Link></li>
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
                        <img src={codeShareGIF} className="codeShareGIF" ref={el => image = el}/>
                    </div>
                    <div className="headlineThird container-flex-intro-continue" ref={el => headlineThird = el}>
                        Supports multiple languages with no limit on participants.
                    </div>
                </div>

            </div>
            <div className="create-room ui text container" style={{ textAlign: "center" }} ref={el => button = el}>
                <div onClick={generateCode}  
                    className="ui huge black button"
                    style={{ marginTop: "5vh", marginRight: "0em" }}
                >
                    Create a Room
                </div>
            </div>
            {code.length > 0 &&
                <div className="ui text container" style={{ textAlign: "center" }}>
                    <h1 style={{ marginTop: "1.5em", marginRight: "0em" }} ><Link to={newTo}>Join</Link></h1>

                </div>
            }


        </div >);
}

export default MainPage;