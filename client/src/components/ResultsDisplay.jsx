import { useEffect, useRef } from 'react'
import { Box, Card, VStack, HStack, Heading, Text, Badge, Grid, Stat, StatGroup, For } from '@chakra-ui/react'
import { LuTrendingUp, LuTrendingDown } from 'react-icons/lu'

export function ResultsDisplay({ result }) {
  const dashboardRef = useRef(null)

  useEffect(() => {
    if (result && dashboardRef.current) {
      // Auto-scroll to dashboard with smooth behavior
      setTimeout(() => {
        dashboardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    }
  }, [result])

  if (!result) return null

  return (
    <Box w="100%">
      {/* Dashboard Section */}
      <Box ref={dashboardRef} minH="100vh" py={10} mt={20}>
        <VStack gap={8} align="stretch">
          {/* Dashboard Header */}
          <Box>
            <Heading 
              size="3xl" 
              letterSpacing="tight" 
              fontWeight="bold"
              mb={8}
            >
              DASHBOARD
            </Heading>
          </Box>

          {/* Stats Grid */}
          <Grid 
            templateColumns={{ base: '1fr', md: '1fr 2fr' }} 
            gap={6}
          >
            {/* Risk Card */}
            <Card.Root 
              bg={result.isScam ? "rgba(251, 146, 60, 0.15)" : "rgba(163, 230, 53, 0.15)"} 
              borderRadius="2xl" 
              p={{ base: 6, md: 8 }}
              border="2px solid"
              borderColor={result.isScam ? "#fb923c" : "#a3e635"}
              boxShadow={result.isScam ? "0 4px 20px rgba(251, 146, 60, 0.2)" : "0 4px 20px rgba(163, 230, 53, 0.2)"}
            >
              <Card.Header pb={{ base: 4, md: 6 }}>
                <Heading size="sm" fontWeight="bold" letterSpacing="wide">RISK</Heading>
              </Card.Header>
              <Card.Body>
                {/* Mobile/Tablet: Horizontal Layout */}
                <Box display={{ base: 'block', md: 'none' }}>
                  <HStack justify="space-between" align="center">
                    <VStack align="start" gap={1}>
                      <Text fontSize="xs" color="gray.400">Risk Index</Text>
                      <Text fontSize="2xl" fontWeight="bold" color={result.isScam ? "#fb923c" : "#a3e635"}>
                        {result.isScam ? '⚠️ High Risk' : '✓ Low Risk'}
                      </Text>
                    </VStack>
                    <VStack align="end" gap={1}>
                      <Text fontSize="xs" color="gray.400">Confidence</Text>
                      <Badge
                        colorScheme={result.isScam ? "orange" : "green"}
                        fontSize="xl"
                        px={4}
                        py={2}
                        borderRadius="md"
                        fontWeight="bold"
                      >
                        {result.confidence}%
                      </Badge>
                    </VStack>
                  </HStack>
                </Box>

                {/* Desktop: Vertical Centered Layout */}
                <Box display={{ base: 'none', md: 'block' }}>
                  <VStack align="stretch" gap={6}>
                    <VStack align="center" gap={2} py={4}>
                      <Text fontSize="5xl" fontWeight="bold" color={result.isScam ? "#fb923c" : "#a3e635"}>
                        {result.isScam ? '⚠️' : '✓'}
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color={result.isScam ? "#fb923c" : "#a3e635"}>
                        {result.isScam ? 'High Risk' : 'Low Risk'}
                      </Text>
                    </VStack>
                    
                    {/* Confidence Badge */}
                    <Box textAlign="center" py={3}>
                      <Text fontSize="xs" color="gray.400" mb={2} textTransform="uppercase" letterSpacing="wider">Confidence Level</Text>
                      <Badge
                        colorScheme={result.isScam ? "orange" : "green"}
                        fontSize="3xl"
                        px={6}
                        py={3}
                        borderRadius="lg"
                        fontWeight="bold"
                      >
                        {result.confidence}%
                      </Badge>
                    </Box>
                  </VStack>
                </Box>
              </Card.Body>
            </Card.Root>

            {/* Details Card */}
            <Card.Root bg="rgba(255,255,255,0.03)" borderRadius="xl" p={6}>
              <Card.Header pb={4}>
                <HStack justify="space-between">
                  <Heading size="sm" fontWeight="bold">DETAILS</Heading>
                  <Text color="gray.400" fontSize="xl">⋯</Text>
                </HStack>
              </Card.Header>
              <Card.Body>
                <Text color="gray.300" fontSize="sm" lineHeight="1.7">
                  {result.details}
                </Text>
              </Card.Body>
            </Card.Root>
          </Grid>
        </VStack>
      </Box>
    </Box>
  )
}
