import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import { Stack } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import { useEffect, useState } from "react";

const Homework = () => {
  const [groupData, setGroupData] = useState([]);
  const [rows, setRows] = useState([]);
  const [notesData, setNotesData] = useState([]);
  const [formData, setFormData] = useState();
  const [open, setOpen] = useState(false);

  const openForm = () => {
    setOpen(true);
  };
  const closeForm = () => {
    setOpen(false);
    setFormData({});
  };

  const handleNoteCreate = () => {
    console.log(formData);
    axios
      .post(
        "http://localhost:5000/notes",
        {
          group: formData.group,
          student: formData.student,
          value: formData.value,
          type: formData.type,
          date: `${formData.date.toObject().years}-${++formData.date.toObject().months}-${
            formData.date.toObject().date
          }`,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        }
      )
      .then(() => {
        fetchNotes();
      })
      .catch((error) => {
        console.log(error);
      });
    closeForm();
  };

  const handleFormChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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
      field: "student",
      headerName: "Mokinys",
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
      .get(`http://localhost:5000/teacher/notes`, {
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
          student: [
            groupData
              .find((group) => group._id.$oid == note.group.$oid)
              .students.find((student) => student._id.$oid == note.student.$oid),
          ].map(({ firstName, lastName }) => firstName + " " + lastName),
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
        <Button onClick={openForm}>Nauja Pastaba</Button>
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
      <Dialog open={open} onClose={closeForm}>
        <DialogTitle>Įrašyti pažymį</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Select
              labelId="type-label"
              name="type"
              value={formData?.type || ""}
              label="Tipas"
              fullWidth
              onChange={handleFormChange}>
              <MenuItem value={"reprimand"}>Pastaba</MenuItem>
              <MenuItem value={"commendation"}>Pagyrimas</MenuItem>
            </Select>
            <Select
              style={{ width: "259px" }}
              onChange={handleFormChange}
              name="group"
              value={formData?.group || ""}>
              {groupData.map((group) => (
                <MenuItem key={group._id.$oid} value={group._id.$oid}>
                  {group.subject}
                </MenuItem>
              ))}
            </Select>
            <Select
              style={{ width: "259px" }}
              onChange={handleFormChange}
              name="student"
              value={formData?.student || ""}>
              {groupData.map((group) =>
                group.students.map((student) => (
                  <MenuItem key={student._id.$oid} value={student._id.$oid}>
                    {student.firstName + " " + student.lastName}
                  </MenuItem>
                ))
              )}
            </Select>
            <TextareaAutosize
              style={{ height: "120px" }}
              autoFocus
              margin="normal"
              name="value"
              label="Tekstas"
              type="text"
              fullWidth
              variant="standard"
              value={formData?.value || ""}
              onChange={handleFormChange}
            />
            <DatePicker
              views={["day"]}
              label="Diena"
              openTo="day"
              value={formData?.date || null}
              onChange={(newValue) => {
                setFormData({
                  ...formData,
                  date: newValue,
                });
              }}
              renderInput={(params) => <TextField {...params} helperText={null} />}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeForm}>Atšaukti</Button>
          <Button onClick={handleNoteCreate}>Sukurti</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Homework;
