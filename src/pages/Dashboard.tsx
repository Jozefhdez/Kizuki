import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

function Dashboard() {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
    <div>Dashboard</div>
        <button onClick={handleLogout}> Sign Out </button>
    </div>
  )
}

export default Dashboard