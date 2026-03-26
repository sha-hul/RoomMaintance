import { Routes, Route } from "react-router-dom";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import MaintenanceRequest from "./MaintenanceRequest";
import EmpDashboard from "./EmpDashboard";
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
import ApartmentQRModal from "./ApartmentQRModal";
import ApartmentMicrosite from "./ApartmentMicrositeDemo";
import Sidebar from "../Layout/Sidebar";
import UserManual from "./UserManual";
import Report from "./Report";
import { Box } from "@mui/material";
import Statistics from "./Statistics";
import { useLocation } from "react-router-dom";

const App = () => {
  const location = useLocation();

  const hideSidebarRoutes = ["/facilitymaster", "/apartmentmaster", "/locationmaster", "/categorymaster", "/subcategorymaster", "/", "/ApartmentMicrosite"]; // add to avoid sidebar
  const showSidebar = !hideSidebarRoutes.includes(location.pathname);
  const hidelayout = ["/ApartmentMicrosite"]
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
              <Route path="/admindashboard" element={<AdminDashboard />} />
              <Route path="/empdashboard" element={<EmpDashboard empId="C2064" />} />
              <Route path="/masters" element={<MasterModal />} />
              <Route path="/maintenancerequest" element={<MaintenanceRequest employeeName="Shahul Hameed Z" contactNo="+966 545536592" empId="C2064" />} />
              <Route path="/facilitymaster" element={<FacilityMaster empId="C2064" />} />
              <Route path="/apartmentmaster" element={<ApartmentMaster />} />
              <Route path="/locationmaster" element={<LocationMaster />} />
              <Route path="/categorymaster" element={<CategoryMaster />} />
              <Route path="/subcategorymaster" element={<SubcategoryMaster />} />
              <Route path="/ApartmentQRModal" element={<ApartmentQRModal />} />
              <Route path="/ApartmentMicrosite" element={<ApartmentMicrosite />} />
              <Route path="/Statistics" element={<Statistics />} />
              <Route path="/Report" element={<Report />} />
              <Route path="/UserManual" element={<UserManual />} />
            </Routes>
          </Box>
        </Box>

        {showlayout && <Footer />}
      </ThemeProvider>
    </div>
  );
};

export default App;