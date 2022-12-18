import { Button, MenuItem, Select, TextareaAutosize } from "@mui/material";
import { Stack } from "@mui/system";

const Note = () => {
  const groups = [{ subject: "6B" }];
  return (
    <Stack>
      <Select>
        {groups.map(({ subject }, index) => (
          <MenuItem key={index} value={subject}>
            {subject}
          </MenuItem>
        ))}
      </Select>
      <TextareaAutosize minRows={3} />
      <Button>Submit</Button>
    </Stack>
  );
};

export default Note;
