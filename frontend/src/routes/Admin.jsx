import { Box } from '@mui/system';
import MUIDataTable from "mui-datatables";
import CustomToolbar from '../components/CustomToolbar';
import CustomToolbarSelect from '../components/CustomToolbarSelect';
import FormDialog from '../components/FormDialog';

export default function Admin() {

const columns = [
 {
  name: "name",
  label: "Name",
  options: {
   filter: true,
   sort: true,
  }
 },
 {
  name: "company",
  label: "Company",
  options: {
   filter: true,
   sort: false,
  }
 },
 {
  name: "city",
  label: "City",
  options: {
   filter: true,
   sort: false,
  }
 },
 {
  name: "state",
  label: "State",
  options: {
   filter: true,
   sort: false,
  }
 },
];

const data = [
 { name: "Joe James", company: "Test Corp", city: "Yonkers", state: "NY" },
 { name: "John Walsh", company: "Test Corp", city: "Hartford", state: "CT" },
 { name: "Bob Herm", company: "Test Corp", city: "Tampa", state: "FL" },
 { name: "James Houston", company: "Test Corp", city: "Dallas", state: "TX" },
];

const options = {
  download: false,
  print: false,
  customToolbarSelect: selectedRows => (
    <CustomToolbarSelect selectedRows={selectedRows} />
  ),
  customToolbar: () => {
    return (
      <CustomToolbar />
    );
  }
};

return(
  <>
    <MUIDataTable
      download={false}
      title={"Grupės"}
      data={data}
      columns={columns}
      options={options}
    />
    <Box sx={{ m: '2rem' }}/>
    <MUIDataTable
      title={"Mokiniai"}
      data={data}
      columns={columns}
      options={options}
    />
    <Box sx={{ m: '2rem' }}/>
    <MUIDataTable
      title={"Mokytojai"}
      data={data}
      columns={columns}
      options={options}
    />
    <FormDialog/>
  </>
);
}