import React, { useState, useEffect, useRef } from 'react'
import './editor.css'
import { ControlledEditor } from "@monaco-editor/react"
import { useLocation, useParams } from "react-router-dom";


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
    const [users, setUsers] = useState(0)

    let { id } = useParams();

    useEffect(() => {
        socket.emit('room-id', id)
        setValid(true)
    }, [])

    // Ref for editor
    const editorRef = useRef()

    // Called on initialization, adds ref
    const handleEditorDidMount = (_, editor) => {
        setIsEditorReady(true);
        editorRef.current = editor
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
        setLanguage(language === "javascript" ? "python" : "javascript")
    }

    // If language changes on one socket, emit to all other
    useEffect(() => {
        socket.emit('language-change', language)
        // console.log('LANGUAGE CHANGE SENT')
    }, [language])


    // If there is a code change on a socket, emit to all other
    useEffect(() => {
        socket.emit('code-change', message)
        // console.log('MESSAGE SENT')
    }, [message])


    // Recieve code changes and language changes
    useEffect(() => {
        socket.on('code-update', (data) => {
            console.log('RECEIVED')
            setValue(data)
        })
        socket.on('language-update', (data) => {
            setLanguage(data)
        })
        socket.on('room-check', (data) => {
            if (data == false) {
                setValid(false)
            } else {
                socket.emit('join-room', id)
            }

        })

        socket.on('joined-users', (data) => {
            setUsers(data)
        })

    }, [])



    const renderTrue = () => {
        return (
            <>
                <div className={theme === "light" ? 'listButton-light' : 'listButton-dark'}>
                    <button onClick={toggleTheme} disabled={!isEditorReady}>
                        Toggle theme
                </button>
                    <button onClick={toggleLanguage} disabled={!isEditorReady}>
                        Toggle language
                </button>
                    <span className={theme === "light" ? 'language-name-light' : 'language-name-dark'}>{language[0].toUpperCase() + language.substr(1)}</span>
                    <span className={theme === "light" ? 'language-name-light' : 'language-name-dark'}>Participants: {users}</span>
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
