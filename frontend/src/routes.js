import React from "react";

import { Icon } from "@chakra-ui/react";
import {
  MdBarChart,
  MdImage,
  MdZoomIn,
} from "react-icons/md";

// Admin Imports
import MainDashboard from "views/admin/default";
import DataTables from "views/admin/dataTables";
import Analysis from "views/admin/analysis";

const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "/dashboard",
    icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },
  {
    name: "Upload",
    layout: "/admin",
    icon: <Icon as={MdImage} width='20px' height='20px' color='inherit' />,
    path: "/uploads",
    component: DataTables,
  },
  {
    name: "Analysis",
    layout: "/admin",
    path: "/analysis",
    icon: <Icon as={MdZoomIn} width='20px' height='20px' color='inherit' />,
    component: Analysis,
  },
  // {
  //   name: "Sign Out",
  //   layout: "/auth",
  //   path: "/sign-in",
  //   icon: <Icon as={IoMdExit} width='20px' height='20px' color='inherit' />,
  //   component: SignInCentered,
  // },
];

export default routes;
