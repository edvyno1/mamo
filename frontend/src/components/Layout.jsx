import Navbar from "./Navbar";
import { Box } from "@mui/material";

export default function Layout(props) {
  return (
    <>
      <Navbar />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100%"
        paddingTop={"40px"}>
        {props.children}
      </Box>
    </>
  );
}
