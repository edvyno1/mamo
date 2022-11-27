import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

class CustomToolbarSelect extends React.Component {
  handleClick = () => {
    console.log("click! current selected rows", this.props.selectedRows);
  };

  render() {
    return (
      <div className={"custom-toolbar-select"}>
        <Tooltip title={"icon 2"}>
          <IconButton onClick={this.handleClick}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip title={"icon 1"}>
          <IconButton onClick={this.handleClick}>
            <Delete />
          </IconButton>
        </Tooltip>
      </div>
    );
  }
}

export default CustomToolbarSelect;
