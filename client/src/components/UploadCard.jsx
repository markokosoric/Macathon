import { useRef } from 'react'
import { Box, Card, VStack, HStack, Text } from '@chakra-ui/react'
import { FiUpload, FiFile, FiX } from 'react-icons/fi'

export function UploadCard({ 
  selectedFile, 
  setSelectedFile, 
  isDragging, 
  setIsDragging,
  onAnalyze,
  isAnalyzing,
  setResult 
}) {
  const fileInputRef = useRef(null)

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    // Get the dropped files from the drag event
    const files = e.dataTransfer.files
    // If a file was dropped, pass it to handleFile for processing
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e) => {
    // Get files selected through the file input dialog
    const files = e.target.files
    // If a file was selected, pass it to handleFile for processing
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFile = (file) => {
    // Verify the file is an image type (image/png, image/jpeg, etc.)
    if (file && file.type.startsWith('image/')) {
      // Store the file in state - this makes it available to the parent App component
      setSelectedFile(file)
      // Clear any previous results when a new file is selected
      setResult(null)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card.Root
      bg="#1a1a1a"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.800"
      p={8}
    >
      <Card.Body>
        <VStack gap={6}>
          {/* Drag and Drop Area */}
          <Box
            w="100%"
            p={12}
            borderRadius="lg"
            border="2px dashed"
            borderColor={isDragging ? "#a3e635" : "gray.700"}
            bg={isDragging ? "rgba(163, 230, 53, 0.1)" : "transparent"}
            textAlign="center"
            cursor="pointer"
            transition="all 0.3s"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            _hover={{
              borderColor: "#a3e635",
              bg: "rgba(163, 230, 53, 0.05)"
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileInput(e)}
              style={{ display: 'none' }}
            />
            
            <VStack gap={4}>
              <Box 
                fontSize="4xl" 
                color={isDragging ? "#a3e635" : "gray.500"}
              >
                <FiUpload />
              </Box>
              <VStack gap={2}>
                <Text fontSize="lg" fontWeight="medium">
                  {isDragging ? 'Drop your image here' : 'Drag & drop an image here'}
                </Text>
                <Text color="gray.500" fontSize="sm">
                  or click to browse
                </Text>
              </VStack>
            </VStack>
          </Box>

          {/* Selected File Display */}
          {selectedFile && (
            <Box w="100%">
              <Card.Root
                bg="#0f0f0f"
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.800"
              >
                <Card.Body p={4}>
                  <HStack justify="space-between">
                    <HStack gap={3}>
                      <Box color="#a3e635" fontSize="xl">
                        <FiFile />
                      </Box>
                      <VStack align="start" gap={0}>
                        <Text fontWeight="medium">{selectedFile.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </Text>
                      </VStack>
                    </HStack>
                    <Box
                      as="button"
                      onClick={handleRemoveFile}
                      color="gray.500"
                      _hover={{ color: "#fb923c" }}
                      fontSize="xl"
                      cursor="pointer"
                    >
                      <FiX />
                    </Box>
                  </HStack>
                </Card.Body>
              </Card.Root>

              {/* Analyze Button */}
              <Box mt={4}>
                <Box
                  as="button"
                  w="100%"
                  py={3}
                  px={6}
                  bg="#a3e635"
                  color="#0a0a0a"
                  borderRadius="lg"
                  fontWeight="bold"
                  fontSize="lg"
                  onClick={onAnalyze}
                  disabled={isAnalyzing}
                  cursor={isAnalyzing ? "not-allowed" : "pointer"}
                  opacity={isAnalyzing ? 0.7 : 1}
                  transition="all 0.3s"
                  _hover={{
                    bg: "#8bc920",
                    transform: "translateY(-2px)"
                  }}
                  _active={{
                    transform: "translateY(0)"
                  }}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
                </Box>
              </Box>
            </Box>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  )
}
