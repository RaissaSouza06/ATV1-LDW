import { Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Dashboard } from "@/pages/Dashboard";
import { Sobre } from "@/pages/Sobre";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sobre" element={<Sobre />} />
      </Route>
    </Routes>
  );
}