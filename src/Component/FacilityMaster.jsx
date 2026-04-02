import React, { useEffect, useState } from "react";
import {
  Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl, InputLabel, Select, MenuItem,
  Paper, IconButton, Switch, Modal, Typography, TablePagination
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { getAllFacility, updateFacility, addFacility, changeFacilityStatus } from "../Service/facilitymasterService.js"
import useToast from '../Common/useToast.jsx'
import Toast from '../Common/Toast.jsx'
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const FacilityMaster = (empId) => {

  const [facilities, setFacilities] = useState([]);
  const [facilityName, setFacilityName] = useState("");
  const [search, setSearch] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [editId, setEditId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [inactiveModal, setInactiveModal] = useState(false);
  const [activeModal, setActiveModal] = useState(false);
  const [selectedLocationName, setSelectedLocationName] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const { toast, showSuccess, showError, showWarning, closeToast } = useToast();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  const navigate = useNavigate();

  // Load all facilities
  const loadFacilities = async () => {
    try {
      const res = await getAllFacility();
      setFacilities(res.data);
    }
    catch (err) {
      console.error("loadFacilities - error occurred :", err);
      navigate("/error");
    }
  };

  useEffect(() => {
    loadFacilities();
  }, []);

  // Add or Update Facility
  const handleSubmit = async () => {
    if (!facilityName.trim()) {
      showWarning("Facility name is required");
      return;
    }
    if (facilities.some(f => f.facilityName.toLowerCase() === facilityName.toLowerCase())) {
      showWarning("Facility already exisit");
      return;
    }

    try {
      if (editId) {
        await updateFacility(editId, facilityName);
        showSuccess("Facility updated successfully");
      } else {
        await addFacility(facilityName);
        showSuccess("Facility added successfully");
      }

      setFacilityName("");
      setEditId(null);
      setModalOpen(false);
      loadFacilities();

    } catch (error) {
      if (editId)
        showError("Failed to update facility");
      else
        showError("Failed to save facility");
      console.error("Failed to Save/Update facility:", error);
    }
  };


  // Edit Facility
  const handleEdit = (item) => {
    setFacilityName(item.facilityName);
    setEditId(item.id);
    setModalOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Toggle Active/Inactive
  const toggleStatus = async (item) => {
    try {
      await changeFacilityStatus(item.id, item.isActive);
      loadFacilities();
    } catch (error) {
      console.error("toggleStatus - error occurred:", error);
      navigate("/error");     
    }
  };

  // Toggle Active/Inactive Modal Popup
  const openStatusModal = (item) => {
    setSelectedLocationId(item.id)
    setSelectedLocationName(item.facilityName)
    item.isActive ? setInactiveModal(true) : setActiveModal(true);
  }

  //Add Facility Button
  const handleAddFacility = () => {
    setEditId(null)
    setFacilityName("")
    setModalOpen(true)
  }
  
  const blueInputStyle = {
    "& .MuiInputLabel-root": {
      color: "#1976d2"
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#1976d2"
    },
    "& .MuiOutlinedInput-root": {
      "& > fieldset": {
        borderColor: "#1976d2 !important"
      },
      "&:hover > fieldset": {
        borderColor: "#1976d2 !important"
      },
      "&.Mui-focused > fieldset": {
        borderColor: "#1976d2 !important"
      }
    }
  };

  const filtered = facilities
    .filter(f => f && typeof f.facilityName === "string")
    .filter(f => {
      const matchesSearch = f.facilityName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        searchStatus === "Active"
          ? f.isActive === true
          : searchStatus === "Inactive"
            ? f.isActive === false
            : true;

      return matchesSearch && matchesStatus;
    });

  return (<>
    {/* Heading */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        mb: 4
      }}
    >
      {/* BACK BUTTON - LEFT CORNER */}
      <IconButton
        onClick={() => navigate("/masters")}
        sx={{
          position: "absolute",
          left: 0,
          color: "#1976d2"
        }}
      >
        <ArrowBackIcon sx={{ fontSize: 32 }} />  {/* Bigger size */}
      </IconButton>

      {/* CENTER TITLE */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          letterSpacing: "0.5px",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            width: "60%",
            height: "4px",
            backgroundColor: "#1976d2",
            bottom: -6,
            left: "20%",
            borderRadius: 2
          }
        }}
      >
        Facility Master
      </Typography>
    </Box>

    <Box
      sx={{
        p: 3,
        mx: 3,   // left & right margin
        mb: 6,   // bottom margin
        mt: 2    // top margin
      }}
    >
      {/* Add Button */}
      <Button
        variant="contained"
        startIcon={<AddCircleIcon />}
        onClick={handleAddFacility}
        sx={{ mb: 3 }}
      >
        Add Facility
      </Button>

      {/* Search + Status Filter */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>

        {/* Status Dropdown */}
        <FormControl size="small" sx={{ width: 200, ...blueInputStyle }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={searchStatus}
            label="Status"
            onChange={(e) => setSearchStatus(e.target.value)}
            sx={{
              "& .MuiSelect-select": {
                padding: "10px 14px"   // match TextField padding
              }
            }}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        {/* Search Field */}
        <TextField
          label="Search Facility"
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ ...blueInputStyle }}
        />

        {/* Search Icon */}
        <SearchIcon
          sx={{
            color: "#1976d2",
            mt: "4px"   // aligns icon with TextField
          }}
        />

      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table >
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>S.No</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Facility</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>


          <TableBody>
            {(() => {
              const paginated = filtered.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              );


              if (filtered.length === 0) {
                return (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3, color: "#888" }}>
                      No Record Found
                    </TableCell>
                  </TableRow>
                );
              }

              return paginated.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{item.facilityName}</TableCell>
                  <TableCell>
                    <Switch
                      checked={item.isActive}
                      onChange={() => openStatusModal(item)}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#1976d2"
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                          backgroundColor: "#1976d2"
                        }
                      }}
                    />
                    {item.isActive ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(item)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ));
            })()}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            "& .MuiTablePagination-toolbar": {
              flexWrap: "nowrap",
              alignItems: "center",
            },
            "& .MuiTablePagination-selectLabel": {
              margin: 0,
            },
            "& .MuiTablePagination-displayedRows": {
              margin: 0,
            },
          }}
        />
      </TableContainer>

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 2,
            boxShadow: 24
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {editId ? "Edit Facility" : "Add Facility"}
          </Typography>

          <TextField
            fullWidth
            label="Facility Name"
            value={facilityName}
            onChange={(e) => setFacilityName(e.target.value)}
            sx={{ ...blueInputStyle, mb: 2 }}
          />

          <Button variant="contained" fullWidth onClick={handleSubmit}>
            {editId ? "Update" : "Save"}
          </Button>
        </Box>
      </Modal>

    </Box>

    {/* InActive Modal Pop Up */}
    {inactiveModal && (
      <Modal
        open={inactiveModal}
        onClose={() => setInactiveModal(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: 380,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 3,
            p: { xs: 2, sm: 4 },
            textAlign: "center",
            maxHeight: "90vh",
            overflowY: "auto"
          }}
        >

          {/* Alert Icon */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: "#fdecea",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2
            }}
          >
            <WarningAmberIcon sx={{ fontSize: 50, color: "#f44336" }} />
          </Box>

          {/* Title */}
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Inactivate Facility
          </Typography>

          {/* Dynamic Message */}
          <Typography sx={{ mb: 3 }}>
            Are you sure you want to inactivate the Facility:&nbsp;
            <strong> {selectedLocationName} </strong>
          </Typography>

          {/* Inactivate Button */}
          <Button
            variant="contained"
            color="error"
            fullWidth
            sx={{ mb: 1 }}
            onClick={() => {
              toggleStatus({ id: selectedLocationId, isActive: false });
              setInactiveModal(false);
            }}
          >
            Yes, Inactivate
          </Button>

          {/* Cancel Button */}
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => setInactiveModal(false)}
          >
            No
          </Button>
        </Box>
      </Modal>
    )}
    {/* Activate Modal Pop Up */}
    {activeModal && (
      <Modal
        open={activeModal}
        onClose={() => setActiveModal(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: 380,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 3,
            p: { xs: 2, sm: 4 },
            textAlign: "center",
            maxHeight: "90vh",
            overflowY: "auto"
          }}
        >

          {/* Alert Icon */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: "#e8f5e9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2
            }}
          >
            <WarningAmberIcon sx={{ fontSize: 50, color: "#4caf50" }} />
          </Box>

          {/* Title */}
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Activate Facility
          </Typography>

          {/* Dynamic Message */}
          <Typography sx={{ mb: 3 }}>
            Are you sure you want to activate the Facility:&nbsp;
            <strong> {selectedLocationName} </strong>
          </Typography>

          {/* Activate Button */}
          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{ mb: 1 }}
            onClick={() => {
              toggleStatus({ id: selectedLocationId, isActive: true });
              setActiveModal(false);
            }}
          >
            Yes, Activate
          </Button>

          {/* Cancel Button */}
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => setActiveModal(false)}
          >
            No
          </Button>
        </Box>
      </Modal>
    )}
    <Toast toast={toast} closeToast={closeToast} />
  </>
  );
};
export default FacilityMaster;