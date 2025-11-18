import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import MainPage from "../pages/MainPage.tsx";
import WorkspacePage from "../pages/WorkspacePage";
import OrderPage from "../pages/OrderPage.tsx";
import ApplicationPage from "../pages/ApplicationPage.tsx";
import WorkspaceLayout from "../layouts/WorkspaceLayout.tsx";

export const router = createBrowserRouter([
  {
    path: "/", Component: RootLayout,
    children: [
      { index: true, Component: MainPage },
      {
        path: "workspaces/:workspaceId",
        children : [
          { index: true, Component: WorkspacePage },
          {
            path: ":fileId", Component: WorkspaceLayout,
            children: [
              { path: "orders", Component: OrderPage },
              { path: "applications", Component: ApplicationPage }
            ]
          }
        ]
      },
    ]
  },
])
