import './App.css';
import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './routes/Login';
import Admin from './routes/Admin';


const router = createBrowserRouter([ 
  {
    path: "/",
    element: <Admin />,
  },
]);

function App() {
  const [token, setToken] = useState();

  const addToken = (access_token) => {
    console.log(access_token);
    sessionStorage.setItem("access_token", access_token);
    setToken(access_token);
  }

  if(!token) {
    return <Login addToken={addToken}/>
  }

  return (
    <RouterProvider router={router} />
  );
}

export default App;
