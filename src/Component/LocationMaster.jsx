import React, { useEffect, useState } from "react";
import {
  Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Switch, Modal, Typography, MenuItem, Select, FormControl, InputLabel, TablePagination
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import { getAllLocations, addLocation, updateLocation, changeLocationStatus } from "../Service/locationmasterService.js";
import { getAllFacility } from "../Service/facilitymasterService.js"
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import useToast from '../Common/useToast.jsx';
import Toast from '../Common/Toast.jsx';
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

const LocationMaster = () => {

  const [locations, setLocations] = useState([]);
  const [facilities, setFacilities] = useState([]);

  const [facilityId, setFacilityId] = useState("");
  const [searchFacilityId, setSearchFacilityId] = useState("");
  const [locationName, setLocationName] = useState("");
  const [gym, setGym] = useState(false);
  const [pool, setPool] = useState(false);

  const [search, setSearch] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [editId, setEditId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [statusModal, setStatusModal] = useState({ open: false, isActive: false });
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [selectedLocationName, setSelectedLocationName] = useState("");
  const { toast, showSuccess, showError, showWarning, closeToast } = useToast();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();

  // Load Facilities + Locations
  const loadData = async () => {
    try {
      const facilityRes = await getAllFacility();
      setFacilities(facilityRes.data);
      const locationRes = await getAllLocations();
      setLocations(locationRes.data);
    } 
    catch (err) {
      console.error("loadData - error occurred:", err);
      navigate("/error");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Add or Update Location

  const handleAdd = () => {
    setFacilityId("");
    setLocationName("");
    setEditId(null);
    setModalOpen(true);
    setGym(false);
    setPool(false);
  }

  const handleSubmit = async () => {
    if (!facilityId || !locationName.trim()) {
      showWarning("Select Facility Dropdown/Location name is required");
      return;
    }

    // Duplicate check: same facility + same location name
    const isDuplicate = locations.some(a =>
      a.facilityID === facilityId &&
      a.locationName.toLowerCase() === locationName.toLowerCase()
      // && a.id !== editId // allow same name when editing same record
    );

    if (isDuplicate && !editId) {
      showWarning("Location name already exists under this facility");
      return;
    }

    try {
      if (editId) {
        await updateLocation(editId, facilityId, locationName, gym, pool);
        showSuccess("Location updated successfully");
      } else {
        await addLocation(facilityId, locationName, gym, pool);
        showSuccess("Location added successfully");
      }

      setFacilityId("");
      setLocationName("");
      setEditId(null);
      setModalOpen(false);
      setGym(false);
      setPool(false);
      loadData();

    } catch (error) {
      if (editId)
        showError("Failed to update Location");
      else
        showError("Failed to save Location");
      console.error("Failed to Save/Update Location:", error);
    }
  };

  // Edit
  const handleEdit = (item) => {
    debugger;
    setFacilityId(item.facilityID);
    setLocationName(item.locationName);
    setEditId(item.id);
    setGym(item.gym);
    setPool(item.pool);
    setModalOpen(true);
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Toggle Status
  const toggleStatus = async (item) => {
    try {
      debugger;
      await changeLocationStatus(item.id, item.isActive);
      loadData();
    } catch (error) {
      console.error("toggleStatus - error occurred:", error);
      navigate("/error");
    }
  };

  // Toggle Active/Inactive Modal Popup
  const openStatusModal = (item) => {
    setSelectedLocationId(item.id);
    setSelectedLocationName(item.locationName);
    setStatusModal({
      open: true,
      isActive: item.isActive
    });
  };

  const orangeInputStyle = {
    "& .MuiInputLabel-root": {
      color: "#d81b60"
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#d81b60"
    },
    "& .MuiOutlinedInput-root": {
      "& > fieldset": {
        borderColor: "#d81b60 !important"
      },
      "&:hover > fieldset": {
        borderColor: "#d81b60 !important"
      },
      "&.Mui-focused > fieldset": {
        borderColor: "#d81b60 !important"
      }
    }
  };

  const filtered = locations.filter(a => {
    const matchesFacility = searchFacilityId
      ? a.facilityID === searchFacilityId
      : true;

    const matchesSearch = a.locationName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      searchStatus === "Active"
        ? a.isActive === true
        : searchStatus === "Inactive"
          ? a.isActive === false
          : true;

    return matchesFacility && matchesSearch && matchesStatus;
  });

  return (
    <>
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
            color: "#d81b60"
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
              backgroundColor: "#d81b60",
              bottom: -6,
              left: "20%",
              borderRadius: 2
            }
          }}
        >
          Location Master
        </Typography>
      </Box>

      <Box sx={{ p: 3, mx: 3, mb: 6, mt: 2 }}>
        {/* Add Button */}
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={handleAdd}
          sx={{
            mb: 3,
            backgroundColor: "#d81b60",
            "&:hover": { backgroundColor: "#81123b" }
          }}
        >
          Add Location
        </Button>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 3
          }}
        >

          {/* Status Dropdown */}
          <FormControl size="small" sx={{ width: 200, ...orangeInputStyle }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={searchStatus}
              label="Search Status"
              onChange={(e) => setSearchStatus(e.target.value)}
              sx={{
                "& .MuiSelect-select": {
                  padding: "10px 14px"   // match TextField small padding
                }
              }}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              <MenuItem value="Active">
                Active
              </MenuItem>
              <MenuItem value="Inactive">
                Inactive
              </MenuItem>
            </Select>
          </FormControl>

          {/* Facility Dropdown */}
          <FormControl sx={{ flex: 1, ...orangeInputStyle }}>
            <InputLabel>Search Facility</InputLabel>
            <Select
              value={searchFacilityId}
              label="Search Facility"
              onChange={(e) => setSearchFacilityId(e.target.value)}
              sx={{
                "& .MuiSelect-select": {
                  padding: "10px 14px"
                }
              }}
            >
              <MenuItem value="">
                <em>All Facilities</em>
              </MenuItem>

              {facilities.filter(f => f.isActive).map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {f.facilityName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>


          {/* Search Location */}
          <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
            <TextField
              label="Search Location"
              variant="outlined"
              size="small"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ ...orangeInputStyle }}
            />

            <SearchIcon
              sx={{
                ml: 1,
                color: "#81123b"
              }}
            />
          </Box>

        </Box>



        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: "#f5f5f5" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>S.No</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Facility</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
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
                      <TableCell colSpan={5} align="center" sx={{ py: 3, color: "#888" }}>
                        No Record Found
                      </TableCell>
                    </TableRow>
                  );
                }

                return paginated.map((item, index) => {
                  const facility = facilities.find(f => f.id === item.facilityID);
                  const hasFacility = facilities.filter(f => f.isActive).some(f => f.id === item.facilityID);
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                      {/* Facility Name */}
                      <TableCell>{facility?.facilityName || "-"}</TableCell>

                      {/* Location Name */}
                      <TableCell>{item.locationName}</TableCell>

                      {/* Status Toggle */}
                      <TableCell>
                        {hasFacility ? (
                          <Switch
                            checked={item.isActive}
                            onChange={() => openStatusModal(item)}
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "#d81b60"
                              },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                backgroundColor: "#d81b60"
                              }
                            }}
                          />
                        ) : (
                          <Switch disabled />
                        )}

                        {item.isActive ? "Active" : "Inactive"}
                      </TableCell>

                      <TableCell>
                        {hasFacility ? (
                          <IconButton
                            onClick={() => handleEdit(item)}
                            sx={{ color: "#d81b60" }}
                          >
                            <EditIcon />
                          </IconButton>
                        ) : (
                          <IconButton disabled>
                            <EditIcon />
                          </IconButton>
                        )}
                      </TableCell>

                    </TableRow>
                  );
                });
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
              {editId ? "Edit Location" : "Add Location"}
            </Typography>

            {/* Facility Dropdown */}
            <FormControl fullWidth sx={{ mb: 2, ...orangeInputStyle }}>
              <InputLabel>Facility</InputLabel>
              <Select
                value={facilityId}
                label="Facility"
                onChange={(e) => setFacilityId(e.target.value)}
              >
                {facilities.filter(f => f.isActive).map((f) => (
                  <MenuItem key={f.id} value={f.id}>
                    {f.facilityName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Location Name */}
            <TextField
              fullWidth
              label="Location Name"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              sx={{ mb: 2, ...orangeInputStyle }}
            />
            <FormControl component="fieldset">
              <Typography sx={{ color: "#d81b60", fontWeight: 600 }}>
                Amenities
              </Typography>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{
                        ...orangeInputStyle,
                        "&.Mui-checked": {
                          color: "#d81b60"
                        }
                      }}
                      checked={gym}
                      onChange={(e) => setGym(e.target.checked)}
                    />
                  }
                  sx={{ color: "#d81b60" }}
                  label="Gym"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{
                        ...orangeInputStyle,
                        "&.Mui-checked": {
                          color: "#d81b60"
                        }
                      }}
                      checked={pool}
                      onChange={(e) => setPool(e.target.checked)}
                    />
                  }
                  sx={{ color: "#d81b60" }}
                  label="Pool"
                />
              </FormGroup>
            </FormControl>

            <Button variant="contained" fullWidth onClick={handleSubmit} sx={{
              backgroundColor: "#d81b60", "&:hover": { backgroundColor: "#81123b" }
            }}>
              {editId ? "Update" : "Save"}
            </Button>

          </Box>
        </Modal>
      </Box>

      {statusModal.open && (
        <Modal
          open={statusModal.open}
          onClose={() => setStatusModal({ ...statusModal, open: false })}
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
            {/* Icon */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: statusModal.isActive ? "#fdecea" : "#e8f5e9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2
              }}
            >
              <WarningAmberIcon
                sx={{
                  fontSize: 50,
                  color: statusModal.isActive ? "#f44336" : "#4caf50"
                }}
              />
            </Box>

            {/* Title */}
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              {statusModal.isActive ? "Inactivate Location" : "Activate Location"}
            </Typography>

            {/* Message */}
            <Typography sx={{ mb: 3 }}>
              Are you sure you want to{" "}
              <strong>{statusModal.isActive ? "inactivate" : "activate"}</strong>{" "}
              the Location: <strong>{selectedLocationName}</strong>?
            </Typography>

            {/* Confirm Button */}
            <Button
              variant="contained"
              fullWidth
              sx={{ mb: 1 }}
              color={statusModal.isActive ? "error" : "success"}
              onClick={() => {
                toggleStatus({
                  id: selectedLocationId,
                  isActive: !statusModal.isActive
                });
                setStatusModal({ ...statusModal, open: false });
              }}
            >
              Yes, {statusModal.isActive ? "Inactivate" : "Activate"}
            </Button>

            {/* Cancel Button */}
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => setStatusModal({ ...statusModal, open: false })}
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

export default LocationMaster;