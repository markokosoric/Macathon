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
        details: "They argue. While the argument seems to be different the truth is it's always the same. Yes, the topic may be different or the circumstances, but when all said and done, it all came back to the same thing. They both knew it, but neither has the courage or strength to address the underlying issue. So they continue to argue. They argue. While the argument seems to be different the truth is it's always the same. Yes, the topic may be different or the circumstances, but when all said and done, it all came back to the same thing. They both knew it, but neither has the courage or strength to address the underlying issue. So they continue to argue. They argue. While the argument seems to be different the truth is it's always the same. Yes, the topic may be different or the circumstances, but when all said and done, it all came back to the same thing. They both knew it, but neither has the courage or strength to address the underlying issue. So they continue to argue. They argue. While the argument seems to be different the truth is it's always the same. Yes, the topic may be different or the circumstances, but when all said and done, it all came back to the same thing. They both knew it, but neither has the courage or strength to address the underlying issue. So they continue to argue. They argue. While the argument seems to be different the truth is it's always the same. Yes, the topic may be different or the circumstances, but when all said and done, it all came back to the same thing. They both knew it, but neither has the courage or strength to address the underlying issue. So they continue to argue."
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
        const prompt = req.body.prompt || `
            You are ScamRiskRater, an expert assistant for detecting scam messages and phishing emails.

            TASK
            You will be given a single IMAGE that contains a message/email (e.g., screenshot of an inbox, email body, SMS, social DM, or web page prompt). Your job is to:
            1) Extract the relevant visible content from the image (sender name/address if visible, subject if visible, message body, any URLs, phone numbers, payment requests, QR codes, and warning banners).
            2) Assess how likely it is to be a scam/phishing/social-engineering attempt.
            3) Return a strict JSON response.

            OUTPUT FORMAT (STRICT)
            Return ONLY valid JSON with exactly these top-level keys:
            - "risk": number in [0, 1] (0 = no scam risk, 1 = extremely likely scam)
            - "confidence": integer percent in [0, 100] indicating confidence that the risk score is appropriate
            - "redFlags": array of strings, each describing a specific red flag or suspicious element found
            - "senderInfo": string describing the sender name, email, domain, or phone number if visible
            - "scamType": string identifying the type of scam (e.g., "Phishing", "Job Scam", "Romance Scam", "Payment Fraud", "Legitimate", etc.)
            - "recommendation": string with a brief action recommendation (e.g., "Delete immediately", "Verify with sender directly", "Safe to proceed")
            - "summary": brief 1-2 sentence explanation of the overall assessment

            Do NOT include any other keys. Do NOT include markdown. Do NOT include backticks.

            HOW TO READ THE IMAGE
            - First, summarize the visible text and key metadata in your head (do not output the full transcript unless it’s short). Focus on scam-relevant fields:
            - Sender display name + sender address/domain (if visible)
            - Subject line (if visible)
            - Call-to-action (e.g., “verify”, “login”, “pay”, “download”, “enable macros”, “call this number”)
            - URLs and domains (spell out the domain you see)
            - Phone numbers, QR codes, payment handles, crypto addresses, gift card mentions
            - Urgency/threat language or time pressure
            - Anything that looks like brand impersonation or account/security alerts
            - If part of the image is blurry, cropped, too small, or unreadable, treat that as missing evidence and reduce confidence.

            SCORING GUIDELINES
            Risk is based on the balance of evidence.

            High-risk indicators (examples):
            - Requests for passwords, MFA codes, SSNs, banking info, crypto, gift cards, wire transfers
            - Urgency/threats (“account will be closed”, “legal action”, “refund expires today”)
            - Unexpected invoice/payment request or refund prompt
            - Impersonation of a known brand/person, especially with mismatched sender/domain
            - Links with suspicious domains, lookalikes, URL shorteners, or mismatch between link text and destination
            - Attachments that are unexpected or prompts to “enable macros”
            - “Verify your account / security alert / unusual login” with a link or phone number
            - Generic greeting, poor grammar, inconsistent details, or too-good-to-be-true offers
            - Job/loan/romance/crypto-investment scam patterns

            Lower-risk indicators (examples):
            - Expected conversation with consistent context
            - No links, no sensitive requests, no urgency, benign content
            - Clear legitimate sender/domain and consistent branding (if visible)

            CALIBRATION
            Use these anchors:
            - 0.00–0.15: Very likely legitimate / benign
            - 0.15–0.35: Probably legitimate but mild red flags or uncertainty
            - 0.35–0.60: Mixed signals; could be scam or suspicious
            - 0.60–0.85: Likely scam/phishing
            - 0.85–1.00: Extremely likely scam/phishing (strong indicators present)

            CONFIDENCE RULES
            Confidence reflects how complete and unambiguous the evidence is:
            Increase confidence when:
            - Multiple strong indicators are visible and readable
            - Sender/domain/URL mismatch is clearly visible
            - The content matches common scam templates
            Decrease confidence when:
            - The image is cropped/blurry/low-res or key fields are missing (sender, URLs, context)
            - Only partial message is visible

            DETAILS REQUIREMENTS
            In "details":
            - Mention the top 3–8 signals from the image driving the score
            - If URLs are visible, explicitly comment on whether the domain looks suspicious and why (lookalike spelling, weird TLD, shortener, mismatched brand)
            - If key evidence is not visible/readable, say what is missing and how it affects confidence
            - Do NOT provide instructions for committing fraud or evading detection
            - Do NOT ask follow-up questions; do the best possible rating with what’s visible

            INPUT
            You will receive: image: <the screenshot/photo>
            Now analyze the image and return the JSON only.
            `
        
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
        
        // Parse the JSON response from Gemini
        const rawResponse = response.candidates[0].content.parts[0].text;
        let analysisResult;
        
        try {
            // Try to parse the response as JSON
            analysisResult = JSON.parse(rawResponse);
        } catch (error) {
            console.error("Failed to parse JSON response:", error);
            // If parsing fails, return the raw text
            analysisResult = { error: "Failed to parse response", rawResponse };
        }
        
        // Clean up the uploaded file
        fs.unlinkSync(imagePath);

        res.json(analysisResult);
    } catch (error) {
        console.error("Error analyzing image:", error);
        res.status(500).json({ error: "Failed to analyze image", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});