const app = require("./src/app");

const PORT = process.env.DEV_APP_PORT || 8080

const server = app.listen(PORT, () => {
    console.log("WSV eCommerce is starting... with port " + PORT)
})

// process.on('SIGINT', () => {
//     server.close(() => console.log("Exit Server Express"));
// })