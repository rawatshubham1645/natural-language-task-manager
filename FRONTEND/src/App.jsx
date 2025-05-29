import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import NotFound from "./components/sections/NotFound";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";
import "./styles/globals.css";
import TaskRoutes from "./pages/taskRoutes";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="repair-kart-theme">
      <Toaster position="top-right" expand={true} richColors />
      <div className="min-h-screen bg-background text-foreground">
        <BrowserRouter>
          <Routes>
            <Route path="task/*" element={<TaskRoutes />} />
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<Navigate replace to="/task" />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
