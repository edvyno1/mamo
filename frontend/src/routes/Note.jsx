import { MenuItem, Select, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";

const Note = () => {
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
      </div>
      {/* <div style={{ height: "500px", width: "70vh" }}>

      </div> */}
    </Stack>
  );
};

export default Note;
