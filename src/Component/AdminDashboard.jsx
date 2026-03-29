import { useState, useMemo, useEffect, useRef } from "react";
import {
  Box, TextField, Button, MenuItem, Select, InputLabel, FormControl, Modal, Typography, IconButton
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { getRequestdetails, updateAction } from "../Service/admindashboardService";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BoltIcon from "@mui/icons-material/Bolt";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Divider from "@mui/material/Divider";
import { Close, AttachFile, Schedule, HourglassEmpty, PauseCircle, Cancel, CheckCircle } from "@mui/icons-material";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import LockIcon from "@mui/icons-material/Lock";

const STATUS_MODAL_CONFIG = {
  "2": {
    label: "Approve",
    confirmText: "Are you sure you want to approve this request?",
    successText: "Request Approved Successfully",
    icon: "approve",
    color: "#2e7d32",
    btnColor: "success",
  },
  "3": {
    label: "OnHold",
    confirmText: "Are you sure you want to put this request on hold?",
    successText: "Request placed On Hold",
    icon: "onhold",
    color: "#e65100",
    btnColor: "warning",
  },
  "4": {
    label: "Reject",
    confirmText: "Are you sure you want to reject this request?",
    successText: "Request Rejected",
    icon: "reject",
    color: "#c62828",
    btnColor: "error",
  },
  "5": {
    label: "Close",
    confirmText: "Are you sure you want to close this request?",
    successText: "Request Closed Successfully",
    icon: "close",
    color: "#37474f",
    btnColor: "inherit",
  },
};

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
  const [confirmModal, setConfirmModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [pendingValue, setPendingValue] = useState(null); // holds the status value
  const [modelreqID, setModelreqID] = useState(null);
  const [modeldata, setModeldata] = useState({
    technician: "",
    remarks: "",
    admin: ""
  });
  const [modeldataErrors, setModeldataErrors] = useState({
    technician: "",
    remarks: ""
  });
  const [userDetail, setUserdetail] = useState({
    empId: "",
    name: "",
    role: "",
    mail: ""
  });
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
  // User

  const fetchData = async () => {
    const res = await getRequestdetails();
    setRows(res.data);
  }

  useEffect(() => {
    debugger;
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      setUserdetail({
        empId: user.empId,
        name: user.name,
        role: user.role,
        mail: user.mail
      })
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (selectedRow) {
      setModeldata(prev => ({
        ...prev,
        technician: selectedRow.technician || "",
        admin: userDetail.name
      }));
    }
  }, [selectedRow, userDetail.name]);

  const parseRequestId = (requestId) => Number(String(requestId).replace("REQ-", ""));

  const columns = [
    { field: "requestId", headerName: "Request ID", flex: 1 },
    { field: "facility", headerName: "Facility", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    { field: "apartment", headerName: "Apartment", flex: 1 },
    { field: "requestDate", headerName: "Request Date", flex: 1 },
    { field: "subCategory", headerName: "SubCategory", flex: 1 },
    {
      field: "status", headerName: "Request Status", flex: 1,
      renderCell: (params) => {
        switch (params.value) {
          case "Pending":
            return <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Schedule sx={{ fontSize: 14 }} /> Pending
            </Box>;
          case "InProgress":
            return <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <HourglassEmpty sx={{ fontSize: 14 }} /> InProgress
            </Box>;
          case "OnHold":
            return <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <PauseCircle sx={{ fontSize: 14 }} /> OnHold
            </Box>;
          case "Rejected":
            return <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Cancel sx={{ fontSize: 14 }} /> Rejected
            </Box>;
          case "Closed":
            return <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CheckCircle sx={{ fontSize: 14 }} /> Closed
            </Box>;
          default:
            return <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Schedule sx={{ fontSize: 14 }} /> Unknown
            </Box>;
        }
      }
    },
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
              setModeldata({
                technician: "",
                remarks: "",
                admin: ""
              });
              setModeldataErrors({
                technician: "",
                remarks: ""
              })
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

  const getActionButtons = (status) => {
    switch (status) {
      case "Pending":
        return [
          { label: "Approve", color: "#2e7d32", bg: "#e8f5e9", border: "#a5d6a7", value: "2" },
          { label: "OnHold", color: "#e65100", bg: "#fff3e0", border: "#ffcc80", value: "3" },
          { label: "Reject", color: "#c62828", bg: "#ffebee", border: "#ef9a9a", value: "4" },
        ];
      case "InProgress":
        return [
          { label: "Close", color: "#37474f", bg: "#eceff1", border: "#b0bec5", value: "5" },
        ];
      case "OnHold":
        return [
          { label: "Approve", color: "#2e7d32", bg: "#e8f5e9", border: "#a5d6a7", value: "2" },
          { label: "Reject", color: "#c62828", bg: "#ffebee", border: "#ef9a9a", value: "4" },
        ];
      case "Rejected":
      case "Closed":
      default:
        return [];   // No buttons
    }
  };

  const handleAction = (value, reqID) => {
    debugger;
    if (!validateModelData()) return;
    setModelreqID(reqID);
    setPendingValue(value);
    setConfirmModal(true);
  };

  const confirmAction = async () => {
    try {
      debugger;
      setConfirmModal(false);
      const payload = {
        requestId: parseRequestId(modelreqID),
        statusId: Number(pendingValue),
        technician: modeldata.technician,
        remarks: modeldata.remarks,
        admin: modeldata.admin
      };
      await updateAction(payload);
      fetchData();
      setSuccessModal(true);
      setTimeout(() => {
        setSuccessModal(false);
        setPendingValue(null);
        setModeldata({ technician: "", remarks: "", admin: "" });
        setModeldataErrors({ technician: "", remarks: "" });
      }, 2000);
      setViewModalOpen(false); //closing the modal pop up on updated status
      setSelectedRow(null);
    }
    catch (error) {
      console.error("Status update failed", error);
    }
  };

  // 4. Helper - Status based icon
  const StatusIcon = ({ type }) => {
    const iconStyle = (color) => ({
      fontSize: 70,
      mb: 2,
      animation: "pop 0.4s ease-out",
      color,
    });

    switch (type) {
      case "approve": return <CheckCircleIcon sx={iconStyle("#2e7d32")} />;
      case "onhold": return <PauseCircleFilledIcon sx={iconStyle("#e65100")} />;
      case "reject": return <CancelIcon sx={iconStyle("#c62828")} />;
      case "close": return <LockIcon sx={iconStyle("#37474f")} />;
      default: return <CheckCircleIcon sx={iconStyle("#4caf50")} />;
    }
  };
  const convertToISO = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  };

  // Global Search
  const filteredRows = useMemo(() => {
    console.log(rows);
    debugger;
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
        new Date(convertToISO(row.requestDate)) >= new Date(apply.startDate);

      const matchesEndDate =
        apply.endDate === "" ||
        new Date(convertToISO(row.requestDate)) <= new Date(apply.endDate);


      return (
        matchesSearch &&
        matchesStatus &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [search, rows, apply]);


  const handleApplyFilters = () => {
    const today = new Date().toISOString().split("T")[0];

    // compute final end date
    const finalEndDate = endDate === "" ? today : endDate;

    // validation
    if (startDate && finalEndDate < startDate) {
      alert("End Date should not be behind the Start Date.");
      return;
    }

    // apply filters
    setApply({
      startDate,
      endDate: finalEndDate,
      searchStatus
    });
  };

  const handleModelChange = (field) => (e) => {
    setModeldata((prev) => ({ ...prev, [field]: e.target.value }));
    setModeldataErrors((prev) => ({ ...prev, [field]: "" })); // clear error on type
  };



  const validateModelData = () => {
    debugger;
    const errors = {};

    if (!selectedRow?.technician && !modeldata.technician.trim()) {
      errors.technician = "Technician is required";
    }
    if (!modeldata.remarks.trim()) {
      errors.remarks = "Remarks is required";
    }

    setModeldataErrors(errors);
    return Object.keys(errors).length === 0; // true = valid
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Box sx={{ display: "inline" }}>
          <Schedule sx={{ fontSize: 14 }} /> Pending
        </Box>;
      case "InProgress":
        return <Box sx={{ display: "inline", color: "#2e7d32" }}>
          <HourglassEmpty sx={{ fontSize: 14 }} /> InProgress
        </Box>;
      case "OnHold":
        return <Box sx={{ display: "inline", color: "#e65100" }}>
          <PauseCircle sx={{ fontSize: 14 }} /> OnHold
        </Box>;
      case "Rejected":
        return <Box sx={{ display: "inline", color: "#c62828" }}>
          <Cancel sx={{ fontSize: 14 }} /> Rejected
        </Box>;
      case "Closed":
        return <Box sx={{ display: "inline", color: "#37474f" }}>
          <CheckCircle sx={{ fontSize: 14 }} /> Closed
        </Box>;
      default:
        return <Box sx={{ display: "inline" }}>
          <Schedule sx={{ fontSize: 14 }} /> UnKnown
        </Box>;
    }
  }
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
                { label: "Admin", field: null, value: selectedRow?.status === "Pending" ? userDetail.name : selectedRow?.admin },
                { label: "Technician", field: "technician", value: selectedRow?.technician },
                { label: "Status", field: null, value: getStatusIcon(selectedRow?.status) },
              ].map(({ label, field, value }) => (
                <Box key={label}>
                  <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.3 }}>
                    {label}
                  </Typography>

                  {value ? (
                    // Already has data — show as read-only
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.primary" }}>
                      {value}
                    </Typography>
                  ) : field ? (
                    <TextField
                      placeholder="Enter Technician"
                      size="small"
                      value={modeldata.technician}
                      onChange={handleModelChange("technician")}
                      error={!!modeldataErrors.technician}
                      helperText={modeldataErrors.technician}
                      sx={{
                        width: "100%",
                        "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: 13 },
                      }}
                    />
                  ) : (
                    // Admin and Status — show dash when empty
                    <Typography sx={{ fontSize: 13, color: "text.disabled" }}>—</Typography>
                  )}
                </Box>
              ))}
            </Box>

            {/* Issue Description */}
            <Box sx={{ bgcolor: "#f5f7fa", borderRadius: 2, px: 2, py: 1.5, mb: 1.5 }}>
              <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.3 }}>Issue Description</Typography>
              <Typography sx={{ fontSize: 13, color: "text.primary" }}>{selectedRow?.description || "—"}</Typography>
            </Box>

            {/* Admin Remarks (read-only, shown if exists) */}
            {selectedRow?.adminRemarks && (
              <Box sx={{ bgcolor: "#f5f7fa", borderRadius: 2, px: 2, py: 1.5, mb: 2 }}>
                <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.3 }}>Previous Admin Remarks</Typography>
                <Typography sx={{ fontSize: 13, color: "text.primary" }}>{selectedRow.adminRemarks}</Typography>
              </Box>
            )}

            {(selectedRow?.status !== 'Rejected' && selectedRow?.status !== 'Closed') && (<Divider sx={{ my: 2 }} />)}

            {/* Section 3 — Remarks */}
            {(selectedRow?.status !== 'Rejected' && selectedRow?.status !== 'Closed') && (
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#1e3a5f", fontWeight: 700, mb: 1, textTransform: "uppercase", letterSpacing: 0.8, fontSize: 11 }}>
                  Remarks
                </Typography>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Enter your remarks here..."
                  size="small"
                  value={modeldata.remarks}
                  onChange={handleModelChange("remarks")}
                  error={!!modeldataErrors.remarks}
                  helperText={modeldataErrors.remarks}
                  sx={{
                    mb: 2.5,
                    "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: 13 },
                  }}
                />
              </Box>
            )}

            {/* Action Buttons */}
            {modeldata &&
              <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
                {getActionButtons(selectedRow?.status).map(({ label, color, bg, border, value }) => (
                  <Button
                    key={label}
                    variant="contained"
                    size="small"
                    onClick={() => handleAction(value, selectedRow?.requestId)}
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
            }
          </Box>
        </Box>
      </Modal>
      {/* Confirm Modal */}
      {confirmModal && pendingValue && (() => {
        const config = STATUS_MODAL_CONFIG[pendingValue];
        return (
          <Modal open={confirmModal} onClose={() => setConfirmModal(false)}>
            <Box sx={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%", maxWidth: 380,
              bgcolor: "background.paper", boxShadow: 24,
              borderRadius: 3, p: { xs: 2, sm: 4 },
              textAlign: "center", maxHeight: "90vh", overflowY: "auto"
            }}>
              <StatusIcon type={config.icon} />

              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                Confirm {config.label}
              </Typography>

              <Typography sx={{ mb: 3, color: "gray" }}>
                {config.confirmText}
              </Typography>

              <Button
                variant="contained"
                color={config.btnColor}
                fullWidth
                sx={{ mb: 1 }}
                onClick={confirmAction}
              >
                Yes, {config.label}
              </Button>

              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={() => setConfirmModal(false)}
              >
                Cancel
              </Button>
            </Box>
          </Modal>
        );
      })()}

      {/* Success Modal */}
      {successModal && pendingValue && (() => {
        const config = STATUS_MODAL_CONFIG[pendingValue];
        return (
          <Modal open={successModal} onClose={() => setSuccessModal(false)}>
            <Box sx={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%", maxWidth: 380,
              bgcolor: "background.paper", boxShadow: 24,
              borderRadius: 3, p: { xs: 3, sm: 4 },
              textAlign: "center", maxHeight: "90vh", overflowY: "auto"
            }}>
              <StatusIcon type={config.icon} />

              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                {config.successText}
              </Typography>

              <Typography sx={{ color: "gray" }}>
                Updating request status...
              </Typography>
            </Box>
          </Modal>
        );
      })()}
    </>
  );
};

export default AdminDashboard;