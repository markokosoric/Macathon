import { useState, useRef, useEffect } from 'react'
import { Box, Button, Flex, HStack, Input, Spinner, Text, VStack } from '@chakra-ui/react'
import axios from 'axios'

// Generate a unique user ID
const generateUserId = () => {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export function ChatBox({ result }) {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userId] = useState(() => {
    // Check if userId exists in sessionStorage
    let storedUserId = sessionStorage.getItem('chatUserId');
    if (!storedUserId) {
      // Generate new userId if not found
      storedUserId = generateUserId();
      sessionStorage.setItem('chatUserId', storedUserId);
    }
    return storedUserId;
  });
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Clear chat history when component mounts (page refresh) or when result changes (new submission)
  useEffect(() => {
    const clearChatHistory = async () => {
      try {
        console.log('🧹 Clearing chat history for userId:', userId);
        await axios.post('http://localhost:3000/clear', { userId });
        setMessages([]);
        console.log('Chat history cleared successfully');
      } catch (err) {
        console.error('Error clearing chat history:', err);
      }
    };
    
    clearChatHistory();
  }, [userId, result]); // Runs on mount and when result changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) return;
    
    // Add user message
    const userMessage = { type: 'user', content: question }
    setMessages(prev => [...prev, userMessage])
    setQuestion('')
    setIsSubmitting(true);
    
    try {
      console.log('Sending message with userId:', userId);
      const res = await axios.post(`http://localhost:3000/ask`, { question, userId });
      const finalRes = res.data;
      console.log(finalRes);
      
      if (finalRes._status) {
        // Add AI response
        const aiMessage = { type: 'ai', content: finalRes.finalData }
        setMessages(prev => [...prev, aiMessage])
      }
    } catch (err) {
      console.error('Error:', err);
      const errorMessage = { type: 'ai', content: 'Sorry, I encountered an error. Please try again.' }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box
      bg="rgba(255, 255, 255, 0.05)"
      borderRadius="xl"
      borderWidth="1px"
      borderColor="rgba(255, 255, 255, 0.1)"
      overflow="hidden"
    >
      {/* Header */}
      <Box
        bg="rgba(255, 255, 255, 0.03)"
        borderBottomWidth="1px"
        borderColor="rgba(255, 255, 255, 0.1)"
        px={6}
        py={4}
      >
        <Text fontSize="lg" fontWeight="semibold" color="white">
          Ask AI Assistant
        </Text>
        <Text fontSize="sm" color="gray.400">
          Ask questions about the scam analysis
        </Text>
      </Box>

      {/* Messages Container */}
      <Box
        h="400px"
        overflowY="auto"
        px={6}
        py={4}
        css={{
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        <VStack gap={3} align="stretch">
          {messages.length === 0 && (
            <Flex justify="center" align="center" h="full" py={20}>
              <Text color="gray.500" fontSize="sm">
                Start a conversation by asking a question
              </Text>
            </Flex>
          )}
          
          {messages.map((message, index) => (
            <Flex
              key={index}
              justify={message.type === 'user' ? 'flex-end' : 'flex-start'}
            >
              <Box
                maxW="80%"
                bg={message.type === 'user' ? '#a3e635' : '#4b5563'}
                color="white"
                px={4}
                py={3}
                borderRadius="2xl"
                wordBreak="break-word"
                whiteSpace="pre-wrap"
                css={message.type === 'user' ? {
                  borderBottomRightRadius: '4px',
                } : {
                  borderBottomLeftRadius: '4px',
                }}
              >
                <Text fontSize="sm">{message.content}</Text>
              </Box>
            </Flex>
          ))}
          
          {isSubmitting && (
            <Flex justify="flex-start">
              <Box
                bg="#4b5563"
                px={4}
                py={3}
                borderRadius="2xl"
                borderBottomLeftRadius="4px"
              >
                <HStack gap={2}>
                  <Spinner size="sm" color="gray.400" />
                  <Text fontSize="sm" color="gray.400">Thinking...</Text>
                </HStack>
              </Box>
            </Flex>
          )}
          
          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      {/* Input Area */}
      <Box
        bg="rgba(255, 255, 255, 0.03)"
        borderTopWidth="1px"
        borderColor="rgba(255, 255, 255, 0.1)"
        p={4}
      >
        <form onSubmit={handleSubmit}>
          <HStack gap={2}>
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your message..."
              disabled={isSubmitting}
              bg="rgba(255, 255, 255, 0.05)"
              borderColor="rgba(255, 255, 255, 0.1)"
              color="white"
              _placeholder={{ color: 'gray.500' }}
              _hover={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
              _focus={{ borderColor: '#a3e635', boxShadow: '0 0 0 1px #a3e635' }}
              size="lg"
            />
            <Button
              type="submit"
              disabled={isSubmitting || !question.trim()}
              bg="#a3e635"
              color="black"
              _hover={{ bg: '#84cc16' }}
              _active={{ bg: '#65a30d' }}
              _disabled={{ bg: 'gray.600', cursor: 'not-allowed', opacity: 0.5 }}
              size="lg"
              px={8}
            >
              Send
            </Button>
          </HStack>
        </form>
      </Box>
    </Box>
  )
}
