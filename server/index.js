const express = require("express");
const cors = require("cors")

const app = express();
const PORT = 3000;

app.use(
    cors({
        //insert domain here
        origin: true,
    })
)

app.use(express.json())


//ROUTE
app.get("/", (req, res) => {
    res.send("Welcome to the node server!!")
});

//ANOTHER ROUTE
app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello from the API!"})
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});