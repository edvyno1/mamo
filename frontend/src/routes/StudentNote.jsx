import { Button } from "@mui/material";
import { Stack } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";

const StudentNote = () => {
  const [groupData, setGroupData] = useState([]);
  const [rows, setRows] = useState([]);
  const [notesData, setNotesData] = useState([]);

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
      field: "date",
      headerName: "Data",
      editable: false,
      width: 200,
      maxWidth: 200,
      sortable: true,
    },
    {
      field: "note",
      headerName: "Tekstas",
      editable: false,
      width: 200,
      maxWidth: 200,
      sortable: true,
    },
    {
      field: "type",
      headerName: "Pastaba/Pagyrimas",
      editable: false,
      width: 200,
      maxWidth: 200,
      sortable: true,
    },
  ];

  const fetchNotes = () => {
    axios
      .get(`http://localhost:5000/student/notes`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        setNotesData(response.data);
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
      fetchNotes();
    }
  }, [groupData]);

  useEffect(() => {
    if (notesData && notesData.length > 0) {
      setRows(
        [...notesData].map((note) => ({
          subject: groupData.find((group) => group._id.$oid == note.group.$oid).subject,
          id: note._id.$oid,
          date: note.date.$date,
          note: note.value,
          type: note.type,
        }))
      );
    }
  }, [notesData]);

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

export default StudentNote;
