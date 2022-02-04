import { Flex, Text } from "@chakra-ui/react"

export const ProjectShowcase = (): JSX.Element => {
  return (
    <Flex flexDir="column" backgroundColor="lightgrey" padding="10px" borderRadius="0.5em">
      <Text fontWeight="extrabold" fontSize="xl">Project Name</Text>
      <Text>Hi</Text>
    </Flex>
  )
}
