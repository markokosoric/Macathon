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
