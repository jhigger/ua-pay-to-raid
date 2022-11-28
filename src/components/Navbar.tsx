import Image from "next/image";
import { useEffect, useState } from "react";
import DropDownMenu from "./DropDownMenu";

const Navbar = () => {
	const [state, setState] = useState(false);

	const links = [
		{ text: "Client", href: "http://client.utilityape.com/" },
		{ text: "Holders", href: "https://holders.utilityape.com/" },
		{ text: "Mutate", href: "https://mutate.utilityape.com/" },
		{ text: "Raid", href: "https://pay-to-raid.utilityape.com/" },
		{ text: "Dashboard", href: "http://dashboard.utilityape.com/" },
	];

	useEffect(() => {
		let scrollpos = window.scrollY;
		const header = document.getElementById("header");
		const navcontent = document.getElementById("nav-content");
		const navaction = document.getElementById("navAction");
		const toToggle = document.querySelectorAll(".toggleColour");

		const dark = () => {
			header?.classList.add("bg-gray-900");
			navaction?.classList.remove("bg-white");
			navaction?.classList.add("gradient");
			navaction?.classList.remove("text-white");
			navaction?.classList.add("text-white");
			//Use to switch toggleColour colours
			for (let i = 0; i < toToggle.length; i++) {
				toToggle[i]?.classList.remove("text-white");
				toToggle[i]?.classList.add("text-white");
			}
			header?.classList.add("shadow");
			navcontent?.classList.remove("bg-gray-100");
			navcontent?.classList.add("bg-white");
		};

		const light = () => {
			navaction?.classList.remove("gradient");
			navaction?.classList.add("bg-white");
			navaction?.classList.remove("text-white");
			navaction?.classList.add("text-white");
			//Use to switch toggleColour colours
			for (let i = 0; i < toToggle.length; i++) {
				toToggle[i]?.classList.remove("text-white");
				toToggle[i]?.classList.add("text-white");
			}

			header?.classList.remove("shadow");
			navcontent?.classList.remove("bg-white");
			navcontent?.classList.add("bg-gray-100");
		};

		scrollpos > 20 || state ? dark() : light();

		const handleScroll = () => {
			/*Apply classes for slide in bar*/
			scrollpos = window.scrollY;

			if (scrollpos > 20 || state) {
				dark();
			} else {
				light();
			}
		};

		document.addEventListener("scroll", handleScroll);

		return () => {
			document.removeEventListener("scroll", handleScroll);
		};
	}, [state]);

	return (
		<nav
			id="header"
			className="font-inter sticky top-0 z-50 w-full bg-gray-900 bg-opacity-50 bg-clip-padding text-white ring-1 ring-gray-500 backdrop-blur-md backdrop-filter transition duration-300 ease-in-out"
		>
			<div className="container mx-auto mt-0 flex w-full flex-wrap items-center justify-between p-4">
				<a href="https://utilityape.com/">
					<div className="toggleColour flex items-center gap-4 text-2xl font-bold text-white no-underline hover:no-underline lg:text-4xl">
						<Image
							priority
							loading="eager"
							src="/images/utilityape.png"
							alt="icon"
							width={64}
							height={64}
						/>
						Utility APE
					</div>
				</a>
				<div className="block pr-4 lg:hidden">
					<button
						id="nav-toggle"
						className="focus:shadow-outline flex transform items-center p-1 text-white transition duration-300 ease-in-out hover:scale-105 hover:text-gray-900 focus:outline-none"
						onClick={() => setState(!state)}
					>
						{state ? <CloseIcon /> : <MenuIcon />}
					</button>
				</div>
				<div
					className={`z-20 mt-8 w-full flex-grow p-4 lg:mt-0 lg:flex lg:w-auto lg:items-center lg:bg-transparent lg:p-0 ${
						state ? "block" : "hidden"
					}`}
				>
					<ul className="flex-1 flex-wrap items-center justify-end md:flex">
						{links.map((link, idx) => {
							return (
								<li key={idx} className="mr-2">
									<a
										className="toggleColour inline-block py-2 px-4 text-base font-bold text-white no-underline"
										href={link.href}
									>
										{link.text}
									</a>
								</li>
							);
						})}
						<li className="mr-2">
							<DropDownMenu items={[{ label: "Coming Soon" }]} />
						</li>
					</ul>
				</div>
			</div>
			<hr className="my-0 border-b border-gray-100 py-0 opacity-25" />
		</nav>
	);
};

const CloseIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-6 w-6"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fillRule="evenodd"
				d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
				clipRule="evenodd"
			/>
		</svg>
	);
};

const MenuIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M4 8h16M4 16h16"
			/>
		</svg>
	);
};

export default Navbar;
