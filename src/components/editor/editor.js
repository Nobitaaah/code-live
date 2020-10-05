import React, { useState, useEffect, useRef } from 'react'
import './editor.css'
import { ControlledEditor } from "@monaco-editor/react"
import { useLocation, useParams } from "react-router-dom";
import { FaRegLightbulb } from 'react-icons/fa';
import { RiSunLine, RiCheckLine, RiCheckFill } from 'react-icons/ri';
import jwt_decode from "jwt-decode";
import { compareSync } from 'bcryptjs';
import {
    BrowserRouter as Router,
    Link,
    useHistory
} from "react-router-dom";

// Code editor
const Editor = (props) => {

    const socket = props.socket

    // Change theme of editor
    const [theme, setTheme] = useState("dark")
    // Default language JS
    const [language, setLanguage] = useState("javascript")
    // Check if editor is ready
    const [isEditorReady, setIsEditorReady] = useState(false)
    // Send chunks of code on change
    const [message, setMessage] = useState("")
    // Set value of editor
    const [value, setValue] = useState('')
    const [valid, setValid] = useState(false)
    const [sendInitialData, setSendInitialData] = useState(false)
    const [users, setUsers] = useState(0)
    const [title, setTitle] = useState("Untitled")
    const [titleInfo, setTitleInfo] = useState("Untitled")
    const [titleChange, setTitleChange] = useState(false)
    const valueGetter = useRef();
    let { id } = useParams();

    useEffect(() => {
        socket.emit('room-id', id)
        setValid(true)
    }, [])

    // Ref for editor
    const editorRef = useRef()

    // Called on initialization, adds ref
    const handleEditorDidMount = (_valueGetter, editor) => {
        setIsEditorReady(true);
        editorRef.current = editor
        valueGetter.current = _valueGetter;
    }

    // Called whenever there is a change in the editor
    const handleEditorChange = (ev, value) => {
        // Set value to send over to other sockets
        setMessage(value)
    };

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light")
    }

    const toggleLanguage = () => {
        setLanguage(language === "javascript" ? "go" : "javascript")
    }

    // If language changes on one socket, emit to all other
    useEffect(() => {
        socket.emit('language-change', language)
    }, [language])


    // If there is a code change on a socket, emit to all other
    useEffect(() => {
        socket.emit('code-change', message)
    }, [message])


    useEffect(() => {
        console.log("Title Updating")
        socket.emit('title-change', title)
    }, [title])


    // Recieve code changes and language changes
    useEffect(() => {
        socket.on('code-update', (data) => {
            setValue(data)
        })
        socket.on('language-update', (data) => {
            setLanguage(data)
        })

        socket.on('title-update', (data) => {
            setTitleInfo(data)
        })

        socket.on('room-check', (data) => {
            if (data == false) {
                setValid(false)
            } else {
                socket.emit('join-room', id)
            }

        })

        socket.on('request-info', (data) => {
            setSendInitialData(true)
        })

        socket.on('accept-info', (data) => {
            console.log(data)
            setTitleInfo(data.title)
            setLanguage(data.language)
        })

        socket.on('joined-users', (data) => {
            setUsers(data)
        })

    }, [])

    useEffect(() => {
        if (sendInitialData == true) {
            socket.emit('user-join', { title: title, language: language })
            setSendInitialData(false)
        }
    }, [sendInitialData])

    const languages = ["javascript", "python", "c", "c", "java", "go"]
    const changeLanguage = (e) => {
        setLanguage(languages[e.target.value])
    }

    const titleUpdating = (e) => {
        setTitleInfo(e.target.value)
        setTitleChange(true)
    }

    const titleUpdated = (e) => {
        setTitle(titleInfo)
        setTitleChange(false)
    }

    const renderTrue = () => {
        return (
            <>
                <div className="navBar">
                    
                    <div className={theme === "light" ? 'listButton-light' : 'listButton-dark'}>
                    <Link to="/" className="logoEditor">CodeLive</Link>
                        {theme === "light" &&
                            <FaRegLightbulb className="bulbIcon" onClick={toggleTheme} disabled={!isEditorReady}></FaRegLightbulb>

                        }
                        {theme !== "light" &&

                            <RiSunLine className="sunIcon" onClick={toggleTheme} disabled={!isEditorReady}></RiSunLine>
                        }

                        <select className={theme === "light" ? 'select-light' : 'select-dark'} onChange={changeLanguage} value="language">
                            <option value="-1">Language</option>
                            <option value="0">Javascript</option>
                            <option value="1">Python</option>
                            <option value="2">C++</option>
                            <option value="3">C</option>
                            <option value="4">Java</option>
                            <option value="5">Go</option>
                        </select>

                        <span className={theme === "light" ? 'language-name-light' : 'language-name-dark'}>{language[0].toUpperCase() + language.substr(1)}</span>
                        <span className={theme === "light" ? 'language-name-light' : 'language-name-dark'}>Participants: {users}</span>
                        <div className="title-doc">
                            <input className={theme === "light" ? 'input-light' : 'input-dark'} type="text" value={titleInfo} onChange={titleUpdating}></input>
                        </div>
                        {titleChange === true &&
                            <RiCheckFill className="checkIcon" onClick={titleUpdated} disabled={!isEditorReady}></RiCheckFill>
                        }
                        

                    </div>
                    <ControlledEditor
                        height="100vh"
                        theme={theme}
                        language={language}
                        value={value}
                        editorDidMount={handleEditorDidMount}
                        onChange={handleEditorChange}
                        loading={"Loading..."}
                    />
                </div>
            </>
        )
    }

    const renderFalse = () => {
        return (
            <>
                <h1>Well 404 huh</h1>
            </>
        )
    }
    return (
        <div>
            {valid === true
                ? renderTrue()
                : renderFalse()}
        </div>
    );
}

export default Editor;
