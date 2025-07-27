import { Outlet } from "react-router-dom";
import Navigation from "./pages/auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Suspense } from "react";

function App() {
  return (
    <div className="app-container bg-[#D2C1B6]">
      <ToastContainer />
      <Navigation />
      <main className="py-3">
        <Suspense
          fallback={<div className="bg-black text-white">Loading...</div>}
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}

export default App;
