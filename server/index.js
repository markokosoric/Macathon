const express = require("express");
const cors = require("cors")
const multer = require('multer')

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
        return cb(null, "./public/Images")
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

// GEMINI API ROUTE
app.post("/api/generate-content", async (req, res) => {
    console.log("Received POST request to /api/generate-content");
    console.log("Request body:", req.body);
    try {
        const { model, contents } = req.body;
        console.log("Calling Google GenAI with model:", model);
        const response = await ai.models.generateContent({ model, contents });
        console.log("Got response from Google GenAI");
        res.json({ text: response.text() });
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ error: "Failed to generate content" });
    }
});

// IMAGE ANALYSIS ROUTE
app.post("/api/analyze-image", async (req, res) => {
    console.log("Received POST request to /api/analyze-image");
    try {
        const { imagePath, prompt } = req.body;
        
        if (!imagePath) {
            return res.status(400).json({ error: "imagePath is required" });
        }

        // Read image file and convert to base64
        const fullPath = path.join(__dirname, "public", imagePath);
        console.log("Reading image from:", fullPath);
        
        const imageBuffer = fs.readFileSync(fullPath);
        const base64Image = imageBuffer.toString("base64");
        
        // Determine image media type
        const extension = path.extname(imagePath).toLowerCase();
        let mediaType = "image/jpeg";
        if (extension === ".png") mediaType = "image/png";
        else if (extension === ".gif") mediaType = "image/gif";
        else if (extension === ".webp") mediaType = "image/webp";
        
        console.log("Image media type:", mediaType);
        
        // Call Gemini API with image
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            inlineData: {
                                mimeType: mediaType,
                                data: base64Image,
                            },
                        },
                        {
                            text: prompt || "Please extract and analyze all text from this image.",
                        },
                    ],
                },
            ],
        });

        console.log("Got response from Google GenAI for image analysis");
        res.json({ text: response.text() });
    } catch (error) {
        console.error("Error analyzing image:", error);
        res.status(500).json({ error: "Failed to analyze image" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});