import {
    Box, Flex, SimpleGrid, Text, List, ListItem, ListIcon, Link

} from "@chakra-ui/react";
import { NextPage } from "next"
import NextLink from "next/link"
import { FaHome, FaUsers } from "react-icons/fa";
import style from "../../styles/dashboard.module.css"
interface PropType { }
export const Sidebar: NextPage<PropType> = () => {
    return (
        <>
            {/* --- Left Sidebar (xs=60px, sm=120px, md=200px) --- */}
            <Box w={["60px", "200px", "220px"]} minH="calc(100vh - 50px)" boxShadow="-2px 2px 8px 1px #00000070" p="10px">

                <List spacing={3} mt="20px">
                    {/* <ListItem className={style.listItem}>
                        <NextLink href="/">
                            <FaHome className={style.sidebarIcon} />
                            <span className={style.hiddenXs}>Dashboard</span>
                        </NextLink>
                    </ListItem> */}
                    <ListItem className={style.listItem}>
                        <NextLink href="/">
                            <FaUsers className={style.sidebarIcon} />
                            <span className={style.hiddenXs}>
                                Student List
                             </span>
                        </NextLink>
                    </ListItem>
                </List>
            </Box>
            {/* --- End of Left Sidebar --- */}
        </>
    )
}