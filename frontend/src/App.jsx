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
import Homework from "./routes/Homework";
import StudentNote from "./routes/StudentNote";
import StudentHomework from "./routes/StudentHomework";

const router = createBrowserRouter([
  {
    path: "/",
    element: <p>Sveiki prisijungę</p>,
  },

  {
    path: "/admin",
    element: (
      <AuthGuard requireRole={"admin"}>
        <Admin />
      </AuthGuard>
    ),
  },

  {
    path: "/student/",
    children: [
      {
        path: "grades",
        element: (
          <AuthGuard requireRole={"student"}>
            <StudentGrades />
          </AuthGuard>
        ),
      },
      {
        path: "homework",
        element: (
          <AuthGuard requireRole={"student"}>
            <StudentHomework />
          </AuthGuard>
        ),
      },
      {
        path: "notes",
        element: (
          <AuthGuard requireRole={"student"}>
            <StudentNote />
          </AuthGuard>
        ),
      },
    ],
  },

  {
    path: "/teacher/",
    children: [
      {
        path: "grades",
        element: (
          <AuthGuard requireRole={"teacher"}>
            <Grades />
          </AuthGuard>
        ),
      },
      {
        path: "notes",
        element: (
          <AuthGuard requireRole={"teacher"}>
            <Note />
          </AuthGuard>
        ),
      },
      {
        path: "homework",
        element: (
          <AuthGuard requireRole={"teacher"}>
            <Homework />
          </AuthGuard>
        ),
      },
    ],
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
