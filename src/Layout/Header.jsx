import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Logout } from "@mui/icons-material";
import { APP_CONFIG } from "../config";
import { useLocation } from "react-router-dom";
import { Modal, Box, Typography, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [homeModal, sethomeModal] = useState(false);
    const [logoutModal, setLogoutModal] = useState(false);



    const NavHome = () => {
        if (location.pathname === "/maintenancerequest")
            sethomeModal(true)
        else{
            // if(){

            // }
            // else{
            navigate("/empdashboard")
            // }
        }
    }

    const NavLogin = () => {
        setLogoutModal(true)
    }

    //#region AppNavbar Component
    const AppNavbar = ({ onHome, onLogout }) => {
        return (
            <nav className="navbar navbar-dark px-3"
                style={{ backgroundColor: "#444" }}   // custom grey
            >
                {/* LEFT SIDE: Logo + Title */}
                <a className="navbar-brand d-flex align-items-center" href="#">
                    <img
                        src={APP_CONFIG.LOGO_BASE64}
                        alt="Logo"
                        width="40"
                        height="40"
                        className="me-2 rounded"
                    />
                    Room Maintenance
                </a>

                {/* RIGHT SIDE: Icons */}
                {location.pathname !== "/" && (
                    <ul className="navbar-nav d-flex flex-row ms-auto">
                        <li className="nav-item mx-2" onClick={onHome} style={{ cursor: "pointer" }}>
                            <Home style={{ color: "white" }} />
                        </li>
                        <li className="nav-item mx-2" onClick={onLogout} style={{ cursor: "pointer" }}>
                            <Logout style={{ color: "white" }} />
                        </li>
                    </ul>
                )}
            </nav>
        );
    };
    //#endregion

    return (
        <>
            <AppNavbar onHome={NavHome} onLogout={NavLogin} />
            {/* home Confirmation Modal */}

            {homeModal && (
                <Modal
                    open={homeModal}
                    onClose={() => sethomeModal(false)}
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
                        <>
                            <HomeIcon sx={{ fontSize: 60, color: "#1976d2", mb: 1 }} />

                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                                Leave Request Page
                            </Typography>

                            <Typography sx={{ mb: 3 }}>
                                Going Dashboard will discard this request. Are you sure you want to leave?
                            </Typography>

                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mb: 1 }}
                                onClick={() => {
                                    sethomeModal(false);
                                    navigate("/empdashboard");
                                }}
                            >
                                Yes, Go to Dashboard
                            </Button>

                            <Button
                                variant="outlined"
                                color="error"
                                fullWidth
                                onClick={() => sethomeModal(false)}
                            >
                                No, Stay Here
                            </Button>
                        </>

                    </Box>
                </Modal>
            )}

            {/* Logout Confirmation Modal */}
            {logoutModal && (
                <Modal
                    open={logoutModal}
                    onClose={() => setLogoutModal(false)}
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
                        <LogoutIcon sx={{ fontSize: 60, color: "#f44336", mb: 1 }} />

                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                            Logout
                        </Typography>

                        <Typography sx={{ mb: 3 }}>
                            Are you sure you want to logout?
                        </Typography>

                        <Button
                            variant="contained"
                            color="error"
                            fullWidth
                            sx={{ mb: 1 }}
                            onClick={() => {
                                localStorage.removeItem("token");
                                setLogoutModal(false);
                                navigate("/");
                            }}
                        >
                            Yes, Logout
                        </Button>


                        <Button
                            variant="outlined"
                            color="primary"
                            fullWidth
                            onClick={() => setLogoutModal(false)}
                        >
                            No
                        </Button>
                    </Box>
                </Modal>
            )}

        </>
    )
}

export default Header;