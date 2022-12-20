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
import { useState } from "react";
import { useEffect } from "react";

const Grades = () => {
  const [groupData, setGroupData] = useState([]);
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState([]);

  const openForm = () => {
    setOpen(true);
  };
  const closeForm = () => {
    setOpen(false);
  };

  const a = [
    {
      _id: {
        $oid: "6399edde4b42f0402ebad6f4",
      },
      group: {
        $oid: "638cbce55ffcf32319ad1f7f",
      },
      student: {
        $oid: "638cbc723cf51b3476fbaf3e",
      },
      value: 10,
      date: {
        $date: 1545177600000,
      },
    },
    {
      _id: {
        $oid: "6399edde4b42f0402ebad6f4",
      },
      group: {
        $oid: "638cbce55ffcf32319ad1f7f",
      },
      student: {
        $oid: "638cbc723cf51b3476fbaf3e",
      },
      value: 10,
      date: {
        $date: 1545177600000,
      },
    },
  ];

  const b = [
    {
      _id: {
        $oid: "638cbce55ffcf32319ad1f7f",
      },
      teacher: {
        $oid: "638cbc7e3cf51b3476fbaf3f",
      },
      students: [
        {
          $oid: "638cbc723cf51b3476fbaf3e",
        },
      ],
      subject: "omega maths",
    },
  ];

  // const getData = () => {
  //   b.map(())
  //   // a.map(({  }, index) => (
  //   // ));
  // };

  const handleOnCellClick = (params) => {
    openForm();
    console.log(params);
  };

  const handleCellChange = () => {};

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
          <Select style={{ width: "259px" }}>
            {groupData.map(({ subject }, index) => (
              <MenuItem key={index} value={subject}>
                {subject}
              </MenuItem>
            ))}
          </Select>
          <DatePicker
            views={["month"]}
            label="Mėnuo"
            // value={null}
            // onChange={(newValue) => {
            //   setValue(newValue);
            // }}
            renderInput={(params) => <TextField {...params} helperText={null} />}
          />
        </div>
        <div style={{ height: "500px", width: "100%" }}>
          <DataGrid
            rows={[
              { id: 1, name: "Pavardenis Vardenis" },
              { id: 2, name: "Pavardenis Vardenis" },
            ]}
            columns={columnNames()}
            disableColumnFilter
            disableColumnMenu
            autoHeight
            onCellClick={handleOnCellClick}
          />
        </div>
      </Stack>
      <Dialog open={open} onClose={closeForm}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <Select labelId="role-label" name="role" value={""} label="Rolė" fullWidth>
            <MenuItem value={"admin"}>Administratorius</MenuItem>
            <MenuItem value={"student"}>Mokinys</MenuItem>
            <MenuItem value={"teacher"}>Mokytojas</MenuItem>
            <MenuItem value={"parent"}>Mokinio tėvas</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeForm}>Atšaukti</Button>
          <Button onClick={handleCellChange}>Sukurti</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Grades;
