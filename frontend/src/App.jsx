import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./routes/Login";
import Admin from "./routes/Admin";
import Grades from "./routes/Grades";
import StudentGrades from "./routes/StudentGrades";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Note from "./routes/Note";
import AuthGuard from "./routes/AuthGuard";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthGuard requireRole={"admin"}>
        <Admin />
      </AuthGuard>
    ),
  },
  {
    path: "/grades",
    element: <Grades />,
  },
  {
    path: "/sg",
    element: <StudentGrades />,
  },
  {
    path: "/note",
    element: <Note />,
  },
  {
    path: "*",
    element: <p>Theres nothing here: 404!</p>,
  },
]);

const App = () => {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Login />;
  }

  return <RouterProvider router={router} />;
};

export default App;
