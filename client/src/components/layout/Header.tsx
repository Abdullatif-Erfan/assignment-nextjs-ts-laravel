import { Flex, Text } from "@chakra-ui/react";
import { NextPage } from "next"
interface PropType { }
export const Header: NextPage<PropType> = () => {
    return (
        <>
            <Flex minH="50px" w="100%" justifyContent="center" alignItems="center" bgGradient="linear-gradient(293deg, #ed355b, #1f65db)">
                <Text as="h5" color="#fff" fontWeight="bold"
                    fontSize={["xs", "sm", "md", "lg"]} >Assignment</Text>
            </Flex>
        </>
    )
}