import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Link
} from "react-router-dom";

function MainPage(props) {
    const socket = props.socket
    const char_list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    const length = 6
    const [code, setCode] = useState("")

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
    const newTo = {
        pathname: `/editor/${code}`,
        state: code
    };
    return (
        <div>
            <div className="ui text container" style={{ textAlign: "center" }}>
                <div onClick={generateCode}
                    className="ui huge black button"
                    style={{ marginTop: "3em", marginRight: "0em" }}
                >
                    Create a Room
                </div>
            </div>
            {code.length > 0 &&
                <div  className="ui text container" style={{ textAlign: "center" }}>
                    <h1 style={{ marginTop: "1.5em", marginRight: "0em" }} ><Link to={newTo}>Join</Link></h1>

                </div>
            }

            <div className="ui text container" style={{ textAlign: "center" }}>
                <h2 style={{ marginTop: "2.5em" }}>
                    Do whatever you want when you want to.
                </h2>

                <Link to="/register">
                    <div
                        className="ui huge black button"
                        style={{ marginTop: "3em", marginRight: "2em" }}
                    >
                        Sign Up
                    </div>
                </Link>
                <Link to="/login">
                    <div className="ui huge basic button" tabIndex="0">
                        Login
                    </div>
                </Link>
            </div>

            <button onClick={generateCode}>Click</button>
            {code.length > 0 &&

                <Link to={newTo}>Editor</Link>
            }

        </div >);
}

export default MainPage;