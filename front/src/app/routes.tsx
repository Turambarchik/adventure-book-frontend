import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "@/pages/home";
import { GamePage } from "@/pages/game";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/play/:bookPath" element={<GamePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
