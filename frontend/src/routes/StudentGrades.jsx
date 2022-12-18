import { MenuItem, Select, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";

const StudentGrades = () => {
  const columnNames = () => {
    const columns = [
      {
        field: "subject",
        headerName: "Dalykas",
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
          editable: false,
          minWidth: 36,
          width: 36,
          sortable: false,
        };
      })
    );
  };

  const groups = [{ subject: "6B" }];

  return (
    <Stack>
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
      <div style={{ height: "500px", width: "900p" }}>
        <DataGrid
          rows={[
            { id: 1, subject: "Matematika" },
            { id: 2, subject: "Lietuvių kalba" },
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

export default StudentGrades;
