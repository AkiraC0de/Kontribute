import { useState } from "react";
import { Route, Routes } from "react-router";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth/:state" element={<Auth />} />
      
      <Route element={<ProtectedRoute/>}>
        <Route path="/home" element={<Home />}/>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
