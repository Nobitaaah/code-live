import React, { useState, useEffect, useRef } from 'react'
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  BrowserView,
  MobileView
} from "react-device-detect";
import './editor.css'
import axios from "axios";

import { ControlledEditor } from "@monaco-editor/react"
import { FaRegLightbulb } from 'react-icons/fa';
import { RiSunLine, RiCheckFill } from 'react-icons/ri';


// Code editor
const Editor = (props) => {

  const socket = props.socket

  // Change theme of editor
  const [theme, setTheme] = useState("dark")
  // Default language JS
  const [language, setLanguage] = useState("63")
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
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
  let { id } = useParams();

  // Check if room exists
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

  // For theme of code editor
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  // If language changes on one socket, emit to all other
  useEffect(() => {
    socket.emit('language-change', language)
  }, [language])


  // If there is a code change on a socket, emit to all other
  useEffect(() => {
    socket.emit('code-change', message)
    console.log("CODE-CHANGE: " + message)
  }, [message])

  // If there is a title change on a socket, emit to all other
  useEffect(() => {
    console.log("Title Updating")
    socket.emit('title-change', title)
  }, [title])


  // Recieve code, title and language changes
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
      if (data === false) {
        setValid(false)
      } else {
        socket.emit('join-room', id)
      }

    })

    socket.on('request-info', (data) => {
      setSendInitialData(true)
    })

    // Triggered if new user joins
    socket.on('accept-info', (data) => {
      console.log(data)
      setTitleInfo(data.title)
      setLanguage(data.language)
    })

    // Update participants
    socket.on('joined-users', (data) => {
      setUsers(data)
    })

  }, [])


  // If a new user join, send him current language and title used by other sockets.
  useEffect(() => {
    if (sendInitialData == true) {
      socket.emit('user-join', { title: title, language: language })
      setSendInitialData(false)
    }
  }, [sendInitialData])
  const languages = {
    "63": "javascript",
    "70": "python",
    "54": "c++",
    "49": "c",
    "62": "java",
    "60": "go"
  }

  const changeLanguage = (e) => {
    setLanguage(e.target.value)
  }

  const titleUpdating = (e) => {
    setTitleInfo(e.target.value)
    setTitleChange(true)
  }

  const titleUpdated = (e) => {
    setTitle(titleInfo)
    setTitleChange(false)
  }

  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      language_id: parseInt(language),
      // encode source code in base64
      source_code: btoa(message),
      stdin: btoa(customInput),
    };
    const options = {
      method: "POST",
      url: process.env.REACT_APP_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("res.data", response.data);
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        // get error status
        let status = err.response.status;
        setProcessing(false);
      });
  };

  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: process.env.REACT_APP_RAPID_API_URL + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token)
        }, 2000)
        return
      } else {
        setProcessing(false)
        // setOutputDetails(response.data)
        if (response.data.stderr) {
          alert(atob(response.data.stderr))
        } else {
          alert(atob(response.data.stdout))
        }
        return
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
    }
  };

  const renderTrue = () => {
    return (
      <>
        <BrowserView>
          <div className="navBar">

            <div className={theme === "light" ? 'listButton-light' : 'listButton-dark'}>
              <Link to="/" className="logoEditor">CodeLive</Link>
              {theme === "light" &&
                <FaRegLightbulb className="bulbIcon" onClick={toggleTheme} disabled={!isEditorReady}></FaRegLightbulb>

              }
              {theme !== "light" &&

                <RiSunLine className="sunIcon" onClick={toggleTheme} disabled={!isEditorReady}></RiSunLine>
              }

              <select className={theme === "light" ? 'select-light' : 'select-dark'} onChange={changeLanguage} value={language}>
                <option value="63">Javascript</option>
                <option value="70">Python</option>
                <option value="54">C++</option>
                <option value="49">C</option>
                <option value="62">Java</option>
                <option value="60">Go</option>
              </select>

              <span className={theme === "light" ? 'language-name-light' : 'language-name-dark'}>Participants: {users}</span>
              <span className="compil-buttom">
                <button className={theme === "light" ? 'input-light' : 'input-dark'} type="text" onClick={handleCompile}>Compile</button>
              </span>


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
        </BrowserView>
        <MobileView>
          <div className="mobile-notValid">
            <h1>Unfortunately, the code editor doesn't work on mobile. There are bugs that we still need to fix before we provide the mobile functionality.</h1>
            <h1>Kindly use on a Desktop.</h1>
          </div>
        </MobileView>
      </>
    )
  }

  const renderFalse = () => {
    return (
      <>
        <h4>There seems to be no room here.</h4>
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
