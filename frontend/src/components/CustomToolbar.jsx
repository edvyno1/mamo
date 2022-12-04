import { IconButton, Tooltip } from "@mui/material";
import { Add } from "@mui/icons-material";

const CustomToolbar = ({ handleClick }) => {
  return (
    <>
      <Tooltip title={"Pridėti"}>
        <IconButton onClick={handleClick}>
          <Add />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default CustomToolbar;
