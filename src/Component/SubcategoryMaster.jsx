import React, { useEffect, useState } from "react";
import {
  Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  Paper, IconButton, Switch, Modal, Typography, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import { getAllSubcategories, addSubcategory, updateSubcategory, changeSubcategoryStatus } from "../Service/subcategorymasterService.js";
import { getAllCategory } from "../Service/categorymasterService.js";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import useToast from '../Common/useToast.jsx'
import Toast from '../Common/Toast.jsx'
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
const SubcategoryMaster = () => {

  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);

  const [categoryId, setCategoryId] = useState("");
  const [searchCategoryId, setSearchCategoryId] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [subCategoryName, setSubcategoryName] = useState("");

  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [statusModal, setStatusModal] = useState({ open: false, isActive: false });
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const [selectedSubcategoryName, setSelectedSubcategoryName] = useState("");
  const { toast, showSuccess, showError, showWarning, closeToast } = useToast();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const navigate = useNavigate();
  // Load Categories + Subcategories
  const loadData = async () => {
    try {
      const categoryRes = await getAllCategory();
      //only active categories
      setCategories(categoryRes.data);
      const subcategoryRes = await getAllSubcategories();
      debugger;
      setSubcategories(subcategoryRes.data);
    } catch (err) {
      console.error("Failed to load categories and Subcategory:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  //Testing
  // useEffect(() => {
  //   console.log("Updated categories:", categories);
  // }, [categories]);

  // Add or Update Subcategory

  const handleAdd = () => {
    setCategoryId("");
    setSubcategoryName("");
    setEditId(null);
    setModalOpen(true);
  }

  const handleSubmit = async () => {
    debugger;
    if (!categoryId || !subCategoryName.trim()) {
      showWarning("Select Category Dropdown/Subcategory name is required");
      return;
    }

    // Duplicate check: same Category + same SubCategory name
    const isDuplicate = subcategories.some(a =>
      a.categoryID === categoryId &&
      a.subCategoryName.toLowerCase() === subCategoryName.toLowerCase()
    );

    if (isDuplicate) {
      showWarning("Subcategory name already exists under this facility");
      return;
    }

    try {
      if (editId) {
        await updateSubcategory(editId, categoryId, subCategoryName)
        showSuccess("Subcategory updated successfully");
      }
      else {
        await addSubcategory(categoryId, subCategoryName)
        showSuccess("Subcategory added successfully");
      }

      setCategoryId("");
      setSubcategoryName("");
      setEditId(null);
      setModalOpen(false);
      loadData();
    } catch (error) {
      if (editId)
        showError("Failed to update Subcategory");
      else
        showError("Failed to save Subcategory");
      console.error("Failed to Save/Update Subcategory:", error);
    }
  };

  // Edit
  const handleEdit = (item) => {
    setCategoryId(item.categoryID);
    setSubcategoryName(item.subCategoryName);
    setEditId(item.id);
    setModalOpen(true);
  };

  // Toggle Status
  const toggleStatus = async (item) => {
    try {
      debugger;
      await changeSubcategoryStatus(item.id, item.isActive);
      loadData();
    } catch (error) {
      console.error("Failed to update Subcategory status:", error);
    }
  };

  // Toggle Active/Inactive Modal Popup
  const openStatusModal = (item) => {
    setSelectedSubcategoryId(item.id);
    setSelectedSubcategoryName(item.subCategoryName);
    setStatusModal({
      open: true,
      isActive: item.isActive
    });
  };

  const orangeInputStyle = {
    "& .MuiInputLabel-root": {
      color: "#8e24aa"
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#8e24aa"
    },
    "& .MuiOutlinedInput-root": {
      "& > fieldset": {
        borderColor: "#8e24aa !important"
      },
      "&:hover > fieldset": {
        borderColor: "#8e24aa !important"
      },
      "&.Mui-focused > fieldset": {
        borderColor: "#8e24aa !important"
      }
    }
  };

  const filtered = subcategories.filter(s => {
    const matchesCategory = searchCategoryId
      ? s.categoryID === searchCategoryId
      : true;

    const matchesSearch = s.subCategoryName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      searchStatus === "Active"
        ? s.isActive === true
        : searchStatus === "Inactive"
          ? s.isActive === false
          : true;

    return matchesCategory && matchesSearch && matchesStatus;
  });


  return (
    <>
      {/* Page Header */}
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
            color: "#8e24aa"
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
              backgroundColor: "#8e24aa",
              bottom: -6,
              left: "20%",
              borderRadius: 2
            }
          }}
        >
          SubCategory Master
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
            backgroundColor: "#8e24aa",
            "&:hover": { backgroundColor: "#850ba7" }
          }}
        >
          Add Subcategory
        </Button>

        {/* Search */}
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

          {/* Category Dropdown */}
          <FormControl sx={{ flex: 1, ...orangeInputStyle }}>
            <InputLabel>Search Category</InputLabel>
            <Select
              value={searchCategoryId}
              label="Search Category"
              onChange={(e) => setSearchCategoryId(e.target.value)}
              sx={{
                "& .MuiSelect-select": {
                  padding: "10px 14px"   // match TextField small padding
                }
              }}
            >
              {/* Empty option to clear filter */}
              <MenuItem value="">
                <em>All Categories</em>
              </MenuItem>

              {categories.filter(f => f.isActive).map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>



          {/* Search Subcategory */}
          <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
            <TextField
              label="Search Subcategory"
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
                color: "#850ba7"   // your purple icon color
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
                <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Subcategory</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {(() => {
                // Normalize subcategory name property
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
                  const category = categories.find(f => f.id === item.categoryID);
                  const hasCategory = categories.filter(f => f.isActive).some(f => f.id === item.categoryID);
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                      {/* Category Name */}
                      <TableCell>{category?.categoryName || "-"}</TableCell>

                      {/* Subcategory Name */}
                      <TableCell>{item.subCategoryName}</TableCell>

                      {/* Status Toggle */}
                      <TableCell>
                        {hasCategory ? (
                          <Switch
                            checked={item.isActive}
                            onChange={() => openStatusModal(item)}
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "#8e24aa"
                              },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                backgroundColor: "#8e24aa"
                              }
                            }}
                          />
                        ) : (
                          <Switch disabled />
                        )}

                        {item.isActive ? "Active" : "Inactive"}
                      </TableCell>

                      <TableCell>
                        {hasCategory ? (
                          <IconButton
                            onClick={() => handleEdit(item)}
                            sx={{ color: "#8e24aa" }}
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
              {editId ? "Edit Subcategory" : "Add Subcategory"}
            </Typography>

            {/* Category Dropdown */}
            <FormControl fullWidth sx={{ mb: 2, ...orangeInputStyle }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryId}
                label="Category"
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {categories.filter(f => f.isActive).map((f) => (
                  <MenuItem key={f.id} value={f.id}>
                    {f.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Subcategory Name */}
            <TextField
              fullWidth
              label="Subcategory Name"
              value={subCategoryName}
              onChange={(e) => setSubcategoryName(e.target.value)}
              sx={{ mb: 2, ...orangeInputStyle }}
            />

            <Button variant="contained" fullWidth onClick={handleSubmit} sx={{
              backgroundColor: "#8e24aa", "&:hover": { backgroundColor: "#850ba7" }
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
              {statusModal.isActive ? "Inactivate Subcategory" : "Activate Subcategory"}
            </Typography>

            {/* Message */}
            <Typography sx={{ mb: 3 }}>
              Are you sure you want to{" "}
              <strong>{statusModal.isActive ? "inactivate" : "activate"}</strong>{" "}
              the Subcategory: <strong>{selectedSubcategoryName}</strong>?
            </Typography>

            {/* Confirm Button */}
            <Button
              variant="contained"
              fullWidth
              sx={{ mb: 1 }}
              color={statusModal.isActive ? "error" : "success"}
              onClick={() => {
                toggleStatus({
                  id: selectedSubcategoryId,
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

export default SubcategoryMaster;