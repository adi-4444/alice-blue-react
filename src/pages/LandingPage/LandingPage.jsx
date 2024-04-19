import React from "react";
import "./LandingPage.css";
import { Link } from "react-router-dom";

const LandingPage = () => {
	return (
		<div className='h-screen flex items-center justify-center gap-6'>
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
			<Link to='/brokers'>
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
						Brokers
					</span>
				</button>
			</Link>
		</div>
	);
};

export default LandingPage;
