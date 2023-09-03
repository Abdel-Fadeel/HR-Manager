import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Dashboard,
  Cancelled,
  LoginPage,
  ActivityLogReport,
  DriverReport,
  IdReport,
  ExpiredIdReport,
  PassportReport,
  VacationsReport,
  StatusReport,
  Employees,
} from "./pages";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <div>Error</div>,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          { index: true, element: <Employees /> },
          {
            path: "cancelled",
            element: <Cancelled />,
          },
          {
            path: "reports",
            children: [
              { path: "activity-log", element: <ActivityLogReport /> },
              { path: "driver", element: <DriverReport /> },
              { path: "id", element: <IdReport /> },
              { path: "expired-id", element: <ExpiredIdReport /> },
              { path: "passport", element: <PassportReport /> },
              { path: "vacations", element: <VacationsReport /> },
              { path: "status", element: <StatusReport /> },
            ],
          },
        ],
      },
    ],
  },
]);

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};
export default App;
