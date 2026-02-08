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
      formData.append('prompt', 'Please extract and analyze all text from this image.');

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
