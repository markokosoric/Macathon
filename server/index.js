const express = require("express");
const cors = require("cors")
const multer = require('multer')

const app = express();
const PORT = 3000;

app.use(
    cors({
        //insert domain here
        origin: true,
    })
)

app.use(express.json())

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        return cb(null, "./public/Images")
    },
    filename: function(req, file, cb){
        return cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({storage})

//ROUTE
app.get("/", (req, res) => {
    res.send("Welcome to the node server!!")
});

//ANOTHER ROUTE
app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello from the API!"})
});

app.post('/upload', upload.single('file'), (req, res) => {
    console.log('Request received')
    console.log('Body:', req.body)
    console.log('File:', req.file)
    
    // Check if file was uploaded successfully
    if (!req.file) {
        console.log('No file received!')
        return res.status(400).json({ error: 'No file uploaded' })
    }
    
    // Send response back to client
    const response = {
        isScam: 0.99,
        confidence: 80,
        details: 'Analysis complete'
    }
    console.log('Sending response:', response)
    res.json(response)
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});