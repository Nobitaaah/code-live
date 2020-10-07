### https://livecodeshare.herokuapp.com/

# CodeLive

An easy to use Collaborative Code Editor written using Node.js, React, Redux, Socket.io and MongoDB.

Supports auto completion and syntax highlighting for multiple languages. No limit on participants. It uses the [React wrapper](https://github.com/suren-atoyan/monaco-react#readme) for Monaco editor.

![image](https://github.com/Nobitaaah/code-live/blob/master/src/components/mainpage/codeShare.gif)

## Getting started

```bash
# Download
git clone https://github.com/Nobitaaah/code-live

cd code-live

npm install

# You need to setup a MongoDB Atlas  then replace the config vars in ./config.

node server.js

npm run start

# Go to http://localhost:3000 to see it live.
```
### TODO

- [ ] Add tests
- [ ] Add an option to save code
- [ ] Add an option for real-time compilation
- [ ] Allow webcam streaming
- [ ] Add admin controls for creator of room
- [ ] Use Docker
- [ ] Add support for mobile
- [ ] Improve code quality
