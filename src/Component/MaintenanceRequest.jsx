import { useEffect, useState, useRef } from "react";
import {
    getFacilities,
    getLocationsByFacility,
    getApartmentsByLocation,
    getCategories,
    getSubCategoriesByCategory,
    submitMaintenanceRequest
} from "../Service/maintenanceService";
import "../Style/style.css"
import { Modal, Box, Typography, Button } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useNavigate } from "react-router-dom";

const MaintenanceRequest = ({ contactNo }) => {
    const [form, setForm] = useState({
        facility: "",
        location: "",
        apartment: "",
        category: "",
        subCategory: "",
        description: "",
        attachment: null,
        employeeName: "",
        contactNo,
        updatedBy: "admin",
        empId: "",
    }
    );

    const [facilities, setFacilities] = useState([]);
    const [locations, setLocations] = useState([]);
    const [apartments, setApartments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    const [validateModal, setValidateModal] = useState({ show: false, value: [] });
    const [showModal, setShowModal] = useState(false);
    const [cancelModal, setCancelModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);

    const navigate = useNavigate();

    //Onload
    useEffect(() => {
        debugger;
        const user = JSON.parse(sessionStorage.getItem("user"));
        setForm(prev => ({
            ...prev,
            employeeName: user.name,
            empId: user.empId
        }));
        const fetchDropdowns = async () => {
            try {
                const resFac = await getFacilities();
                setFacilities(resFac.data);

                const resCat = await getCategories();
                setCategories(resCat.data);
            } catch (error) {
                console.error("Error fetching dropdowns:", error);
            }
        };

        fetchDropdowns();

    }, []);

    // Fetch locations when facility changes
    useEffect(() => {

        setForm(prev => ({
            ...prev,
            location: ""
        }));

        if (form.facility === 0 || form.facility === "") {
            setLocations([]);
            return;
        }

        const fetchLocations = async () => {
            try {
                const resApart = await getLocationsByFacility(form.facility);
                console.log(resApart.data);
                setLocations(resApart.data);
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
        };

        fetchLocations();
    }, [form.facility]);

    // Fetch Apartments when location changes
    useEffect(() => {
        debugger;
        setForm(prev => ({
            ...prev,
            apartment: ""
        }));

        if (form.location === 0 || form.location === "") {
            setApartments([]);
            return;
        }

        const fetchApartments = async () => {
            try {
                const resApart = await getApartmentsByLocation(form.location);
                console.log(resApart.data);
                setApartments(resApart.data);
            } catch (error) {
                console.error("Error fetching apartments:", error);
            }
        };

        fetchApartments();
    }, [form.location]);


    useEffect(() => {
        setForm(prev => ({
            ...prev,
            subCategory: ""
        }));

        if (!form.category || form.category === 0) {
            setSubCategories([]);
            return;
        }

        const fetchSubCategories = async () => {
            try {
                const res = await getSubCategoriesByCategory(form.category);
                setSubCategories(res.data);
            } catch (error) {
                console.error("Error fetching subcategories:", error);
            }
        };

        fetchSubCategories();
    }, [form.category]);


    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm({
            ...form,
            [name]: files ? files[0] : value
        });
    };

    const validateForm = () => {
        const valArr = [];

        if (!form.facility || form.facility === 0) valArr.push("Facility");
        if (!form.location) valArr.push("Location");
        if (!form.apartment) valArr.push("Flat Room Number");
        if (!form.category || form.category === 0) valArr.push("Category");
        if (!form.subCategory) valArr.push("Sub Category");
        if (!form.description) valArr.push("Description");
        if (form.description && form.description.length <= 5)
            valArr.push("Description should be more than 5 characters");

        if (valArr.length === 0) {
            return true;
        }

        setValidateModal({ show: true, value: valArr });
        return false;
    };


    const handleSubmit = () => {
        if (!validateForm()) return;
        setShowModal(true);
    };

    const isSubmitting = useRef(false);

    const confirmSubmit = async () => {
        debugger;
        if (isSubmitting.current) return;
        isSubmitting.current = true;

        try {
            const { attachment, ...rest } = form;

            const payload = {
                ...rest,
                facility: Number(form.facility),
                location: Number(form.location),
                apartment: Number(form.apartment),
                category: Number(form.category),
                subCategory: Number(form.subCategory),
            };
            const response = await submitMaintenanceRequest(payload, form.attachment);

            if (!response.data.status) {
                throw new Error(response.data.message || "Request failed");
            }

            setShowModal(false);
            setSuccessModal(true);

            setTimeout(() => {
                navigate("/admindashboard");
            }, 2000);

        } catch (error) {
            //need to log error here
            alert("Error submitting request");
        } finally {
            isSubmitting.current = false;
        }
    };


    return (
        <div className="container mt-4 mb-5">

            <h4 className="mb-3" >Maintenance Request</h4>

            <div className="row g-3">

                {/* Facility */}
                <div className="col-md-6">
                    <label className="form-label">Facility <span style={{ "color": "red" }}>*</span></label>
                    <select
                        className="form-select "
                        name="facility"
                        value={form.facility}
                        onChange={handleChange}
                    >
                        <option value={0}>Select Facility</option>
                        {Array.isArray(facilities) &&
                            facilities.map(f => (
                                <option key={f.id} value={f.id}>{f.name}</option>
                            ))}
                    </select>
                </div>

                {/* Location */}
                <div className="col-md-6">
                    <label className="form-label">Location <span style={{ "color": "red" }}>*</span></label>
                    <select
                        className="form-select "
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                    >
                        <option value="">Select Location</option>
                        {locations.map((a) => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                    </select>
                </div>

                {/* Room No */}
                <div className="col-md-6">
                    <label className="form-label">Flat Room No <span style={{ "color": "red" }}>*</span></label>
                    <select
                        className="form-select "
                        name="apartment"
                        value={form.apartment}
                        onChange={handleChange}
                    >
                        <option value="">Select Apartment</option>
                        {apartments.map((a) => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                    </select>
                </div>

                {/* Category */}
                <div className="col-md-6">
                    <label className="form-label">Category <span style={{ "color": "red" }}>*</span></label>
                    <select
                        className="form-select "
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                    >
                        <option value={0}>Select Category</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {/* SubCategory */}
                <div className="col-md-6">
                    <label className="form-label">Sub Category <span style={{ "color": "red" }}>*</span></label>
                    <select
                        className="form-select "
                        name="subCategory"
                        value={form.subCategory}
                        onChange={handleChange}
                    >
                        <option value="">Select Sub Category</option>
                        {subCategories.map((sc) => (
                            <option key={sc.id} value={sc.id}>{sc.name}</option>
                        ))}
                    </select>
                </div>

                {/* Description */}
                <div className="col-md-12">
                    <label className="form-label">Issue Description <span style={{ "color": "red" }}>*</span></label>
                    <textarea
                        className="form-control"
                        name="description"
                        rows="3"
                        value={form.description}
                        onChange={handleChange}
                    ></textarea>
                </div>

                {/* Attachment */}
                <div className="col-md-12">
                    <label className="form-label">Attachment (optional)</label>
                    <input
                        type="file"
                        className="form-control"
                        name="attachment"
                        onChange={handleChange}
                    />
                </div>

                {/* Employee Name */}
                <div className="col-md-6">
                    <label className="form-label">Employee Name <span style={{ "color": "red" }}>*</span></label>
                    <input
                        type="text"
                        className="form-control"
                        value={form.employeeName}
                        disabled
                    />
                </div>

                {/* Contact No */}
                <div className="col-md-6">
                    <label className="form-label">Contact No <span style={{ "color": "red" }}>*</span></label>
                    <input
                        type="text"
                        className="form-control"
                        value={contactNo}
                        disabled
                    />
                </div>

            </div>

            {/* Buttons */}
            <div className="mt-4 d-flex gap-3">
                <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                <button className="btn btn-secondary" onClick={() => setCancelModal(true)}>Cancel</button>
            </div>

            {/* Submit Confirmation Modal */}
            {showModal && (
                <Modal
                    open={showModal}
                    onClose={() => setShowModal(false)}
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

                        <CheckCircleIcon sx={{ fontSize: 60, color: "#4caf50", mb: 1 }} />

                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                            Confirm Submission
                        </Typography>

                        <Typography sx={{ mb: 3 }}>
                            Are you sure you want to submit this request?
                        </Typography>

                        <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            sx={{ mb: 1 }}
                            onClick={confirmSubmit}
                        >
                            Yes, Submit
                        </Button>

                        <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            onClick={() => setShowModal(false)}
                        >
                            No
                        </Button>
                    </Box>
                </Modal>
            )}

            {/* Success Animation */}
            {successModal && (
                <Modal
                    open={successModal}
                    onClose={() => setSuccessModal(false)}
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
                            p: { xs: 3, sm: 4 },
                            textAlign: "center",
                            maxHeight: "90vh",
                            overflowY: "auto"
                        }}
                    >
                        <CheckCircleIcon
                            sx={{
                                fontSize: 80,
                                color: "#4caf50",
                                mb: 2,
                                animation: "pop 0.4s ease-out"
                            }}
                        />

                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                            Request Raised Successfully
                        </Typography>

                        <Typography sx={{ color: "gray" }}>
                            Redirecting to Dashboard...
                        </Typography>
                    </Box>
                </Modal>
            )}

            {/* Cancel Confirmation Modal */}
            {cancelModal && (
                <Modal
                    open={cancelModal}
                    onClose={() => setCancelModal(false)}
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


                        <HighlightOffIcon sx={{ fontSize: 60, color: "#f44336", mb: 1 }} />

                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                            Cancel Request
                        </Typography>

                        <Typography sx={{ mb: 3 }}>
                            Are you sure you want to cancel?
                        </Typography>

                        <Button
                            variant="contained"
                            color="error"
                            fullWidth
                            sx={{ mb: 1 }}
                            onClick={() => {
                                setCancelModal(false)
                                navigate("/empdashboard")
                            }}
                        >
                            Yes, Cancel
                        </Button>

                        <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            onClick={() => setCancelModal(false)}
                        >
                            No
                        </Button>
                    </Box>
                </Modal>
            )}

            {/* Validation Alert Modal */}
            {validateModal.show && (
                <Modal
                    open={validateModal.show}
                    onClose={() => setValidateModal({ show: false, value: [] })}
                    aria-labelledby="validation-modal-title"
                    aria-describedby="validation-modal-description"
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

                        <WarningAmberIcon sx={{ fontSize: 60, color: "#f44336", mb: 1 }} />

                        <Typography id="validation-modal-title" variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                            Validation Required
                        </Typography>

                        <Typography id="validation-modal-description" sx={{ mb: 2 }}>
                            Please fill the following fields:
                        </Typography>

                        <Box component="ul" sx={{ textAlign: "left", mb: 2 }}>
                            {validateModal.value.map((val, index) => (
                                <li key={index} style={{ marginBottom: "4px" }}>
                                    {val}
                                </li>
                            ))}
                        </Box>

                        <Button
                            variant="contained"
                            color="error"
                            fullWidth
                            onClick={() => setValidateModal({ show: false, value: [] })}
                        >
                            OK
                        </Button>
                    </Box>
                </Modal>
            )}



        </div>
    );
};

export default MaintenanceRequest;