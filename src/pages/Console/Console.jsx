import React, { useEffect, useState } from "react";
import "./Console.css";
import { useDispatch, useSelector } from "react-redux";

const Console = () => {
	const dispatch = useDispatch();
	const [auth, setAuth] = useState(
		JSON.parse(localStorage.getItem("retainLastSession"))
	);
	useEffect(() => {
		document.title = "Easy Click Trading Console";
		const localData = JSON.parse(localStorage.getItem("retainLastSession"));
		setAuth(localData);
	}, []);

	console.log(auth);

	return (
		<div>
			<h1>Trading Console</h1>
		</div>
	);
};

export default Console;
