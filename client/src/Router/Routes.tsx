import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/auth/Login";

export default function Router() { 
    const routes = [
      {
        path: "/",
        Component: Dashboard,
      },
      {
        path: "/login",
        Component: Login,
      },
    ];
    return (
      <Routes>
        {routes.map(({ path, Component }, i) => (
          <Route key={i} path={path} element={<Component />} />
        ))}
      </Routes>
    );
}