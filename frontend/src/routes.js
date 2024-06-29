import React from "react";

import { Icon, Image } from "@chakra-ui/react";
import {
  MdBarChart,
  MdPerson,
  MdImage,
  MdLock,
  MdOutlineShoppingCart,
  MdZoomIn,
} from "react-icons/md";
import { IoMdExit } from "react-icons/io"

// Admin Imports
import MainDashboard from "views/admin/default";
// import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/dataTables";
import Analysis from "views/admin/analysis";
// import RTL from "views/admin/rtl";

// Auth Imports
import SignInCentered from "views/auth/signIn";

const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },
  {
    name: "Upload",
    layout: "/admin",
    icon: <Icon as={MdImage} width='20px' height='20px' color='inherit' />,
    path: "/data-tables",
    component: DataTables,
  },
  // {
  //   name: "Profile",
  //   layout: "/admin",
  //   path: "/profile",
  //   icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
  //   component: Profile,
  // },
  {
    name: "Sign Out",
    layout: "/auth",
    path: "/sign-in",
    icon: <Icon as={IoMdExit} width='20px' height='20px' color='inherit' />,
    component: SignInCentered,
  },
  {
    name: "Analysis",
    layout: "/admin",
    path: "/analysis",
    icon: <Icon as={MdZoomIn} width='20px' height='20px' color='inherit' />,
    component: Analysis,
  },
];

export default routes;
