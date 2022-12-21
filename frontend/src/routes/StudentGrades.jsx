import { TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";

const StudentGrades = () => {
  const [grades, setGrades] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  const [rows, setRows] = useState([]);

  const fetchGrades = (year, month) => {
    if (selectedDate) {
      axios
        .get(`http://localhost:5000/student/grades/${year}-${month}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        })
        .then((response) => {
          setGrades(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/groups/user", {
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
  }, []);

  useEffect(() => {
    if (groupData.length > 0) {
      setSelectedDate(moment());
    }
  }, [groupData]);

  useEffect(() => {
    if (selectedDate) {
      setRows(
        [...groupData].map((group) => ({
          id: group._id.$oid,
          subject: group.subject,
        }))
      );
      fetchGrades(selectedDate.toObject().years, ++selectedDate.toObject().months);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (grades.length > 0) {
      const changedRows = structuredClone(rows);
      changedRows.forEach((row) => {
        [...grades]
          .filter((grade) => grade.group.$oid == row.id)
          .forEach((grade) => {
            row[new Date(grade.date.$date.toString()).getDate().toString()] = grade.value;
          });
      });

      setRows(changedRows);
    }
  }, [grades]);

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

  return (
    <Stack spacing={4} style={{ width: "70%" }}>
      <div style={{ display: "flex", gap: "40px" }}>
        <DatePicker
          views={["month"]}
          label="Mėnuo"
          openTo="month"
          value={selectedDate}
          onChange={(newValue) => {
            setSelectedDate(newValue);
          }}
          renderInput={(params) => <TextField {...params} helperText={null} />}
        />
      </div>
      <div style={{ height: "500px", width: "900p" }}>
        <DataGrid
          rows={rows}
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
