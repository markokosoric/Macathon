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
    if (!selectedFile) return

    setIsAnalyzing(true)
    
    // Send image to server
    const formData = new FormData()
    formData.append('file', selectedFile)
    
    axios.post('http://localhost:3000/upload', formData)
      .then(res => {
        console.log(res.data)
        // Receive response from server and set it as result
        setResult(res.data)
      })
      .catch(err => {
        console.log("Post error: ", err)
      })
      .finally(() => {
        setIsAnalyzing(false)
      })
  }

  async function submitMessage() {
    try {
      console.log("Submitting message...");
      const response = await fetch('http://localhost:3000/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-2.0-flash',
          contents: 'What is the capital of France?',
        }),
      });
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Data received:", data);
    } catch (error) {
      console.error('Error calling backend:', error);
    }
  }

  async function analyzeImage() {
    try {
      console.log("Analyzing image...");
      const response = await fetch('http://localhost:3000/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imagePath: 'images/Scam-Text-Messages.png',
          prompt: 'Please extract and analyze all text from this image.',
        }),
      });
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Image analysis result:", data);
      setMessage(data);
    } catch (error) {
      console.error('Error analyzing image:', error);
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
