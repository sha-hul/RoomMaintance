import React, { useEffect, useState } from "react";
import {
  Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, FormControl, InputLabel, Select,
  Paper, IconButton, Switch, Modal, Typography, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { getAllCategory, updateCategory, addCategory, changeCategoryStatus } from "../Service/categorymasterService.js"
import useToast from '../Common/useToast.jsx'
import Toast from '../Common/Toast.jsx'
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const CategoryMaster = (empId) => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [search, setSearch] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [editId, setEditId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [inactiveModal, setInactiveModal] = useState(false);
  const [activeModal, setActiveModal] = useState(false);
  const [selectedLocationName, setSelectedLocationName] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const { toast, showSuccess, showError, showWarning, closeToast } = useToast();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  // Load all categories
  const loadCategories = async () => {
    try {
      const res = await getAllCategory();
      setCategories(res.data);
    }
    catch (err) {
      console.error("loadCategories - error occurred:", err);
       navigate("/error");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Add or Update Category
  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      showWarning("Category name is required");
      return;
    }
    if (categories.some(f => f.categoryName.toLowerCase() === categoryName.toLowerCase())) {
      showWarning("Category already exisit");
      return;
    }
    try {
      if (editId) {
        await updateCategory(editId, categoryName);
        showSuccess("Category updated successfully");
      }
      else {
        await addCategory(categoryName);
        showSuccess("Category added successfully");
      }
      setCategoryName("");
      setEditId(null);
      setModalOpen(false);
      loadCategories();
    } catch (error) {
      if (editId)
        showError("Category to update facility");
      else
        showError("Category to save facility");
      console.error("Failed to Save/Update category:", error);
    }
  };

  // Edit Category
  const handleEdit = (item) => {
    setCategoryName(item.categoryName);
    setEditId(item.id);
    setModalOpen(true);
  };

  // Toggle Active/Inactive
  const toggleStatus = async (item) => {
    try {
      await changeCategoryStatus(item.id, item.isActive);
      loadCategories();
    } catch (error) {
      console.error("toggleStatus - error occurred:", error);
      navigate("/error");
    }
  };

  // Toggle Active/Inactive Modal Popup
  const openStatusModal = (item) => {
    setSelectedLocationId(item.id)
    setSelectedLocationName(item.categoryName)
    item.isActive ? setInactiveModal(true) : setActiveModal(true);
  }

  //Add Category Button
  const handleAddCategory = () => {
    setEditId(null)
    setCategoryName("")
    setModalOpen(true)
  }
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const greenInputStyle = {
    "& .MuiInputLabel-root": {
      color: "#2e7d32"
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#2e7d32"
    },
    "& .MuiOutlinedInput-root": {
      "& > fieldset": {
        borderColor: "#2e7d32 !important"
      },
      "&:hover > fieldset": {
        borderColor: "#2e7d32 !important"
      },
      "&.Mui-focused > fieldset": {
        borderColor: "#2e7d32 !important"
      }
    }
  };

  const filtered = categories
    .filter(c => c && typeof c.categoryName === "string")
    .filter(c => {
      const matchesSearch = c.categoryName
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        searchStatus === "Active"
          ? c.isActive === true
          : searchStatus === "Inactive"
            ? c.isActive === false
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
          color: "#2e7d32"
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
            backgroundColor: "#2e7d32",
            bottom: -6,
            left: "20%",
            borderRadius: 2
          }
        }}
      >
        Category Master
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
        onClick={handleAddCategory}
        sx={{
          mb: 3,
          backgroundColor: "#2e7d32",
          "&:hover": { backgroundColor: "#2e7d32" }
        }}
      >
        Add Category
      </Button>

      {/* Search + Status Filter */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>

        {/* Status Dropdown */}
        <FormControl size="small" sx={{ width: 200, ...greenInputStyle }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={searchStatus}
            label="Status"
            onChange={(e) => setSearchStatus(e.target.value)}
            sx={{
              "& .MuiSelect-select": {
                padding: "10px 14px"
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
          label="Search Category"
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ ...greenInputStyle }}
        />

        <SearchIcon sx={{ color: "#2e7d32", mt: "4px" }} />
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table >
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>S.No</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
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
                  <TableCell>{item.categoryName}</TableCell>
                  <TableCell>
                    <Switch
                      checked={item.isActive}
                      onChange={() => openStatusModal(item)}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#2e7d32"
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                          backgroundColor: "#2e7d32"
                        }
                      }}
                    />
                    {item.isActive ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell>
                    <IconButton sx={{ color: "#2e7d32" }} onClick={() => handleEdit(item)}>
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
            {editId ? "Edit Category" : "Add Category"}
          </Typography>

          <TextField
            fullWidth
            label="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            sx={{ ...greenInputStyle, mb: 2 }}
          />

          <Button variant="contained" fullWidth onClick={handleSubmit} sx={{
            backgroundColor: "#2e7d32", "&:hover": { backgroundColor: "#2e7d32" }
          }} >
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
            Inactivate Category
          </Typography>

          {/* Dynamic Message */}
          <Typography sx={{ mb: 3 }}>
            Are you sure you want to inactivate the Category:&nbsp;
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
            Activate Category
          </Typography>

          {/* Dynamic Message */}
          <Typography sx={{ mb: 3 }}>
            Are you sure you want to activate the Category:&nbsp;
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
export default CategoryMaster;