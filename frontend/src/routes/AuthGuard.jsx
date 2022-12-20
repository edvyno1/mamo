import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Unauthorized from "./Unauthorized";

const AuthGuard = ({ requireRole, children }) => {
  const { role } = useContext(AuthContext);

  return requireRole == role ? children : <Unauthorized />;
};

export default AuthGuard;
