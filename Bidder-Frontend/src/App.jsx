import { BrowserRouter } from "react-router-dom";
import { Top_Navbar } from "./Officer/Top_Navbar";
import { LeftNavbar } from "./Officer/Left_Navbar/Left_Navbar";
import { OfficerRoutes } from "./Officer/officer.routes";

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-50">
        <LeftNavbar />

        <main className="min-w-0 flex-1 overflow-auto">
          <OfficerRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;