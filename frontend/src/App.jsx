import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/pages/Auth/Login";
import Register from "./components/pages/Auth/Register";
import Home from "./components/pages/Home/Home";
import PrivateRoute from "./components/PrivateRoutes";
import AuthPrivateRoute from "./components/pages/Auth/AuthPrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route path="/login" element={<Login />}></Route>
        <Route
          path="/signup"
          element={
            <AuthPrivateRoute>
              <Register />
            </AuthPrivateRoute>
          }
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
