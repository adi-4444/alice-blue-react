import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import AddBroker from "./pages/AddBroker/AddBroker";
import Brokers from "./pages/Brokers/Brokers";
import Console from "./pages/Console/Console";

const router = createBrowserRouter([
	{
		path: "/",
		element: <LandingPage />,
		// loader: rootLoader,
	},
	{
		path: "/addbroker",
		element: <AddBroker />,
	},
	{
		path: "/brokers",
		element: <Brokers />,
	},
	{
		path: "/console",
		element: <Console />,
	},
]);

export function Routes({ children }) {
	return <RouterProvider router={router}>{children}</RouterProvider>;
}
