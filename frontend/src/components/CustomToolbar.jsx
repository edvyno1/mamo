import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Add } from "@mui/icons-material";

const CustomToolbar = ({ handleClick }) => {
  return (
    <React.Fragment>
      <Tooltip title={"Pridėti"}>
        <IconButton onClick={handleClick}>
          <Add />
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
};

export default CustomToolbar;
