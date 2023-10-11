import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Outlet,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./scenes/Login";
import Home from "./scenes/Home";
import LandingPage from "./scenes/LandingPage";
import DataProvider from "./DataProvider/DataProvider";
import SetAvatar from "./scenes/SetAvatar";

const PrivateRoute = ({ isAuth, ...props }) => {
  const isAuthenticated = isAuth || sessionStorage.getItem("accessToken");
  return isAuthenticated ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate replace to="/login" />
  );
};

function App() {
  const [theme, setTheme] = useState("light");
  const [isAuth, setIsAuth] = useState(false);
  const [change, setChange] =  useState(false)
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleDark = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <>
      <DataProvider>
        <BrowserRouter>
          <div className="app">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login setIsAuth={setIsAuth} setChange={setChange} />} />

              <Route path="/" element={<PrivateRoute isAuth={isAuth} />}>
                <Route path="/setAvatar" element={<SetAvatar />} />
                <Route path="/home" element={<Home change={change} toggleDark={toggleDark} theme={theme}/>} />
              </Route>
            </Routes>
          </div>
        </BrowserRouter>
      </DataProvider>
    </>
  );
}

export default App;
