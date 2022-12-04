import { Divider, MenuItem, Select, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";

const Grades = () => {
  const columnNames = () => {
    const columns = [
      {
        field: "name",
        headerName: "Pavardė, Vardas",
        editable: false,
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
          editable: true,
          minWidth: 36,
          width: 36,
          sortable: false,
        };
      })
    );
  };
  const groups = [{ subject: "6B" }];
  return (
    <Stack style={{ width: "100%" }}>
      <div>
        <Select>
          {groups.map(({ subject }, index) => (
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
      <Divider />
      <div style={{ height: "500px", width: "100%" }}>
        <DataGrid
          rows={[
            { id: 1, name: "Pavardenis Vardenis" },
            { id: 2, name: "Pavardenis Vardenis" },
          ]}
          columns={columnNames()}
          experimentalFeatures={{ newEditingApi: true }}
          disableColumnFilter
          disableColumnMenu
          autoHeight
        />
      </div>
    </Stack>
  );
};

export default Grades;
