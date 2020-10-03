import axios from "axios";

const setAuthToken = (token) => {
  if (token) {
    // Apply auth token toevery req if logged in
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    // Delete auth header
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
