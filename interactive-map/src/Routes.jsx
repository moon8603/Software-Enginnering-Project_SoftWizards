import { Routes, Route, Navigate } from "react-router-dom";
import Map from "./components/Map";
import Filter from "./components/Filter";
import ForumBtn from "./components/ForumBtn";
import LoginBtn from "./components/LoginBtn";
import LoginPage from "./pages/LoginPage";

function MyRoute() {
  return (
    <Routes>
      {/* Route to redirect from "/" to "/main" */}
      <Route path="/" element={<Navigate to="/main" />} />
      
      
      {/* Route to the main page with Map, Filter, etc. */}
      <Route
        path="/main"
        element={
          <div>
            <Map />
            <LoginBtn />
            <Filter />
            <ForumBtn />
          </div>
        }
      />

      
      <Route path="/loginpage" element={<LoginPage />} />
      <Route path="/forum" element={<ForumBtn />} />
    </Routes>
  );
}

export default MyRoute
