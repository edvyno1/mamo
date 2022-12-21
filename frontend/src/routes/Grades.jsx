import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Stack } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import moment from "moment";
import { useState } from "react";
import { useEffect } from "react";

const Grades = () => {
  const [groupData, setGroupData] = useState([]);
  const [formData, setFormData] = useState();
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedDate, setSelectedDate] = useState();

  const openForm = () => {
    setOpen(true);
  };
  const closeForm = () => {
    setOpen(false);
    setFormData({});
  };

  const handleOnCellClick = (params) => {
    openForm();
    setFormData({
      ...formData,
      student: params.id,
      date: `${selectedDate.toObject().years}-${++selectedDate.toObject().months}-${params.field}`,
      group: selectedGroup._id.$oid,
    });
  };

  const handleFormChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGradeCreate = () => {
    axios
      .post("http://localhost:5000/grades", formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      })
      .then(() => {
        fetchGrades(selectedDate.toObject().years, ++selectedDate.toObject().months);
      })
      .catch((error) => {
        console.log(error);
      });
    closeForm();
  };

  const fetchGrades = (year, month) => {
    if (typeof selectedGroup !== "string") {
      axios
        .get(`http://localhost:5000/teacher/grades/${selectedGroup._id.$oid}/${year}-${month}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        })
        .then((response) => {
          setGrades(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
    if (typeof selectedGroup !== "string") {
      setSelectedDate(moment());
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (selectedDate) {
      setRows(
        { ...selectedGroup }.students.map((student) => ({
          id: student._id.$oid,
          name: `${student.lastName} ${student.firstName}`,
        }))
      );
      fetchGrades(selectedDate.toObject().years, ++selectedDate.toObject().months);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (grades.length > 0) {
      const changedRows = structuredClone(rows);
      changedRows.forEach((row) => {
        [...grades]
          .filter((grade) => grade.student.$oid == row.id)
          .forEach((grade) => {
            row[new Date(grade.date.$date.toString()).getDate().toString()] = grade.value;
          });
      });

      setRows(changedRows);
    }
  }, [grades]);

  const columnNames = () => {
    const columns = [
      {
        field: "name",
        headerName: "Pavardė, Vardas",
        width: 200,
        maxWidth: 200,
        sortable: true,
      },
    ];
    return columns.concat(
      new Array(31).fill().map((e, i) => {
        return {
          field: (++i).toString(),
          headerName: i.toString(),
          minWidth: 36,
          width: 36,
          sortable: false,
        };
      })
    );
  };

  return (
    <>
      <Stack spacing={4} style={{ width: "70%" }}>
        <div style={{ display: "flex", gap: "40px" }}>
          <Select
            style={{ width: "259px" }}
            onChange={(event) => {
              setSelectedGroup(event.target.value);
            }}
            value={selectedGroup}>
            {groupData.map((group) => (
              <MenuItem key={group._id.$oid} value={group}>
                {group.subject}
              </MenuItem>
            ))}
          </Select>
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
        </div>
        <div style={{ height: "500px", width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columnNames()}
            disableColumnFilter
            disableColumnMenu
            autoHeight
            onCellClick={handleOnCellClick}
          />
        </div>
      </Stack>
      <Dialog open={open} onClose={closeForm}>
        <DialogTitle>Įrašyti pažymį</DialogTitle>
        <DialogContent>
          <Select
            labelId="grade-label"
            name="value"
            value={formData?.value | ""}
            label="Pažymys"
            fullWidth
            onChange={handleFormChange}>
            {[...Array(10)].map((_, i) => (
              <MenuItem key={i} value={(++i).toString()}>
                {i.toString()}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeForm}>Atšaukti</Button>
          <Button onClick={handleGradeCreate}>Sukurti</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Grades;
