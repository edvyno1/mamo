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
  const [homeworkData, setHomeworkData] = useState([]);
  const [formData, setFormData] = useState();
  const [open, setOpen] = useState(false);

  const openForm = () => {
    setOpen(true);
  };
  const closeForm = () => {
    setOpen(false);
    setFormData({});
  };

  const handleHomeworkCreate = () => {
    axios
      .post(
        "http://localhost:5000/homeworks",
        {
          group: formData.group,
          value: formData.value,
          date_due: `${formData.date.toObject().years}-${++formData.date.toObject().months}-${
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
        fetchHomework();
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
      flex: 1,
      editable: false,
      sortable: true,
    },
  ];

  const fetchHomework = () => {
    axios
      .get(`http://localhost:5000/teacher/homeworks`, {
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
        <Button onClick={openForm}>Naujas namų darbas</Button>
        <div style={{ height: "500px", width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableColumnFilter
            disableColumnMenu
            autoHeight
            getRowHeight={() => "auto"}
          />
        </div>
      </Stack>
      <Dialog open={open} onClose={closeForm}>
        <DialogTitle>Įrašyti namų darbą</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
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
            <TextareaAutosize
              style={{ height: "120px" }}
              autoFocus
              margin="normal"
              name="value"
              label="Tekstas"
              type="text"
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
          <Button onClick={handleHomeworkCreate}>Sukurti</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Homework;
