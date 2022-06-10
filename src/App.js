import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import AuthContext from "./store/auth- context";

function App() {
  const authCtx = useContext(AuthContext)

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {!authCtx.isLoggedIn && (
          <Route path="/auth" element={<AuthPage />} />
        )}
        <Route path="/profile" element={
          <React.Fragment>
            {authCtx.isLoggedIn && <ProfilePage />}
            {!authCtx.isLoggedIn && <Navigate to="/" />}
          </React.Fragment>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

export default App;
