import { useState } from 'react'
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'
import { UploadCard } from './components/UploadCard'
import { ResultsDisplay } from './components/ResultsDisplay'
import axios from 'axios'
import './App.css'


function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)

  const handleAnalyze = async () => {
    if (!selectedFile) {
      console.error('No file selected for analysis');
      return;
    }

    try {
      setIsAnalyzing(true);
      console.log("Analyzing image...");
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('prompt', `
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
`);

      const response = await fetch('http://localhost:3000/api/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Image analysis result:", data);
      setResult(data);
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <Box minH="100vh" bg="#0a0a0a" color="white" display="flex" alignItems="center" justifyContent="center">
      <Container maxW="4xl" py={10}>
        <VStack gap={8} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Heading 
              size="4xl" 
              letterSpacing="tight" 
              fontWeight="bold"
              mb={2}
            >
              SCAM DETECTOR
            </Heading>
            <Text color="gray.400" fontSize="lg">
              Upload an image to analyze for potential scams
            </Text>
          </Box>

          {/* Upload Card */}
          <UploadCard
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            setResult={setResult}
          />

          {/* Results Display */}
          <ResultsDisplay result={result} />
        </VStack>
      </Container>
    </Box>
  )
}

export default App
