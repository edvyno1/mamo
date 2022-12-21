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
            <Button href="/admin" color="inherit">
              Admin
            </Button>
          ) : null}
          {role == "teacher" ? (
            <>
              <Button href="/teacher/grades" color="inherit">
                Pažymiai
              </Button>
              <Button href="/teacher/homework" color="inherit">
                Namų Darbai
              </Button>
              <Button href="/teacher/notes" color="inherit">
                Pastabos
              </Button>
            </>
          ) : null}
          {role == "student" ? (
            <>
              <Button href="/student/grades" color="inherit">
                Pažymiai
              </Button>
              <Button href="/student/homework" color="inherit">
                Namų Darbai
              </Button>
              <Button href="/student/notes" color="inherit">
                Pastabos
              </Button>
            </>
          ) : null}

          <Button href="/" onClick={handleLogout} color="inherit">
            Atsijungti
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
