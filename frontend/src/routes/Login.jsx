import { Button, TextField } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { Stack } from "@mui/system";

const Login = ({ addToken }) => {
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  const handleClick = async () => {
    axios
      .post("http://localhost:5000/login", loginData)
      .then((response) => {
        addToken(response.data.token);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;

    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  return (
    <form>
      <Stack spacing={3}>
        <TextField
          name="username"
          margin="dense"
          type="text"
          label="Vardas"
          variant="outlined"
          value={loginData.username || ""}
          onChange={handleChange}
        />
        <TextField
          name="password"
          margin="dense"
          type="password"
          label="Slaptažodis"
          variant="outlined"
          value={loginData.password || ""}
          onChange={handleChange}
        />
        <Button onClick={handleClick} variant="contained">
          Prisijungti
        </Button>
      </Stack>
    </form>
  );
};

export default Login;
