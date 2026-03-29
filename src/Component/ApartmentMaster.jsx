import { useEffect, useState } from "react";
import {
  Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Switch, Modal, Typography, MenuItem, Select, FormControl, InputLabel, TablePagination
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import { getAllApartments, addApartment, updateApartment, changeApartmentStatus, getEncryptUrl } from "../Service/apartmentmasterService.js";
import { getAllLocations } from "../Service/locationmasterService.js"
import { getAllFacility } from "../Service/facilitymasterService.js"
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import useToast from '../Common/useToast.jsx'
import Toast from '../Common/Toast.jsx'
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CircularProgress from "@mui/material/CircularProgress";
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import QRCode from "react-qr-code";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ApartmentMaster = () => {

  const [apartments, setApartments] = useState([]);
  const [locations, setLocations] = useState([]); // for add/edit options
  const [facilities, setFacilities] = useState([]);
  const [allLocations, setAllLocations] = useState([]);

  const [locationId, setLocationId] = useState("");
  const [facilityId, setFacilityId] = useState("");
  const [apartmentName, setApartmentName] = useState("");
  const [esubId, setesubId] = useState("");
  const [roomCount, setroomCount] = useState("");
  const [searchLocationId, setSearchLocationId] = useState("");
  const [searchFacilityId, setSearchFacilityId] = useState("");
  const [searchLocations, setSearchLocations] = useState([]); // for search options

  const [search, setSearch] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [editId, setEditId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [qrmodalOpen, setQRModalOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState("");


  const [statusModal, setStatusModal] = useState({ open: false, isActive: false });
  const [selectedApartmentId, setSelectedApartmentId] = useState(null);
  const [selectedApartmentName, setSelectedApartmentName] = useState("");
  const { toast, showSuccess, showError, showWarning, closeToast } = useToast();
  const [pageLoading, setPageLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();

  // Load Locations + Apartments
  const loadData = async () => {
    try {
      const facilityRes = await getAllFacility();
      setFacilities(facilityRes.data);

      const locationRes = await getAllLocations();
      setAllLocations(locationRes.data);
      setLocations(locationRes.data);       // for modal
      setSearchLocations(locationRes.data); // for search dropdown


      const apartmentRes = await getAllApartments();
      setApartments(apartmentRes.data);
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setPageLoading(true);
      await loadData();
      setPageLoading(false);
    };

    fetchAll();
  }, []);


  useEffect(() => {
    if (!facilityId) {
      setLocations(allLocations); // show all if nothing selected
      return;
    }

    const filtered = allLocations.filter(loc => loc.facilityID === facilityId);
    setLocations(filtered);
  }, [facilityId, allLocations]);

  useEffect(() => {
    if (!searchFacilityId) {
      setSearchLocations(allLocations);
      return;
    }

    const filtered = allLocations.filter(loc => loc.facilityID === searchFacilityId);
    setSearchLocations(filtered);
  }, [searchFacilityId, allLocations]);

  //Testing
  // useEffect(() => {
  //   console.log("Updated locations:", locations);
  // }, [locations]);

  // Add or Update Apartment

  const handleAdd = () => {
    setFacilityId("");
    setLocationId("");
    setApartmentName("");
    setesubId("");
    setroomCount("");
    setEditId(null);
    setModalOpen(true);
  }

  const handleSubmit = async () => {
    debugger;
    if (!facilityId) {
      showWarning("Select Facility Dropdown is required");
      return;
    }
    if (!locationId) {
      showWarning("Select Location Dropdown is required");
      return;
    }
    if (!apartmentName.trim()) {
      showWarning("Apartment name is required");
      return;
    }
    if (!String(roomCount).trim()) {
      showWarning("Room Count is required");
      return;
    }
    if (!esubId.trim()) {
      showWarning("Electrical Subscription ID is required");
      return;
    }

    const isDuplicate = apartments.some(a => {
      return (Number(a.locationId) === Number(locationId) &&
        a.apartmentName.trim().toLowerCase() === apartmentName.trim().toLowerCase())
    }
    );


    if (isDuplicate && !editId) {
      showWarning("Apartment already exists under this location");
      return;
    }

    try {
      if (editId) {
        await updateApartment(editId, locationId, apartmentName, esubId, String(roomCount));
        showSuccess("Apartment updated successfully");
      } else {
        await addApartment(locationId, apartmentName, esubId, String(roomCount));
        showSuccess("Apartment added successfully");
      }

      // Reset form
      setFacilityId("");
      setLocationId("");
      setApartmentName("");
      setroomCount("")
      setesubId("")
      setEditId(null);
      setModalOpen(false);
      loadData();

    } catch (error) {
      showError(editId ? "Failed to update Apartment" : "Failed to save Apartment");
      console.error("Failed to Save/Update Apartment:", error);
    }
  };

  // Edit
  const handleEdit = (item) => {
    setFacilityId(item.facilityId);
    setLocationId(item.locationId);
    setApartmentName(item.apartmentName);
    setroomCount(item.roomCount);
    setesubId(item.esubscriptionID)
    setEditId(item.id);
    setModalOpen(true);
  };

  // handleQR
  const handleQR = async (item) => {
    debugger
    setFacilityId(item.facilityId);
    setLocationId(item.locationId);
    setApartmentName(item.apartmentName);
    setroomCount(item.roomCount);
    setesubId(item.esubscriptionID);
    const payloadURL = {
      facid: item.facilityId,
      locid: item.locationId,
      apart: item.id
    };
    let url = await getEncryptUrl(payloadURL);
    setQrUrl(url);
    setQRModalOpen(true);
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
      await changeApartmentStatus(item.id, item.isActive);
      loadData();
    } catch (error) {
      console.error("Failed to update Apartment status:", error);
    }
  };

  // Toggle Active/Inactive Modal Popup
  const openStatusModal = (item) => {
    setSelectedApartmentId(item.id);
    setSelectedApartmentName(item.apartmentName);
    setStatusModal({
      open: true,
      isActive: item.isActive
    });
  };

  // Download QR Code

  const downloadQR = async (facId, locId, apartName) => {
    const qrElement = document.getElementById("qr-download-area");
    if (!qrElement) return;

    // Convert QR to canvas
    const canvas = await html2canvas(qrElement, { scale: 3 });
    const imgData = canvas.toDataURL("image/png");

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4"
    });

    const pageWidth = pdf.internal.pageSize.getWidth();

    // Title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(24);
    pdf.text("Room Maintenance", pageWidth / 2, 60, { align: "center" });


    // Large QR Code (centered)
    const qrSize = 350;
    const qrX = (pageWidth - qrSize) / 2;
    const qrY = 100;

    // Frame around QR
    pdf.setLineWidth(1.5);
    pdf.roundedRect(qrX - 15, qrY - 15, qrSize + 30, qrSize + 30, 12, 12);

    // Insert QR image
    pdf.addImage(imgData, "PNG", qrX, qrY, qrSize, qrSize);

    // Details below QR
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(14);

    const detailsY = qrY + qrSize + 60;

    pdf.text(`Location: ${locations.find((item) => item.id === locId)?.locationName}`, pageWidth / 2, detailsY, {
      align: "center"
    });

    pdf.text(`Apartment: ${apartName}`, pageWidth / 2, detailsY + 25, {
      align: "center"
    });

    // Caption
    pdf.setFont("helvetica", "italic");

    pdf.setFontSize(12);
    pdf.setTextColor("#555");

    pdf.text(
      "Scan the QR code to raise a Room Maintenance Request",
      pageWidth / 2,
      detailsY + 70,
      { align: "center" }
    );

    // Footer
    pdf.setFontSize(10);
    pdf.setTextColor("#999");
    pdf.text("Generated by Mouwasat Support Service", pageWidth / 2, 820, {
      align: "center"
    });

    pdf.save("RoomMaintenance_QR.pdf");
  };


  const shareQR = async () => {
    try {
      await navigator.share({
        title: "QR Code",
        text: "Scan this QR code",
        url: qrUrl
      });
    } catch (err) {
      console.log("Share failed:", err);
    }
  };

  const orangeInputStyle = {
    "& .MuiInputLabel-root": {
      color: "#ef6c00"
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#ef6c00"
    },
    "& .MuiOutlinedInput-root": {
      "& > fieldset": {
        borderColor: "#ef6c00 !important"
      },
      "&:hover > fieldset": {
        borderColor: "#ef6c00 !important"
      },
      "&.Mui-focused > fieldset": {
        borderColor: "#ef6c00 !important"
      }
    }
  };

  function GradientCircularProgress() {
    return (
      <>
        <svg width={0} height={0}>
          <defs>
            <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e01cd5" />
              <stop offset="100%" stopColor="#1CB5E0" />
            </linearGradient>
          </defs>
        </svg>

        <CircularProgress
          sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
        />
      </>
    );
  }

  if (pageLoading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f9f9f9"
        }}
      >
        <GradientCircularProgress />
      </Box>
    );
  }

  //QR Code Details
  const loc = locations.find(l => l.id === locationId);
  const AmenitiesArr = [];
  if (loc?.gym) AmenitiesArr.push("Gym");
  if (loc?.pool) AmenitiesArr.push("Pool");

  //#shahul need to check the filtering working fine
  const filtered = apartments.filter(a => {
    const matchesFacility = searchFacilityId
      ? a.facilityId === searchFacilityId
      : true;
    const matchesLocation = searchLocationId
      ? a.locationId === searchLocationId
      : true;
    const matchesSearch = a.apartmentName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      searchStatus === "Active"
        ? a.isActive === true
        : searchStatus === "Inactive"
          ? a.isActive === false
          : true;

    return matchesLocation && matchesSearch && matchesFacility && matchesStatus;
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
            color: "#ef6c00"
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
              backgroundColor: "#ef6c00",
              bottom: -6,
              left: "20%",
              borderRadius: 2
            }
          }}
        >
          Apartment Master
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
            backgroundColor: "#ef6c00",
            "&:hover": { backgroundColor: "#d55a00" }
          }}
        >
          Add Apartment
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
              {/* Empty option to clear filter */}
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

          {/* Location Dropdown */}
          <FormControl sx={{ flex: 1, ...orangeInputStyle }}>
            <InputLabel>Search Location</InputLabel>
            <Select
              value={searchLocationId}
              label="Search Location"
              onChange={(e) => setSearchLocationId(e.target.value)}
              sx={{
                "& .MuiSelect-select": {
                  padding: "10px 14px"
                }
              }}
            >
              <MenuItem value="">
                <em>All Locations</em>
              </MenuItem>

              {searchLocations.filter(l => l.isActive).map((l) => (
                <MenuItem key={l.id} value={l.id}>
                  {l.locationName}
                </MenuItem>
              ))}

            </Select>
          </FormControl>


          {/* Search Apartment */}
          <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
            <TextField
              label="Search Apartment"
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
                color: "#d55a00"
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
                <TableCell sx={{ fontWeight: "bold" }}>Apartment</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>ESubscriptionID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {(() => {


                if (filtered.length === 0) {
                  return (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3, color: "#888" }}>
                        No Record Found
                      </TableCell>
                    </TableRow>
                  );
                }

                const paginated = filtered.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                );

                return paginated.map((item, index) => {
                  const facility = facilities.find(f => f.id === item.facilityId);
                  const location = allLocations.find(f => f.id === item.locationId);
                  const hasLocation = allLocations.filter(f => f.isActive).some(f => f.id === item.locationId);
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                      {/* Facility Name */}
                      <TableCell>{facility?.facilityName || "-"}</TableCell>

                      {/* Location Name */}
                      <TableCell>{location?.locationName || "-"}</TableCell>

                      {/* Apartment Name */}
                      <TableCell>{item.apartmentName}</TableCell>

                      {/* ESubscription Name */}
                      <TableCell>{item.esubscriptionID}</TableCell>

                      {/* Status Toggle */}
                      <TableCell>
                        {hasLocation ? (
                          <Switch
                            checked={item.isActive}
                            onChange={() => openStatusModal(item)}
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "#ef6c00"
                              },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                backgroundColor: "#ef6c00"
                              }
                            }}
                          />
                        ) : (
                          <Switch disabled />
                        )}

                        {item.isActive ? "Active" : "Inactive"}
                      </TableCell>

                      <TableCell>
                        {hasLocation ? (
                          <IconButton
                            title="Edit Details"
                            onClick={() => handleEdit(item)}
                            sx={{ color: "#ef6c00" }}
                          >
                            <EditIcon />
                          </IconButton>
                        ) : (
                          <IconButton disabled>
                            <EditIcon />
                          </IconButton>
                        )}
                        {hasLocation ? (
                          <IconButton
                            title="QR Code Details"
                            onClick={() => handleQR(item)}
                            sx={{ color: "#ef6c00" }}
                          >
                            <QrCode2RoundedIcon />
                          </IconButton>
                        ) : (
                          <IconButton disabled>
                            <QrCode2RoundedIcon />
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
              {editId ? "Edit Apartment" : "Add Apartment"}
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

            {/* Location Dropdown */}
            <FormControl fullWidth sx={{ mb: 2, ...orangeInputStyle }}>
              <InputLabel>Location</InputLabel>
              <Select
                value={locationId}
                label="Location"
                onChange={(e) => setLocationId(e.target.value)}
              >
                {locations.filter(f => f.isActive).map((f) => (
                  <MenuItem key={f.id} value={f.id}>
                    {f.locationName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Apartment Name */}
            <TextField
              fullWidth
              label="Apartment Name"
              value={apartmentName}
              onChange={(e) => setApartmentName(e.target.value)}
              sx={{ mb: 2, ...orangeInputStyle }}
            />

            {/* Roomcount Dropdown */}
            <FormControl fullWidth sx={{ mb: 2, ...orangeInputStyle }}>
              <InputLabel>Room Count</InputLabel>
              <Select
                value={roomCount}
                label="Room Count"
                onChange={(e) => setroomCount(e.target.value)}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Electric Subscription ID */}
            <TextField
              fullWidth
              label="Electric Subscription ID"
              value={esubId}
              onChange={(e) => setesubId(e.target.value)}
              sx={{ mb: 2, ...orangeInputStyle }}
            />

            <Button variant="contained" fullWidth onClick={handleSubmit} sx={{
              backgroundColor: "#ef6c00", "&:hover": { backgroundColor: "#d55a00" }
            }}>
              {editId ? "Update" : "Save"}
            </Button>

          </Box>
        </Modal>

        {/* QR Modal */}
        <Modal open={qrmodalOpen} onClose={() => setQRModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              bgcolor: "background.paper",
              p: 4,
              borderRadius: 3,
              boxShadow: 24,
              display: "flex",
              gap: 3
            }}
          >
            {/* LEFT SIDE — DETAILS */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: "#ef6c00" }}>
                Apartment Details
              </Typography>

              <Box sx={{ lineHeight: 2 }}>
                <Typography><strong>Facility:</strong>{" "}{facilityId ? facilities.find(f => f.id === facilityId)?.facilityName : ""}</Typography>
                <Typography><strong>Location:</strong>{" "}{locationId ? locations.find(l => l.id === locationId)?.locationName : ""}</Typography>
                <Typography><strong>Apartment:</strong> {apartmentName}</Typography>
                <Typography><strong>ESubscriptionID:</strong> {esubId}</Typography>
                <Typography><strong>Room Count:</strong> {roomCount}</Typography>
                {AmenitiesArr.length > 0 &&
                  <Typography>
                    <strong>Amenities:</strong> {AmenitiesArr.join(", ")}
                  </Typography>
                }
              </Box>
            </Box>

            {/* VERTICAL DIVIDER */}
            <Divider orientation="vertical" flexItem />

            {/* RIGHT SIDE — QR CODE */}
            <Box sx={{ flex: 1, textAlign: "center" }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: "#ef6c00" }}>
                QR Code
              </Typography>

              {/* QR IMAGE BOX */}
              <Box
                id="qr-download-area"
                sx={{
                  width: 180,
                  height: 180,
                  mx: "auto",
                  border: "2px solid #ddd",
                  borderRadius: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 3,
                  p: 1
                }}
              >
                {/* Replace with your QR image */}
                <QRCode style={{ width: "100%", height: "100%" }} value={qrUrl} />
              </Box>

              {/* ACTION BUTTONS */}
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button variant="contained" sx={{
                  mb: 3,
                  backgroundColor: "#ef6c00",
                  "&:hover": { backgroundColor: "#d55a00" }
                }} onClick={() => downloadQR(facilityId, locationId, apartmentName)}>
                  Download
                </Button>
                <Button onClick={shareQR} variant="outlined" color="#d55a00" sx={{ color: "#ef6c00" }}>
                  Share
                </Button>
              </Stack>
            </Box>
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
              {statusModal.isActive ? "Inactivate Apartment" : "Activate Apartment"}
            </Typography>

            {/* Message */}
            <Typography sx={{ mb: 3 }}>
              Are you sure you want to{" "}
              <strong>{statusModal.isActive ? "inactivate" : "activate"}</strong>{" "}
              the Apartment: <strong>{selectedApartmentName}</strong>?
            </Typography>

            {/* Confirm Button */}
            <Button
              variant="contained"
              fullWidth
              sx={{ mb: 1 }}
              color={statusModal.isActive ? "error" : "success"}
              onClick={() => {
                toggleStatus({
                  id: selectedApartmentId,
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

export default ApartmentMaster;