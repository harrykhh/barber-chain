# barber-chain
> Barber chain application using MEN (Mongo, Express, Node) stack

## Quick Start

Add your MONGO_URI and user password to the d/server/config/config.json file. Make sure you set an env var for that on deployment

```bash
# Install dependencies for server
npm install

# Run the server with concurrently
node --harmony app.js

# Server runs on http://localhost:3000
```

## Deployment

There is a Heroku post build script so that you do not have to compile your React frontend manually, it is done on the server. Simply push to Heroku and it will build

## App Info
```bash
Demo of application [HERE](https://moonstonedev.herokuapp.com/)

Regular user:
username: test1
Password: test1

Admin user:
username: admin
Password: admin
```

### Author

Harry Ho

### Version

0.0.2

### License

This project is licensed under the MIT License
