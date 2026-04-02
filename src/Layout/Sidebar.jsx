import { useState, createContext, useContext, useEffect } from "react";
import {
    Box, List, ListItem, ListItemIcon, ListItemText,
    IconButton, Avatar, Typography, Tooltip, Divider,
} from "@mui/material";
import {
    ChevronLeft, ChevronRight, MoreVert,
    Dashboard, BarChart, HomeWork, AddAlert, MenuBook, Assessment
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import AddBoxIcon from "@mui/icons-material/AddBox";

/* ─── context ───────────────────────────────────────────── */
const SidebarContext = createContext();

/* ─── nav items ─────────────────────────────────────────── */
const NAV_ITEMS = [
    { text: "Dashboard", icon: <Dashboard />, path: "/admindashboard" },
    // { text: "Statistics", icon: <BarChart />, path: "/statistics" },
    { text: "Master", icon: <HomeWork />, path: "/masters" },
    { text: "Raise Request", icon: <AddBoxIcon />, path: "/maintenancerequest" },
    // { text: "Report", icon: <Assessment />, path: "/report" },
    // { text: "User Manual", icon: <MenuBook />, path: "/UserManual" },
];

const VOILET = "#5c6bc0";

/* ═══════════════════════════════════════════════════════ */
/*  SIDEBAR ITEM                                           */
/* ═══════════════════════════════════════════════════════ */
function SidebarItem({ icon, text, path }) {
    const { expanded } = useContext(SidebarContext);
    const navigate = useNavigate();
    const location = useLocation();
    const active = location.pathname.startsWith(path);
    
    
    return (
        <Tooltip title={expanded ? "" : text} placement="right" arrow>
            <ListItem
                onClick={() => navigate(path)}
                sx={{
                    borderRadius: "8px",
                    mb: 0.5,
                    px: 1.5,
                    py: 1,
                    cursor: "pointer",
                    position: "relative",
                    bgcolor: active ? `${VOILET}18` : "transparent",
                    color: active ? VOILET : "#555",
                    fontWeight: active ? 700 : 500,
                    transition: "background .2s, color .2s",
                    "&:hover": {
                        bgcolor: active ? `${VOILET}22` : `${VOILET}0e`,
                        color: VOILET,
                    },
                    // left accent bar
                    "&::before": active ? {
                        content: '""',
                        position: "absolute",
                        left: 0, top: "20%",
                        width: 3, height: "60%",
                        borderRadius: "0 4px 4px 0",
                        bgcolor: VOILET,
                    } : {},
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        color: "inherit",
                        mr: expanded ? 1.5 : 0,
                        transition: "margin .3s",
                    }}
                >
                    {icon}
                </ListItemIcon>

                <ListItemText
                    primary={text}
                    sx={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        width: expanded ? 160 : 0,
                        opacity: expanded ? 1 : 0,
                        transition: "width .3s, opacity .25s",
                        "& .MuiListItemText-primary": {
                            fontSize: "0.875rem",
                            fontWeight: active ? 700 : 500,
                            fontFamily: "'Outfit', 'Roboto', sans-serif",
                            color: "inherit",
                        },
                    }}
                />
            </ListItem>
        </Tooltip>
    );
}

/* ═══════════════════════════════════════════════════════ */
/*  SIDEBAR                                                */
/* ═══════════════════════════════════════════════════════ */
export default function Sidebar() {
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(true);
    const [userDetail, setUserdetail] = useState({
        empId: "",
        name: "",
        role: "",
        mail: ""
    });

    useEffect(() => {
        try {
            const user = JSON.parse(sessionStorage.getItem("user"));
            if (!user) return;
            setUserdetail({
                empId: user.empId,
                name: user.name,
                role: user.role,
                mail: user.mail
            })
        }
        catch (error) {
               console.error("pageload - error occurred:", error);
               navigate("/error");
        }
    }, [])
    return (
        <SidebarContext.Provider value={{ expanded }}>
            <Box
                component="aside"
                sx={{
                    height: "calc(100vh - 104px)",
                    position: "sticky",
                    top: 64,
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "#fff",
                    borderRight: "1px solid #e5e7eb",
                    boxShadow: "2px 0 8px rgba(0,0,0,0.06)",
                    width: expanded ? 240 : 68,
                    transition: "width .3s ease",
                    flexShrink: 0,
                    overflow: "hidden",
                }}
            >
                {/* ── logo + toggle ── */}
                <Box sx={{
                    px: 1.5, py: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: expanded ? "space-between" : "center",
                    minHeight: 64,
                    borderBottom: "1px solid #f0f0f0",
                }}>
                    {expanded && (
                        <Typography
                            sx={{
                                fontSize: "1.3rem",
                                fontWeight: 700,
                                background: "linear-gradient(135deg, #3365c2, #1041a8d7)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                letterSpacing: "0.06em",
                                whiteSpace: "nowrap",
                            }}
                        >
                            My Workspace
                        </Typography>
                    )}
                    <IconButton
                        onClick={() => setExpanded(p => !p)}
                        size="small"
                        sx={{
                            bgcolor: "#f9fafb",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            "&:hover": { bgcolor: `${VOILET}12`, borderColor: VOILET },
                            color: "#555",
                        }}
                    >
                        {expanded ? <ChevronLeft fontSize="small" /> : <ChevronRight fontSize="small" />}
                    </IconButton>
                </Box>

                {/* ── nav items ── */}
                <List sx={{ flex: 1, px: 1, pt: 1.5, overflowY: "auto", overflowX: "hidden" }}>
                    {NAV_ITEMS.map(item => (
                        <SidebarItem key={item.text} {...item} />
                    ))}
                </List>

                {/* ── user footer ── */}
                <Divider />
                <Box sx={{
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: expanded ? 1.5 : 0,
                    justifyContent: expanded ? "flex-start" : "center",
                    minHeight: 64,
                }}>
                    <Avatar
                        src={`https://ui-avatars.com/api/?background=5c6bc0&color=FFFFFF&bold=true&name=${userDetail.name}`}
                        sx={{ width: 38, height: 38, borderRadius: "8px", flexShrink: 0 }}
                        alt={userDetail.name}
                    />
                    <Box sx={{
                        overflow: "hidden",
                        width: expanded ? 140 : 0,
                        opacity: expanded ? 1 : 0,
                        transition: "width .3s, opacity .25s",
                        whiteSpace: "nowrap",
                    }}>
                        <Typography sx={{
                            fontSize: "0.82rem", fontWeight: 700,
                            color: "#1a1a1a", lineHeight: 1.3,
                            fontFamily: "'Outfit','Roboto',sans-serif"
                        }}>
                            {userDetail.name}
                        </Typography>
                        <Typography sx={{
                            fontSize: "0.7rem", color: "#888",
                            fontFamily: "'Outfit','Roboto',sans-serif"
                        }}>
                            {userDetail.mail}
                        </Typography>
                    </Box>
                    {/* {expanded && (
                        <IconButton size="small" sx={{
                            ml: "auto", color: "#aaa",
                            "&:hover": { color: VOILET }
                        }}>
                            <MoreVert fontSize="small" />
                        </IconButton>
                    )} */}
                </Box>
            </Box>
        </SidebarContext.Provider>
    );
}