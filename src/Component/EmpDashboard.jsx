import { useState, useMemo, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import MasterCard from "../Component/MasterCard"
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { getRequestdetails } from "../Service/empdashboardService"

const EmpDashboard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  // // Sample rows (replace with API data)
  // const rows = [
  //   {
  //     id: 1,
  //     requestId: "REQ-1001",
  //     apartment: "A-101",
  //     requestDate: "2024-01-20",
  //     subCategory: "Plumbing",
  //     status: "Open"
  //   },
  //   {
  //     id: 2,
  //     requestId: "REQ-1002",
  //     apartment: "B-202",
  //     requestDate: "2024-01-18",
  //     subCategory: "Electrical",
  //     status: "Closed"
  //   }]
  // DataGrid Columns
  const columns = [
    { field: "requestId", headerName: "Request ID", flex: 1 },
    { field: "apartment", headerName: "Apartment", flex: 1 },
    { field: "requestDate", headerName: "Request Date", flex: 1 },
    { field: "subCategory", headerName: "SubCategory", flex: 1 },
    { field: "status", headerName: "Request Status", flex: 1 },

    {
      field: "history",
      headerName: "History",
      flex: 1,
      renderCell: () => (
        <Button variant="outlined" size="small">
          View
        </Button>
      )
    },

    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color={params.row.status === "Open" ? "error" : "success"}
          size="small"
        >
          {params.row.status === "Open" ? "Close" : "Reopen"}
        </Button>
      )
    }
  ];

  // User
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    
    const fetchData = async () => {
      debugger;
      const res = await getRequestdetails();
      setRows(res.data);
    }
    if (user) {
      fetchData();
    }
  }, []);


  // Global Search
  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, rows]);

  return (
    <>
      {/* MasterCards Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 2,
          mt: 2
        }}
      >
        <MasterCard
          icon={<AdminPanelSettingsIcon sx={{ fontSize: 50, color: "#ef6c00" }} />}
          label="Admin Dashboard"
          color="#fff3e0"
          onClick={() => navigate("/admindashboard")}
        />

        <MasterCard
          icon={<AddCircleIcon sx={{ fontSize: 50, color: "#1976d2" }} />}
          label="Raise Request"
          color="#e3f2fd"
          onClick={() => navigate("/maintenancerequest")}
        />
      </Box>


      <Box
        sx={{
          width: "90vw",
          margin: "30px auto"
        }}
      >
        {/* Search */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            borderRadius: 2,
            backgroundColor: "#f1f3f4",
            padding: "6px 12px",
            border: "1px solid #d0d7de",
          }}
        >
          <TextField
            placeholder="Search requests..."
            variant="standard"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              disableUnderline: true,
              sx: { fontSize: "1rem" }
            }}
          />

          <SearchIcon
            sx={{
              fontSize: 32,     // bigger icon
              ml: 1,
              color: "#1976d2",
              cursor: "pointer",
              "&:hover": { opacity: 0.8 }
            }}
          />
        </Box>

        <Box
          sx={{
            boxShadow: 2,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": { color: "primary.main" },
            height: 500,
            width: "100%"
          }}
        >
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSize={10}
            disableRowSelectionOnClick
            columnReordering
            sx={{
              "& .MuiTablePagination-root p": {
                marginTop: 0,
                marginBottom: 0
              }
            }}
          />
        </Box>


      </Box>
    </>
  );
};

export default EmpDashboard;