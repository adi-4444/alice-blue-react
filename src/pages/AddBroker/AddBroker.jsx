import React, { useEffect, useState } from "react";
import "./AddBroker.css";
import { saveUserToLocal } from "../../common/utils/setLocalStorage";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/features/demat/dematSlice";

const AddBroker = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [inputData, setinputData] = useState({
		userId: "",
		apiKey: "",
		nameTag: "",
	});
	const [validateInput, setValidateInput] = useState({
		userId: false,
		apiKey: false,
		nameTag: false,
	});

	const inputDataChangeHandler = (e) => {
		const { name, value } = e.target;
		setinputData({ ...inputData, [name]: value });

		// Update the corresponding validateInput state to true if the input is empty
		setValidateInput({ ...validateInput, [name]: value === "" });
	};

	const validate = (data) => {
		if (data.userId === "" || data.apiKey === "" || data.nameTag === "") {
			toast.warning("Please Fill All the Mandatory Fields");
			return false;
		}
		return true;
	};

	const submitHandler = (e) => {
		e.preventDefault();
		if (!validate(inputData)) return;
		const data = { ...inputData, createdAt: new Date().toISOString() };
		const newData = saveUserToLocal(data);
		dispatch(setUserData(newData));
		toast.success("Demat has been successfully Added");
		setTimeout(() => {
			navigate("/brokers");
		}, 500);
	};

	return (
		<div className='h-screen  flex items-center justify-center flex-col'>
			<ToastContainer autoClose={1500} />
			<div className='add-broker-div'>
				<form
					className='bg-white p-10 flex flex-col items-center justify-center gap-8 border rounded-md'
					onSubmit={submitHandler}
				>
					<div>
						<h1 className='text-heading text-lg font-semibold'>
							Add Demat Details
						</h1>
					</div>
					<div className='flex flex-col items-center justify-center gap-5'>
						<label
							htmlFor='nameTag'
							className='p-2 relative block rounded-md border bg border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600'
						>
							<input
								type='text'
								id='nameTag'
								name='nameTag'
								value={inputData?.nameTag}
								onChange={inputDataChangeHandler}
								className='peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0'
								placeholder=''
							/>

							<span className='pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs'>
								Give a Name Tag *
							</span>
						</label>
						<label
							htmlFor='userId'
							className='p-2 relative block rounded-md border bg border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600'
						>
							<input
								type='text'
								id='userId'
								name='userId'
								value={inputData?.userId}
								onChange={inputDataChangeHandler}
								className='peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0'
								placeholder=''
							/>

							<span className='pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs'>
								Enter User Id *
							</span>
						</label>
						<label
							htmlFor='apiKey'
							className='p-2 relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600'
						>
							<input
								type='text'
								id='apiKey'
								name='apiKey'
								value={inputData?.apiKey}
								onChange={inputDataChangeHandler}
								className='peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0'
								placeholder=''
							/>

							<span className='pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs'>
								Enter Demat Api Key *
							</span>
						</label>
					</div>

					<button
						className='group relative inline-flex items-center cursor-pointer overflow-hidden rounded bg-[#00D09C] px-8 py-3 text-white focus:outline-none focus:ring hover:bg-[#66e3c4]'
						type='submit'
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
							SUBMIT
						</span>
					</button>
				</form>
			</div>
		</div>
	);
};

export default AddBroker;
