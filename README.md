# CodeLive

An easy to use Collaborative Code Editor written using Node.js, React, Redux and MongoDB.

Support auto completion and syntax highlighting for multiple languages. No limit on participants.Below the hood, it uses the [React wrapper](https://github.com/suren-atoyan/monaco-react#readme) for Monaco editor.

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
## Project Layout

├───config
├───models
├───public
├───routes
│   └───api
├───src
│   ├───actions
│   ├───components
│   │   ├───auth
│   │   ├───dashboard
│   │   ├───editor
│   │   ├───layout
│   │   ├───mainpage
│   │   └───private-route
│   ├───reducers
│   └───utils
└───validation

### TODO

- [ ] Add tests
- [ ] Add an option to save code
- [ ] Add an option for real-time compilation
- [ ] Allow webcam streaming
- [ ] Add admin controls for creator of room
- [ ] Use Docker
- [ ] Improve code qualitygit