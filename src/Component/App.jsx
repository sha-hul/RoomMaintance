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
import ApartmentMicrosite from "./ApartmentMicrosite";

const App = () => {
  return (
    <div className="App" >
      <ThemeProvider theme={theme}>
      <Header />
      <Routes>
        <Route path="/empdashboard" element={<EmpDashboard empId="C2064" />} />
        <Route path="/" element={<Login />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/facilitymaster" element={<FacilityMaster empId="C2064"/>} />
        <Route path="/apartmentmaster" element={<ApartmentMaster />} />
        <Route path="/locationmaster" element={<LocationMaster />} />
        <Route path="/categorymaster" element={<CategoryMaster />} />
        <Route path="/subcategorymaster" element={<SubcategoryMaster />} />
        <Route path="/maintenancerequest" element={<MaintenanceRequest employeeName="Shahul Hameed Z" contactNo="+966 545536592" empId="C2064" />} />
        <Route path="/masters" element={<MasterModal />} />
        <Route path="/ApartmentQRModal" element={<ApartmentQRModal />} />
        <Route path="/ApartmentMicrosite" element={<ApartmentMicrosite />} />
      </Routes>
      <Footer />

      </ThemeProvider>
    </div>
  );
}

export default App;