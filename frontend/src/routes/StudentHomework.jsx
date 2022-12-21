import { Stack } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";

const StudentHomework = () => {
  const [groupData, setGroupData] = useState([]);
  const [rows, setRows] = useState([]);
  const [homeworkData, setHomeworkData] = useState([]);

  const columns = [
    {
      field: "subject",
      headerName: "Dalykas",
      editable: false,
      width: 200,
      maxWidth: 200,
      sortable: true,
    },
    {
      field: "dateDue",
      headerName: "Atlikti iki",
      editable: false,
      width: 200,
      maxWidth: 200,
      sortable: true,
    },
    {
      field: "value",
      headerName: "Namų darbas",
      editable: false,
      width: 200,
      maxWidth: 200,
      sortable: true,
    },
  ];

  const fetchHomework = () => {
    axios
      .get(`http://localhost:5000/student/homeworks`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        setHomeworkData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/groups/user", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        setGroupData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (groupData && groupData.length > 0) {
      fetchHomework();
    }
  }, [groupData]);

  useEffect(() => {
    if (homeworkData && homeworkData.length > 0) {
      setRows(
        [...homeworkData].map((homework) => ({
          subject: groupData.find((group) => group._id.$oid == homework.group.$oid).subject,
          id: homework._id.$oid,
          dateDue: homework.date_due.$date.substring(0, 10),
          value: homework.value,
        }))
      );
    }
  }, [homeworkData]);

  return (
    <>
      <Stack spacing={4} style={{ width: "70%" }}>
        {/* <div style={{ display: "flex", gap: "40px" }}>
          <DatePicker
            views={["month"]}
            label="Mėnuo"
            openTo="month"
            value={selectedDate}
            onChange={(newValue) => {
              setSelectedDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} helperText={null} />}
          />
        </div> */}
        <div style={{ height: "500px", width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableColumnFilter
            disableColumnMenu
            autoHeight
          />
        </div>
      </Stack>
    </>
  );
};

export default StudentHomework;
