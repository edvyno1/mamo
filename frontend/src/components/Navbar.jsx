import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { addToken, role, setRole } = useContext(AuthContext);

  const handleLogout = () => {
    sessionStorage.clear();
    addToken(undefined);
    setRole(undefined);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {role == "admin" ? (
            <Button href="/" color="inherit">
              Admin
            </Button>
          ) : null}
          {role == "teacher" ? (
            <Button href="/grades" color="inherit">
              Pažymiai
            </Button>
          ) : (
            <Button href="/sg" color="inherit">
              Pažymiai
            </Button>
          )}
          <Button color="inherit">Pastabos</Button>
          <Button color="inherit">Namų darbai</Button>
          <Button onClick={handleLogout} color="inherit">
            Atsijungti
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
