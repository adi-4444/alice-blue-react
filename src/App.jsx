import "./App.css";

import "@fontsource/poppins/100.css";
import "@fontsource/poppins/200.css";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "@fontsource/poppins/900.css";
import { Routes } from "./Routes";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setUserData } from "./redux/features/demat/dematSlice";
import { setUserAuthData } from "./redux/features/auth/authSlice";
import { getTimeDifferenceInHours } from "./common/utils/helperFunctions";
import { resetAllSessions } from "./common/utils/setLocalStorage";

function App() {
	const dispatch = useDispatch();
	useEffect(() => {
		// setting up the user data initially or page refresh
		const data = JSON.parse(localStorage.getItem("userData"));
		if (data === null) {
			localStorage.setItem("userData", JSON.stringify({}));
			dispatch(setUserData({}));
		} else {
			console.log(data);
			for (let key in data) {
				if (getTimeDifferenceInHours(data[key].lastConnectedAt) >= 8) {
					data[key].sessionId = "";
					data[key].play = false;
					data[key].susertoken = "";
					data[key].wsSessionAt = "";
				}
			}
			dispatch(setUserData(data));
		}

		// setting up the user auth data initially or page refresh
		const authData = JSON.parse(localStorage.getItem("retainLastSession"));
		if (authData === null) {
			localStorage.setItem("retainLastSession", JSON.stringify({}));
		} else {
			for (let key in authData) {
				if (
					getTimeDifferenceInHours(authData[key].lastConnectedAt) >= 8
				) {
					authData[key].auth = false;
					authData[key].lastConnectedAt = "";
					authData[key].sessionId = "";
					authData[key].wsSessionAt = "";
				}
			}
			dispatch(setUserAuthData(authData));
		}
	}, []);

	return <Routes></Routes>;
}

export default App;
