import { useEffect, useState } from "react";
import axios from "axios";
import GroupTable from "../components/GroupTable";
import UserTable from "../components/UserTable";

export default function Admin() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/users", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div style={{ display: "flex", gap: "40px" }}>
      <UserTable data={userData} setData={setUserData} />
      <GroupTable data={userData} />
    </div>
  );
}
