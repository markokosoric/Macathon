const express = require("express");
const cors = require("cors")
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const dotenv = require('dotenv')
const { GoogleGenAI } = require('@google/genai')

dotenv.config()

const app = express();
const PORT = 3000;

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

app.use(
    cors({
        //insert domain here
        origin: true,
    })
)

app.use(express.json())

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        return cb(null, "./public/images")
    },
    filename: function(req, file, cb){
        return cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({storage})

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

// GEMINI API ROUTE - Analyze Image
app.post("/api/analyze-image", upload.single('file'), async (req, res) => {
    console.log("Received POST request to /api/analyze-image");
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const imagePath = req.file.path;
        const prompt = req.body.prompt || 'Please extract and analyze all text from this image.';
        
        console.log("Analyzing image at:", imagePath);
        console.log("Prompt:", prompt);

        // Read the image file and convert to base64
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        const mimeType = 'image/png'; // Adjust based on actual file type if needed

        // Call Gemini API with image
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: [
                {
                    role: 'user',
                    parts: [
                        {
                            text: prompt
                        },
                        {
                            inlineData: {
                                mimeType: mimeType,
                                data: base64Image
                            }
                        }
                    ]
                }
            ]
        });

        console.log("Got response from Google GenAI");
        
        // Clean up the uploaded file
        fs.unlinkSync(imagePath);

        res.json({ 
            analysis: response.candidates[0].content.parts[0].text,
            status: 'success'
        });
    } catch (error) {
        console.error("Error analyzing image:", error);
        res.status(500).json({ error: "Failed to analyze image", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});