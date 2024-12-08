import { Routes, Route, Navigate } from "react-router-dom";
import Map from "./components/Map";
// import Filter from "./components/Filter";
import LoginBtn from "./components/LoginBtn";
import LoginPage from "./pages/LoginPage";
import ForumBtn from "./components/ForumBtn";
import ForumPage from "./pages/ForumPage";

function MyRoute() {
  return (
    <Routes>
      {/* Route to redirect from "/" to "/main" */}
      <Route path="/" element={<Navigate to="/main" />} />
      
      
      {/* Route to the main page with Map, Filter, etc. */}
      <Route
        path="/main"
        element={
          <div className="main-page">
            <Map />

            <div className="main-page-button">
              <LoginBtn />
              {/* <Filter /> */}
              <ForumBtn />
            </div>
          </div>
        }
      />

      
      <Route path="/loginpage" element={<LoginPage />} />
      <Route path="/forumpage" element={<ForumPage />} />
    </Routes>
  );
}

export default MyRoute
