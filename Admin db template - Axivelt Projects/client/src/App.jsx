import { Routes, Route } from "react-router-dom";
import "./App.css";

// Layouts
import AdminLayout from "./layout/admin/AdminLayout.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="admin/*" element={<AdminLayout />} />
      </Routes>
    </>
  );
}

export default App;
