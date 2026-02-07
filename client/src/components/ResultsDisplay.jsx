import { Box, Card, VStack, HStack, Heading, Text, Badge } from '@chakra-ui/react'

export function ResultsDisplay({ result }) {
  if (!result) return null

  return (
    <Box w="100%">
      <Card.Root
        bg={result.isScam ? "rgba(251, 146, 60, 0.1)" : "rgba(163, 230, 53, 0.1)"}
        borderRadius="lg"
        border="1px solid"
        borderColor={result.isScam ? "#fb923c" : "#a3e635"}
      >
        <Card.Body p={6}>
          <VStack gap={4} align="start">
            <HStack justify="space-between" w="100%">
              <Heading size="lg">
                {result.isScam ? '⚠️ Potential Scam' : '✓ Looks Safe'}
              </Heading>
              <Badge
                colorScheme={result.isScam ? "orange" : "green"}
                fontSize="md"
                px={3}
                py={1}
                borderRadius="full"
              >
                {result.confidence}% Confidence
              </Badge>
            </HStack>
            <Text color="gray.400">
              {result.details}
            </Text>
          </VStack>
        </Card.Body>
      </Card.Root>
    </Box>
  )
}
