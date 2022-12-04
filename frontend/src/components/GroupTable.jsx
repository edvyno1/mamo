/* eslint-disable no-unused-vars */
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";
import CustomToolbar from "./CustomToolbar";
import CustomToolbarSelect from "./CustomToolbarSelect";

const GroupTable = ({ data }) => {
  const [formData, setFormData] = useState({
    subject: "",
    teacher: "",
    students: [],
  });

  const [open, setOpen] = useState(false);
  const [groupData, setGroupData] = useState();

  useEffect(() => {
    axios
      .get("http://localhost:5000/groups", {
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
    closeForm();
  }, []);

  const openForm = () => {
    setOpen(true);
  };
  const closeForm = () => {
    setOpen(false);
  };
  const parseFormData = () => {
    const data = { ...formData };
    data.students = data.students.map((s) => s._id.$oid);
    data.teacher = data.teacher._id.$oid;
    return data;
  };

  const handleCreate = () => {
    axios
      .post("http://localhost:5000/groups", parseFormData(), {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        setGroupData([...groupData, response.data]);
      })
      .catch((error) => {
        console.log(error);
      });
    closeForm();
  };
  const handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const columns = [
    {
      name: "subject",
      label: "Dalykas",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "teacher",
      label: "Mokytojas",
      options: {
        filter: false,
        sort: true,
      },
    },
  ];

  const options = {
    download: false,
    print: false,
    customToolbarSelect: (selectedRows) => <CustomToolbarSelect selectedRows={selectedRows} />,
    customToolbar: () => {
      return <CustomToolbar handleClick={openForm} />;
    },
    //   textLabels: {
    //     pagination: {
    //       next: "Next Page",
    //       previous: "Previous Page",
    //       rowsPerPage: "Rows per page:",
    //       displayRows: "of" // 1-10 of 30
    //     },
    //     toolbar: {
    //       search: "Search",
    //       downloadCsv: "Download CSV",
    //       print: "Print",
    //       viewColumns: "View Columns",
    //       filterTable: "Filter Table"
    //     },
    //     filter: {
    //       title: "FILTERS",
    //       reset: "reset",
    //     },
    //     viewColumns: {
    //       title: "Show Columns"
    //     },
    //     selectedRows: {
    //       text: "rows(s) deleted",
    //       delete: "Delete"
    //     }
    // }
  };

  return (
    <>
      <MUIDataTable title={"Grupės"} data={[]} columns={columns} options={options} />
      <Dialog open={open} onClose={closeForm}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="normal"
            name="subject"
            label="Dalykas"
            type="text"
            fullWidth
            variant="standard"
            value={formData.subject || ""}
            onChange={handleChange}
          />
          <Autocomplete
            value={formData.teacher || null}
            options={data.filter((user) => {
              return user.role == "teacher";
            })}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
            renderInput={(params) => (
              <TextField {...params} label="filterSelectedOptions" placeholder="Mokiniai" />
            )}
            onChange={(e, newValue) => {
              setFormData({
                ...formData,
                ["teacher"]: newValue,
              });
            }}
          />
          <Autocomplete
            value={formData.students || null}
            name="students"
            multiple
            options={data}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField {...params} label="filterSelectedOptions" placeholder="Mokiniai" />
            )}
            onChange={(e, newValue) => {
              setFormData({
                ...formData,
                ["students"]: newValue.map((option) => option),
              });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeForm}>Atšaukti</Button>
          <Button onClick={handleCreate}>Sukurti</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GroupTable;
