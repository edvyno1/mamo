import "./App.css";
import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./routes/Login";
import Admin from "./routes/Admin";
import Grades from "./routes/Grades";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import StudentGrades from "./routes/StudentGrades";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Admin />,
  },
  {
    path: "/grades",
    element: <Grades />,
  },
  {
    path: "/sg",
    element: <StudentGrades />,
  },
]);

function App() {
  const [token, setToken] = useState();
  useEffect(() => {
    setToken(sessionStorage.getItem("access_token"));
  }, []);

  const addToken = (access_token) => {
    sessionStorage.setItem("access_token", access_token);
    setToken(access_token);
  };

  if (!token) {
    return <Login addToken={addToken} />;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <RouterProvider router={router} />
    </LocalizationProvider>
  );
}

export default App;
