import React, { Component, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { logoutUser } from "../../actions/authActions";
import './dashboard.css'
import { TimelineLite, TweenMax, Power3 } from 'gsap';
import jwt_decode from "jwt-decode";

const Dashboard = (props) => {
  const socket = props.socket
  const [heading, setHeading] = useState("Hey")
  const headings = ["Bonjour", "Hola", "Namaste"]
  const [currentCount, setCount] = useState(0);
  const [render, setRender] = useState(true)
  const [name, setName] = useState("")
  const timer = () => setCount(currentCount + 1);
  const char_list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  const length = 6
  const [code, setCode] = useState("")
  let hello = useRef(null)
  let helloHidden = useRef(null)
  let infoHidden = useRef(null)
  let infoHiddenContinue = useRef(null)
  let linkInfo = useRef(null)
  let button = useRef(null)
  let history = useHistory();

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

  useEffect(() => {
    if (currentCount > 1) {
      return;
    }
    const id = setInterval(timer, 1000);
    return () => clearInterval(id);
  }, [currentCount]);
  console.log(currentCount)

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

    // // TweenMax.to(button, 5.5, { css: { visibility: 'visible' } })
    // TweenMax.to(headlineThird, 0.5, { opacity: 1, delay: 2 });
    // TweenMax.to(button, 0.5, { opacity: 1, delay: 2.5 });
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

    // tl.from(helloHidden, 1, { y: -880, ease: Power3.easeOut }, 'Start')
    // tl.staggerFrom([helloHidden], 1, {
    //   y: 0,
    //   ease: Power3.easeOut,
    //   delay: 4.5
    // }, .15, 'Start')

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
        >
          Create a Room
                </div>
      </div>
    </div>);
}

export default Dashboard;

// class Dashboard extends Component {
//   onLogoutClick = (e) => {
//     e.preventDefault();
//     this.props.logoutUser();
//     // window.location.href = "./login";
//   };

//   render() {
//     const { user } = this.props.auth;
//     return (
//       <div className="flex-dashboard">
//         <h1>Hi!</h1>

//       </div>
      // <div className="ui text container center">
      //   <div className="row">
      //     <h4>
      //       <b>Hi</b>
      //     </h4>{" "}
      //     {user.name.split(" ")[0]} <p>You are logged in.</p>
      //   </div>
      //   <div class="ui button" onClick={this.onLogoutClick}>
      //     Logout
      //   </div>
      // </div>
//     );
//   }
// }

// Dashboard.propTypes = {
//   logoutUser: PropTypes.func.isRequired,
//   auth: PropTypes.object.isRequired,
// };

// const mapStateToProps = (state) => ({
//   auth: state.auth,
// });

// export default connect(mapStateToProps, { logoutUser })(Dashboard);
