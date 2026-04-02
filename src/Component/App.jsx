import { Routes, Route,Navigate } from "react-router-dom";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import MaintenanceRequest from "./MaintenanceRequest";
import Login from "./Login";
import "../Style/style.css"
import AdminDashboard from "./AdminDashboard";
import FacilityMaster from "./FacilityMaster";
import ApartmentMaster from "./ApartmentMaster";
import CategoryMaster from "./CategoryMaster";
import SubcategoryMaster from "./SubcategoryMaster";
import MasterModal from "./MasterModal";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../Common/theme";
import LocationMaster from "./LocationMaster";
import ApartmentMicrosite from "./ApartmentMicrositeDemo";
import Sidebar from "../Layout/Sidebar";
import UserManual from "./UserManual";
import Report from "./Report";
import { Box } from "@mui/material";
import Statistics from "./Statistics";
import { useLocation } from "react-router-dom";
import ProtectedRoute from "../Common/ProtectedRoute";
import NotFound from "../Common/NotFound";
import ErrorPage from "../Common/ErrorPage"
import RegisterAdmin from "./RegisterAdmin";

const App = () => {
  const location = useLocation();

  const hideSidebarRoutes = ["/facilitymaster", "/apartmentmaster", "/locationmaster", "/categorymaster", "/subcategorymaster", "/", "/ApartmentMicrosite","/notfound","/error","/registeradmin"]; // add to avoid sidebar
  const showSidebar = !hideSidebarRoutes.includes(location.pathname);
  const hidelayout = ["/ApartmentMicrosite","/notfound","/error"]
  const showlayout = !hidelayout.includes(location.pathname);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        {showlayout && <Header />}

        {/* Sidebar + page content side by side */}
        <Box sx={{ display: "flex" }}>
          {showSidebar && <Sidebar />}
          <Box component="main" sx={{ flex: 1, overflow: "auto" }}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/notfound" element={<NotFound replace/>} />
               <Route path="/error"    element={<ErrorPage />} />
              <Route path="/admindashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/registeradmin" element={<RegisterAdmin />} />
              {/* <Route path="/empdashboard" element={<ProtectedRoute><EmpDashboard empId="C2064" /></ProtectedRoute>} /> */}
              <Route path="/masters" element={<ProtectedRoute><MasterModal /></ProtectedRoute>} />
              <Route path="/maintenancerequest" element={<ProtectedRoute><MaintenanceRequest contactNo="+966 000000000" /></ProtectedRoute>} />
              <Route path="/facilitymaster" element={<ProtectedRoute><FacilityMaster  /></ProtectedRoute>} />
              <Route path="/apartmentmaster" element={<ProtectedRoute><ApartmentMaster /></ProtectedRoute>} />
              <Route path="/locationmaster" element={<ProtectedRoute><LocationMaster /></ProtectedRoute>} />
              <Route path="/categorymaster" element={<ProtectedRoute><CategoryMaster /></ProtectedRoute>} />
              <Route path="/subcategorymaster" element={<ProtectedRoute><SubcategoryMaster /></ProtectedRoute>} />
              <Route path="/ApartmentMicrosite" element={<ApartmentMicrosite />} />
              <Route path="/Statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
              <Route path="/Report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
              <Route path="/UserManual" element={<ProtectedRoute><UserManual /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/notfound" replace />}/>
            </Routes>
          </Box>
        </Box>

        {showlayout && <Footer />}
      </ThemeProvider>
    </div>
  );
};

export default App;