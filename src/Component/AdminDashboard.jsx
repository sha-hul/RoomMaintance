import { useState, useMemo, useEffect, useRef } from "react";
import {
  Box, TextField, Button, MenuItem, Select, InputLabel, FormControl, Modal, Typography, IconButton
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { getRequestdetails } from "../Service/admindashboardService";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BoltIcon from "@mui/icons-material/Bolt";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Divider from "@mui/material/Divider";
import { Close, AttachFile } from "@mui/icons-material";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [apply, setApply] = useState({
    startDate: "",
    endDate: "",
    searchStatus: ""
  });
  const [openStartCalendar, setOpenStartCalendar] = useState(false);
  const [openEndCalendar, setOpenEndCalendar] = useState(false);
  const startRef = useRef(null);
  const endRef = useRef(null);
  const [viewmodalOpen, setViewModalOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  // // Sample rows (replace with API data)
  // const rows = [
  //   { id: 1, requestId: "REQ-1001", facility: "Dammam", location: "Mukthi Villa", apartment: "A-101", requestDate: "2026-01-20", subCategory: "Plumbing", status: "Pending" },
  //   { id: 2, requestId: "REQ-1002", facility: "Khobar", location: "Compound", apartment: "B-202", requestDate: "2026-01-18", subCategory: "Electrical", status: "InProgress" },
  //   { id: 3, requestId: "REQ-1003", facility: "Jubail", location: "Palm Residency", apartment: "C-305", requestDate: "2026-01-22", subCategory: "AC Maintenance", status: "Closed" },
  //   { id: 4, requestId: "REQ-1004", facility: "Dammam", location: "Laundry", apartment: "A-210", requestDate: "2026-01-19", subCategory: "Carpentry", status: "Rejected" },
  //   { id: 5, requestId: "REQ-1005", facility: "Khobar", location: "Chandran Villa Old", apartment: "B-110", requestDate: "2026-01-17", subCategory: "Painting", status: "OnHold" },
  //   { id: 6, requestId: "REQ-1006", facility: "Jubail", location: "Pharmacy-18", apartment: "C-120", requestDate: "2026-01-21", subCategory: "Cleaning", status: "Pending" },
  //   { id: 7, requestId: "REQ-1007", facility: "Dammam", location: "Jubail Residency", apartment: "A-330", requestDate: "2026-01-23", subCategory: "Pest Control", status: "Closed" },
  //   { id: 8, requestId: "REQ-1008", facility: "Khobar", location: "Mukthi Villa", apartment: "B-415", requestDate: "2026-01-16", subCategory: "Electrical", status: "InProgress" },
  //   { id: 9, requestId: "REQ-1009", facility: "Jubail", location: "Compound", apartment: "C-501", requestDate: "2026-01-24", subCategory: "Plumbing", status: "Rejected" },
  //   { id: 10, requestId: "REQ-1010", facility: "Dammam", location: "Palm Residency", apartment: "A-150", requestDate: "2026-01-15", subCategory: "AC Maintenance", status: "Pending" },

  //   { id: 11, requestId: "REQ-1011", facility: "Khobar", location: "Laundry", apartment: "B-305", requestDate: "2026-01-14", subCategory: "Carpentry", status: "OnHold" },
  //   { id: 12, requestId: "REQ-1012", facility: "Jubail", location: "Chandran Villa Old", apartment: "C-220", requestDate: "2026-01-13", subCategory: "Cleaning", status: "InProgress" },
  //   { id: 13, requestId: "REQ-1013", facility: "Dammam", location: "Pharmacy-18", apartment: "A-402", requestDate: "2026-01-12", subCategory: "Painting", status: "Pending" },
  //   { id: 14, requestId: "REQ-1014", facility: "Khobar", location: "Jubail Residency", apartment: "B-118", requestDate: "2026-01-11", subCategory: "Pest Control", status: "Rejected" },
  //   { id: 15, requestId: "REQ-1015", facility: "Jubail", location: "Mukthi Villa", apartment: "C-330", requestDate: "2026-01-10", subCategory: "Electrical", status: "Closed" },
  //   { id: 16, requestId: "REQ-1016", facility: "Dammam", location: "Compound", apartment: "A-250", requestDate: "2026-01-09", subCategory: "Plumbing", status: "InProgress" },
  //   { id: 17, requestId: "REQ-1017", facility: "Khobar", location: "Palm Residency", apartment: "B-512", requestDate: "2026-01-08", subCategory: "AC Maintenance", status: "Pending" },
  //   { id: 18, requestId: "REQ-1018", facility: "Jubail", location: "Laundry", apartment: "C-140", requestDate: "2026-01-07", subCategory: "Carpentry", status: "OnHold" },
  //   { id: 19, requestId: "REQ-1019", facility: "Dammam", location: "Chandran Villa Old", apartment: "A-360", requestDate: "2026-01-06", subCategory: "Cleaning", status: "Rejected" },
  //   { id: 20, requestId: "REQ-1020", facility: "Khobar", location: "Pharmacy-18", apartment: "B-220", requestDate: "2026-01-05", subCategory: "Painting", status: "Closed" },

  //   { id: 21, requestId: "REQ-1021", facility: "Jubail", location: "Jubail Residency", apartment: "C-410", requestDate: "2026-01-04", subCategory: "Electrical", status: "InProgress" },
  //   { id: 22, requestId: "REQ-1022", facility: "Dammam", location: "Mukthi Villa", apartment: "A-180", requestDate: "2026-01-03", subCategory: "Plumbing", status: "Pending" },
  //   { id: 23, requestId: "REQ-1023", facility: "Khobar", location: "Compound", apartment: "B-330", requestDate: "2026-01-02", subCategory: "AC Maintenance", status: "Rejected" },
  //   { id: 24, requestId: "REQ-1024", facility: "Jubail", location: "Palm Residency", apartment: "C-260", requestDate: "2026-01-01", subCategory: "Pest Control", status: "InProgress" },
  //   { id: 25, requestId: "REQ-1025", facility: "Dammam", location: "Laundry", apartment: "A-501", requestDate: "2025-12-31", subCategory: "Carpentry", status: "Closed" },
  //   { id: 26, requestId: "REQ-1026", facility: "Khobar", location: "Chandran Villa Old", apartment: "B-145", requestDate: "2025-12-30", subCategory: "Cleaning", status: "Pending" },
  //   { id: 27, requestId: "REQ-1027", facility: "Jubail", location: "Pharmacy-18", apartment: "C-350", requestDate: "2025-12-29", subCategory: "Painting", status: "InProgress" },
  //   { id: 28, requestId: "REQ-1028", facility: "Dammam", location: "Jubail Residency", apartment: "A-275", requestDate: "2025-12-28", subCategory: "Electrical", status: "OnHold" },
  //   { id: 29, requestId: "REQ-1029", facility: "Khobar", location: "Mukthi Villa", apartment: "B-480", requestDate: "2025-12-27", subCategory: "Plumbing", status: "Closed" },
  //   { id: 30, requestId: "REQ-1030", facility: "Jubail", location: "Compound", apartment: "C-600", requestDate: "2025-12-26", subCategory: "AC Maintenance", status: "Rejected" }
  // ];

  // DataGrid Columns
  const columns = [
    { field: "requestId", headerName: "Request ID", flex: 1 },
    { field: "facility", headerName: "Facility", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    { field: "apartment", headerName: "Apartment", flex: 1 },
    { field: "requestDate", headerName: "Request Date", flex: 1 },
    { field: "subCategory", headerName: "SubCategory", flex: 1 },
    { field: "status", headerName: "Request Status", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => {
        const status = params.row.status;

        const isTakeAction =
          status === "Pending" ||
          status === "InProgress" ||
          status === "OnHold";

        return isTakeAction ? (
          // TAKE ACTION BUTTON
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#1976d2",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              px: 2,
              "&:hover": { backgroundColor: "#125ea8" }
            }}
            startIcon={<BoltIcon />}
            onClick={() => {
              setSelectedRow(params.row);
              setViewModalOpen(true);
            }}
          >
            Take Action
          </Button>
        ) : (
          // REJECTED / CLOSED BUTTON
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: status === "Rejected" ? "#d32f2f" : "#2e7d32",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              px: 2,
              "&:hover": {
                backgroundColor:
                  status === "Rejected" ? "#b71c1c" : "#1b5e20"
              }
            }}
            startIcon={
              status === "Rejected" ? (
                <CancelIcon />
              ) : (
                <CheckCircleIcon />
              )
            }
            onClick={() => {
              setSelectedRow(params.row);
              setViewModalOpen(true);
            }}
          >
            {status === "Rejected" ? "Rejected" : "Closed"}
          </Button>
        );
      }
    }
  ];

  // User
  useEffect(() => {
    debugger;
    const user = JSON.parse(sessionStorage.getItem("user"));

    const fetchData = async () => {
      const res = await getRequestdetails();
      setRows(res.data);
    }
    if (user) {
      fetchData();
    }
  }, []);

  // Global Search
  const filteredRows = useMemo(() => {
    console.log(rows);
    return rows.filter((row) => {
      const matchesSearch = Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        apply.searchStatus === "" ||
        row.status.toLowerCase() === apply.searchStatus.toLowerCase();

      const matchesStartDate =
        apply.startDate === "" ||
        new Date(row.requestDate) >= new Date(apply.startDate);

      const matchesEndDate =
        apply.endDate === "" ||
        new Date(row.requestDate) <= new Date(apply.endDate);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [search, rows, apply]);


  const handleApplyFilters = () => {
    if (endDate < startDate)
      return alert("End Date should not behind the Start Date.")
    setApply({
      startDate,
      endDate,
      searchStatus
    });
  };


  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          mt: 2,
          py: 3,
          px: 3,
          border: "1px solid #ccc",
          width: "80vw",
          margin: "30px auto",
          borderRadius: 2,
          backgroundColor: "#fafafa"
        }}
      >

        {/* Search Box */}
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
            placeholder="Search here..."
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
              fontSize: 28,
              ml: 1,
              color: "#1976d2",
              cursor: "pointer",
              "&:hover": { opacity: 0.8 }
            }}
          />
        </Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* Start Date */}
          <Box
            ref={startRef}
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
              placeholder="Start Date"
              variant="standard"
              fullWidth
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputProps={{ disableUnderline: true, readOnly: true, }}
            />
            <CalendarMonthIcon
              sx={{
                fontSize: 26,
                color: "#1976d2",
                cursor: "pointer",
                "&:hover": { opacity: 0.8 }
              }}
              onClick={() => setOpenStartCalendar(true)}
            />
          </Box>

          {/* End Date */}
          <Box
            ref={endRef}
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
              placeholder="End Date"
              variant="standard"
              fullWidth
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputProps={{ disableUnderline: true, readOnly: true }}
            />
            <CalendarMonthIcon
              sx={{
                fontSize: 26,
                color: "#1976d2",
                cursor: "pointer",
                "&:hover": { opacity: 0.8 }
              }}
              onClick={() => setOpenEndCalendar(true)}
            />
          </Box>
          {/* Hidden Start Date Picker */}
          <DatePicker
            open={openStartCalendar}
            onClose={() => setOpenStartCalendar(false)}
            value={startDate ? dayjs(startDate) : null}
            onChange={(newValue) => {
              setStartDate(newValue ? newValue.format("YYYY-MM-DD") : "");
            }}
            slotProps={{
              textField: { sx: { display: "none" } },
              popper: {
                anchorEl: startRef.current
              }
            }}
          />


          {/* Hidden End Date Picker */}
          <DatePicker
            open={openEndCalendar}
            onClose={() => setOpenEndCalendar(false)}
            value={endDate ? dayjs(endDate) : null}
            onChange={(newValue) => {
              setEndDate(newValue ? newValue.format("YYYY-MM-DD") : "");
            }}
            slotProps={{
              textField: { sx: { display: "none" } },
              popper: {
                anchorEl: endRef.current
              }
            }}
          />


        </LocalizationProvider>



        <FormControl
          size="small"
          sx={{
            width: 200,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#f1f3f4",
              borderRadius: "8px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#d0d7de",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#b4b9be",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1976d2",
              },
            },
          }}
        >
          <InputLabel>Status</InputLabel>
          <Select
            value={searchStatus}
            label="Status"
            onChange={(e) => setSearchStatus(e.target.value)}
          >
            <MenuItem value=""><em>All</em></MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="InProgress">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
            <MenuItem value="OnHold">On Hold</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
          </Select>
        </FormControl>

        {/* Apply Button */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1976d2",
            "&:hover": { backgroundColor: "#125ea8" },
            height: 45,
            px: 4
          }}
          onClick={handleApplyFilters}
        >
          Apply
        </Button>

        {/* Reset Button */}
        <Button
          type="button"
          variant="outlined"
          sx={{
            borderColor: "#1976d2",
            color: "#1976d2",
            "&:hover": {
              borderColor: "#125ea8",
              backgroundColor: "#e8f1fb"
            },
            height: 45,
            px: 4
          }}
          onClick={() => navigate(0)}
        >
          Reset
        </Button>


      </Box>

      <Box
        sx={{
          width: "80vw",
          margin: "30px auto"
        }}
      >
        <Box
          sx={{
            boxShadow: 2,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": { color: "primary.main" },
            height: "67vh",
            width: "100%"
          }}
        >
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSizeOptions={[10, 25, 50, 100]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } }
            }}
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
      {/* View Modal */}
      <Modal open={viewmodalOpen} onClose={() => { setViewModalOpen(false); setSelectedRow(null); }}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 680,
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            outline: "none",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 3,
              py: 2,
              bgcolor: "#1e3a5f",
              borderRadius: "12px 12px 0 0",
            }}
          >
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600 }}>
              View Request Details — {selectedRow?.requestId}
            </Typography>
            <IconButton onClick={() => { setViewModalOpen(false); setSelectedRow(null); }} sx={{ color: "#fff" }}>
              <Close />
            </IconButton>
          </Box>

          <Box sx={{ px: 3, py: 2.5 }}>

            {/* Section 1 — Request Info */}
            <Typography variant="subtitle2" sx={{ color: "#1e3a5f", fontWeight: 700, mb: 1.5, textTransform: "uppercase", letterSpacing: 0.8, fontSize: 11 }}>
              Request Information
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, mb: 2 }}>
              {[
                { label: "Facility", value: selectedRow?.facility },
                { label: "Location", value: selectedRow?.location },
                { label: "Apartment", value: selectedRow?.apartment },
                { label: "Category", value: selectedRow?.category },
                { label: "Sub Category", value: selectedRow?.subCategory },
                { label: "Employee Name", value: selectedRow?.employeeName },
                { label: "Mobile", value: selectedRow?.contactNo },
                { label: "Date", value: selectedRow?.requestDate },
              ].map(({ label, value }) => (
                <Box key={label}>
                  <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.3 }}>{label}</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.primary" }}>{value || "—"}</Typography>
                </Box>
              ))}

              {/* Attachment */}
              <Box>
                <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.3 }}>Attachment</Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AttachFile sx={{ fontSize: 13 }} />}
                  sx={{ fontSize: 12, textTransform: "none", borderRadius: 2, py: 0.3 }}
                >
                  View File
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Section 2 — Approver Info */}
            <Typography variant="subtitle2" sx={{ color: "#1e3a5f", fontWeight: 700, mb: 1.5, textTransform: "uppercase", letterSpacing: 0.8, fontSize: 11 }}>
              Approver Details
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, mb: 2 }}>
              {[
                { label: "Admin", value: selectedRow?.admin },
                { label: "Technician", value: selectedRow?.technician },
                { label: "Status", value: selectedRow?.status },
              ].map(({ label, value }) => (
                <Box key={label}>
                  <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.3 }}>{label}</Typography>
                  {
                    value ? <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.primary" }}>{value}</Typography>
                      : <TextField
                        placeholder={`Enter ${label}`}
                        size="small"
                        sx={{
                          mb: 2.5,
                          "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: 13 },
                        }}
                      />
                  }

                </Box>
              ))}
            </Box>

            {/* Issue Description */}
            <Box sx={{ bgcolor: "#f5f7fa", borderRadius: 2, px: 2, py: 1.5, mb: 1.5 }}>
              <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.3 }}>Issue Description</Typography>
              <Typography sx={{ fontSize: 13, color: "text.primary" }}>{selectedRow?.description || "—"}</Typography>
            </Box>

            {/* Admin Remarks (read-only, shown if exists)
            {selectedRow?.adminRemarks && (
              <Box sx={{ bgcolor: "#f5f7fa", borderRadius: 2, px: 2, py: 1.5, mb: 2 }}>
                <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.3 }}>Previous Admin Remarks</Typography>
                <Typography sx={{ fontSize: 13, color: "text.primary" }}>{selectedRow.adminRemarks}</Typography>
              </Box>
            )} */}

            <Divider sx={{ my: 2 }} />

            {/* Section 3 — Remarks */}
            <Typography variant="subtitle2" sx={{ color: "#1e3a5f", fontWeight: 700, mb: 1, textTransform: "uppercase", letterSpacing: 0.8, fontSize: 11 }}>
              Remarks
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Enter your remarks here..."
              size="small"
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: 13 },
              }}
            />

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
              {[
                { label: "Approve", color: "#2e7d32", bg: "#e8f5e9", border: "#a5d6a7" },
                { label: "On Hold", color: "#e65100", bg: "#fff3e0", border: "#ffcc80" },
                { label: "Reject", color: "#c62828", bg: "#ffebee", border: "#ef9a9a" },
                { label: "Close", color: "#37474f", bg: "#eceff1", border: "#b0bec5" },
              ].map(({ label, color, bg, border }) => (
                <Button
                  key={label}
                  variant="contained"
                  size="small"
                  sx={{
                    bgcolor: bg, color,
                    border: `1px solid ${border}`,
                    boxShadow: "none", fontWeight: 600, fontSize: 12,
                    borderRadius: 2, textTransform: "none", px: 2.5,
                    "&:hover": { bgcolor: border, boxShadow: "none" },
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>

          </Box>
        </Box>
      </Modal>

    </>
  );
};

export default AdminDashboard;