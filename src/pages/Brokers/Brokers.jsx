import React, { useEffect, useState } from "react";
import "./Brokers.css";
import { useDispatch, useSelector } from "react-redux";
import { Cloud, CloudOff, PauseCircle, PlayCircle, Trash2 } from "lucide-react";
import {
	DeleteUserToLocal,
	addWsToLastSession,
	setUserSession,
} from "../../common/utils/setLocalStorage";
import { Link } from "react-router-dom";
import { setUserData } from "../../redux/features/demat/dematSlice";
import {
	createWsSession,
	getEncKey,
	getSessionId,
	validateSessionId,
} from "../../redux/features/auth/authActions";
import { ToastContainer, toast } from "react-toastify";

import { setUserAuthData } from "../../redux/features/auth/authSlice";
import {
	doubleHashWsSessionId,
	encryptSHA256,
	getTimeDifferenceInHours,
	openConsoleHandler,
	timeAgo,
} from "../../common/utils/helperFunctions";
import { SHA256 } from "crypto-js";
import { getFunds } from "../../redux/features/demat/dematActions";
import websocket from "websocket";

const Brokers = () => {
	const dispatch = useDispatch();
	const { info, loading, success, error } = useSelector(
		(state) => state.demat
	);
	const {
		info: authInfo,
		userId: authUser,
		loading: authLoading,
		success: authSuccess,
		error: authError,
		sessionId,
		wsSessionId,
		susertoken,
	} = useSelector((state) => state.auth);

	const connectToBroker = (id, brokerData) => {
		const data = { userId: id };
		// check if user is logged in or not
		dispatch(getEncKey(data)).then((res) => {
			if (res?.payload?.response?.data?.login) {
				toast.success("User logged in successfully");
			} else {
				window.open("https://ant.aliceblueonline.com");
				window.onfocus = () => {
					dispatch(getEncKey(data)).then((res) => {
						console.log(res);
						if (res?.payload?.response?.data?.login) {
							toast.success("User logged in successfully");
						} else {
							toast.error("User Login Failed, please try again");
						}
					});
					window.onfocus = null;
				};
			}
		});
	};

	// useEffect for generating session id
	useEffect(() => {
		// Check if the user is logged in and has encKey then hash the data
		if (authInfo?.encKey) {
			hashToSessionId(authUser?.userId);
		}
	}, [authInfo]);

	const hashToSessionId = (id) => {
		// encrypt data using sha256 for session id
		const hashedData = encryptSHA256(
			id,
			info[id]?.apiKey,
			authInfo?.encKey
		);
		const data = { userId: id, userData: hashedData };
		// generate session id
		dispatch(getSessionId(data)).then((res) => {
			console.log(res);
			const session = res?.payload?.response?.data?.sessionID;
			// if session id is generated then set it to local storage and redux store
			if (session) {
				const data = setUserSession(id, session);
				dispatch(setUserData(data.localData));
				dispatch(setUserAuthData(data.data));
			}
		});
	};

	const startBroker = (id, brokerData) => {
		const localData = JSON.parse(localStorage.getItem("userData"));
		// if broker is not connected to broker then show error
		if (!localData[id].sessionId) {
			toast.error("Broker Not Connected ! Please connect to Broker");
			return;
		}
		if (getTimeDifferenceInHours(localData[id]?.lastConnectedAt) >= 8) {
			toast.error("Session Expired Please Reconnet to Broker");
		} else {
			dispatch(
				validateSessionId({ id, sessionId: brokerData?.sessionId })
			).then((res) => {
				if (res?.payload?.response?.data?.message === "SUCCESS") {
					dispatch(
						createWsSession({
							id,
							sessionId: brokerData?.sessionId,
						})
					);
				}
			});
		}
	};

	// useEffect for double hashing wsSessionId
	useEffect(() => {
		// Check if the user is logged in and has wsSessionId
		if (wsSessionId) {
			wsSessionToWsUserToken(sessionId, authUser?.userId);
		}
	}, [wsSessionId]);

	const wsSessionToWsUserToken = (sessionId, id) => {
		const localData = JSON.parse(localStorage.getItem("userData"));
		const hashedData = doubleHashWsSessionId(sessionId);
		// making all other play false
		for (const userId in localData) {
			if (userId !== id) {
				localData[userId].play = false;
			}
		}
		// if last connected time is less than 14 hours then set play true, add wsSessionId and wsUserToken to local storage and redux store
		localData[id].play = true;
		localData[id].susertoken = hashedData;
		localData[id].wsSessionId = wsSessionId;
		localData[id].wsSessionAt = new Date().toISOString();
		localStorage.setItem("userData", JSON.stringify(localData));
		dispatch(setUserData(localData));
		dispatch(setUserAuthData(localData));
		addWsToLastSession(id, wsSessionId, hashedData);
	};

	const stopBroker = (id, brokerData) => {
		console.log(id, brokerData);
		const localData = JSON.parse(localStorage.getItem("userData"));
		localData[id].play = false;
		localStorage.setItem("userData", JSON.stringify(localData));
		dispatch(setUserData(localData));
	};

	const deleteBroker = (id, brokerData) => {
		const localData = JSON.parse(localStorage.getItem("userData"));
		if (id in localData) {
			delete localData[id];
			dispatch(setUserData(localData));
			DeleteUserToLocal(localData);
			console.log(localData);
		} else {
			console.log("Item with ID", id, "not found");
		}
		console.log(localData);
	};

	const [socket, setSocket] = useState(null);

	useEffect(() => {
		console.log(susertoken);
		const ws = new websocket.w3cwebsocket(
			"wss://ws1.aliceblueonline.com/NorenWS",
			"echo-protocol"
		);

		const data = {
			susertoken: susertoken,
			t: "c",
			actid: "964485_API",
			uid: "964485_API",
			source: "API",
		};

		console.log(JSON.stringify(data));
		ws.onopen = function () {
			console.log("WebSocket Client Connected");
			ws.send(JSON.stringify(data));
			ws.send(JSON.stringify({ k: "NFO|54957#MCX|239484", t: "t" }));
		};

		ws.onopen = function () {
			console.log("On Open");
			ws.send(JSON.stringify(data));
			ws.send(JSON.stringify({ k: "NFO|54957#MCX|239484", t: "t" }));
		};
		ws.onmessage = function (event) {
			console.log("On Message", event.message);
		};
		ws.onerror = function (event) {
			console.log("On Error", event.message);
		};
		ws.onclose = function (event) {
			console.log("On Close", event.message);
		};

		// return ws;
	}, [susertoken]);

	const fundsHandler = () => {
		dispatch(getFunds({ id: authUser?.userId, sessionId })).then((res) =>
			console.log(res)
		);
	};

	return (
		<div className='flex items-center justify-center h-screen flex-col gap-5'>
			<ToastContainer autoClose={1200} />
			<h1 className='text-heading text-lg font-bold'>Brokers List</h1>

			<div className='overflow-x-auto rounded-lg border border-gray-200 p-5'>
				<table className='min-w-full divide-y-2 divide-gray-200 bg-white text-sm'>
					<thead className='ltr:text-left'>
						<tr>
							<th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>
								Broker
							</th>
							<th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>
								Broker Id
							</th>
							<th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>
								App Secret Key
							</th>
							<th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>
								Status
							</th>

							<th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>
								Connect to Broker
							</th>
							<th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>
								Last Connected At
							</th>
							<th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>
								Start/Stop
							</th>
							<th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>
								Added On
							</th>
							<th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>
								Delete
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-200'>
						{info === null || Object.keys(info).length > 0 ? (
							Object.entries(info)?.map(([id, brokerData]) => (
								<tr key={id}>
									<td className='Broker whitespace-nowrap px-4 py-2 text-gray-900 text-center'>
										{brokerData?.nameTag}
									</td>

									<td className='Broker-Id whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center'>
										{brokerData?.userId}
									</td>

									<td className='App-Secret-Key whitespace-nowrap px-4 py-2 text-gray-700 text-center'>
										{brokerData?.apiKey
											? "***" +
											  brokerData?.apiKey.substring(
													brokerData?.apiKey.length -
														3
											  )
											: ""}
									</td>

									<td className='Status whitespace-nowrap px-4 py-2 text-center'>
										<span className='whitespace-nowrap rounded-full bg-input-bg-green1 px-2.5 py-0.5 text-sm text-btn-green'>
											Active
										</span>
									</td>

									<td className='Connect whitespace-nowrap px-4 py-2 text-gray-700 text-center flex items-center justify-center'>
										{getTimeDifferenceInHours(
											brokerData?.lastConnectedAt
										) <= 8 ? (
											<Cloud
												className='text-btn-green cursor-pointer'
												onClick={() =>
													connectToBroker(
														id,
														brokerData
													)
												}
											/>
										) : (
											<CloudOff
												className='text-red-400 cursor-pointer'
												onClick={() =>
													connectToBroker(
														id,
														brokerData
													)
												}
											/>
										)}
									</td>

									<td className='Last-Connected whitespace-nowrap px-4 py-2 text-gray-700 text-center'>
										{brokerData?.lastConnectedAt
											? timeAgo(
													brokerData?.lastConnectedAt
											  )
											: "-"}
									</td>

									<td className='Start/Stop whitespace-nowrap px-4 py-2 text-gray-700 text-center flex items-center justify-center'>
										{brokerData?.play &&
										getTimeDifferenceInHours(
											brokerData?.wsSessionAt
										) <= 8 ? (
											<PauseCircle
												className='text-red-400 cursor-pointer'
												onClick={() =>
													stopBroker(id, brokerData)
												}
											/>
										) : (
											<PlayCircle
												className='text-btn-green cursor-pointer'
												onClick={() =>
													startBroker(id, brokerData)
												}
											/>
										)}
									</td>

									<td className='Added whitespace-nowrap px-4 py-2 text-gray-700 text-center'>
										{
											new Date(brokerData?.createdAt)
												.toLocaleString()
												.split(",")[0]
										}
									</td>

									<td className='Delete whitespace-nowrap px-4 py-2 text-gray-700 text-center flex items-center justify-center'>
										<Trash2
											className='text-red-400 cursor-pointer'
											onClick={() =>
												deleteBroker(id, brokerData)
											}
										/>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td className='Broker whitespace-nowrap px-4 py-2 text-gray-900 text-center'>
									'No Broker Available'
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			<div className='flex items-center justify-center gap-10'>
				<Link to='/addbroker'>
					<button className='group relative inline-flex items-center cursor-pointer overflow-hidden rounded bg-[#00D09C] px-8 py-3 text-white focus:outline-none focus:ring hover:bg-[#66e3c4]'>
						<span className='absolute -end-full transition-all group-hover:end-4'>
							<svg
								className='h-5 w-5 rtl:rotate-180'
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M17 8l4 4m0 0l-4 4m4-4H3'
								/>
							</svg>
						</span>
						<span className='text-sm font-medium transition-all group-hover:me-4'>
							Add Broker
						</span>
					</button>
				</Link>
				<button
					className='group relative inline-flex items-center cursor-pointer overflow-hidden rounded bg-[#00D09C] px-8 py-3 text-white focus:outline-none focus:ring hover:bg-[#66e3c4]'
					onClick={openConsoleHandler}
				>
					<span className='absolute -end-full transition-all group-hover:end-4'>
						<svg
							className='h-5 w-5 rtl:rotate-180'
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M17 8l4 4m0 0l-4 4m4-4H3'
							/>
						</svg>
					</span>
					<span className='text-sm font-medium transition-all group-hover:me-4'>
						Open Console
					</span>
				</button>

				<button onClick={fundsHandler}>Get Funds</button>
			</div>
		</div>
	);
};

export default Brokers;
