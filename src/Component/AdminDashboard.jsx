import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <h6 style={{ textAlign: "center" }}>Admin Dashboard Dev InProcess</h6>

      <h4 style={{ marginLeft: 20, marginTop: 30 }}>Masters</h4>

      <button
        style={{
          marginLeft: 20,
          padding: "8px 16px",
          background: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer"
        }}
        onClick={() => navigate("/masters")}
      >
        Open Masters
      </button>
    </>
  );
};

export default AdminDashboard;