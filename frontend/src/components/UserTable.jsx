import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import MUIDataTable from "mui-datatables";
import { useEffect, useState } from 'react';
import CustomToolbar from '../components/CustomToolbar';
import CustomToolbarSelect from '../components/CustomToolbarSelect';

export default function UserTable() {
    const [formData, setFormData] = useState({firstName:'', lastName:'', role: 'student', username: '', password: ''})
    const [open, setOpen] = useState(false);
    const [userData, setUserData] = useState();

    useEffect(() => {
      axios.get('http://localhost:5000/users',  
      {headers: {
        'Authorization': `Bearer ${sessionStorage.getItem("access_token")}` 
      }})
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
        closeForm();
    }, []);

    const openForm = () => {
        setOpen(true);
        console.log("open")
    };
    const closeForm = () => {
        setOpen(false);
        console.log("close")
    };

    const handleCreate = () => {
        axios.post('http://localhost:5000/users',  
        formData,
        {headers: {
          'Authorization': `Bearer ${sessionStorage.getItem("access_token")}` 
        }})
        .then((response) => {
          setUserData([...userData, response.data]);
        })
        .catch((error) => {
          console.log(error);
        });
        closeForm();
    };
    const handleChange= (e) => {
        const value = e.target.value;
        const name = e.target.name;

        setFormData({
        ...formData,
        [name]: value
        });
    }
    
const columns = [
 {
  name: "firstName",
  label: "Vardas",
  options: {
   filter: false,
   sort: true,
  }
 },
 {
  name: "lastName",
  label: "Pavardė",
  options: {
   filter: false,
   sort: true,
  }
 },
 {
  name: "role",
  label: "Rolė",
  options: {
   filter: true,
   sort: true,
  }
 },
];

const options = {
  download: false,
  print: false,
  customToolbarSelect: selectedRows => (
    <CustomToolbarSelect selectedRows={selectedRows} />
  ),
  customToolbar: () => {
    return (
      <CustomToolbar handleClick={openForm}/>
    );
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

return(
  <>
    <MUIDataTable
      title={"Mokiniai"}
      data={userData}
      columns={columns}
      options={options}
    />
    <Dialog open={open} onClose={closeForm}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="normal"
            name="firstName"
            label="Vardas"
            type="text"
            fullWidth
            variant="standard"
            value={formData.firstName || ''}
            onChange={handleChange}
          />
         <TextField
            autoFocus
            margin="normal"
            name="lastName"
            label="Pavardė"
            type="text"
            fullWidth
            variant="standard"
            value={formData.lastName || ''}
            onChange={handleChange}
          />
          <TextField
            autoFocus
            margin="normal"
            name="username"
            label="Prisijungimo Vardas"
            type="text"
            fullWidth
            variant="standard"
            value={formData.username || ''}
            onChange={handleChange}
          />
          <TextField
            autoFocus
            margin="normal"
            name="password"
            label="Slaptažodis"
            type="password"
            fullWidth
            variant="standard"
            value={formData.password || ''}
            onChange={handleChange}
          />
          <InputLabel id="role-label">Rolė</InputLabel>
            <Select
                labelId="role-label"
                name="role"
                value={formData.role}
                label="Rolė"
                fullWidth
                onChange={handleChange}
            >
                <MenuItem value={"admin"}>Administratorius</MenuItem>
                <MenuItem value={"student"}>Mokinys</MenuItem>
                <MenuItem value={"teacher"}>Mokytojas</MenuItem>
                <MenuItem value={"parent"}>Mokinio tėvas</MenuItem>
            </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeForm}>Atšaukti</Button>
          <Button onClick={handleCreate}>Sukurti</Button>
        </DialogActions>
      </Dialog>
  </>
);
}