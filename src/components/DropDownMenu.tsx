interface Props {
	//boolean to always open ddm (for presentation)
	forceOpen?: boolean;
	label?: string;
	withDivider?: boolean;
	icon?: JSX.Element;
	items: DDMItem[];
	withBackground?: boolean;
}

export interface DDMItem {
	icon?: JSX.Element;
	label: string;
	desc?: string;
	link?: string;
}

const DropDownMenu = (props: Props) => {
	// const [isOpen, setIsOpen] = useState(true);
	return (
		<div className="group relative inline-block text-left">
			<div>
				<button
					type="button"
					// onClick={() => setIsOpen(!isOpen)}
					className={` ${
						props.withBackground
							? "border border-gray-300 bg-white shadow-sm dark:bg-gray-800"
							: ""
					} flex w-full items-center justify-center rounded-md  px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:text-gray-50 dark:hover:bg-gray-500`}
					id="options-menu"
				>
					{props.label}

					{props.icon || (
						<svg
							width="20"
							height="20"
							fill="currentColor"
							viewBox="0 0 1792 1792"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M1408 704q0 26-19 45l-448 448q-19 19-45 19t-45-19l-448-448q-19-19-19-45t19-45 45-19h896q26 0 45 19t19 45z" />
						</svg>
					)}
				</button>
			</div>

			<div className="absolute right-0 mt-0 hidden w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 group-hover:block dark:bg-gray-800">
				<div
					className={`py-1 ${
						props.withDivider ? "divide-y divide-gray-100" : ""
					}`}
					role="menu"
					aria-orientation="vertical"
					aria-labelledby="options-menu"
				>
					{props.items.map((item) => {
						return (
							<a
								key={item.label}
								href={item.link || "#"}
								className={`${
									item.icon ? "flex items-center" : "block"
								} text-md block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`}
								role="menuitem"
							>
								{item.icon}

								<span className="flex flex-col">
									<span>{item.label}</span>
									{item.desc && (
										<span className="text-xs text-gray-400">
											{item.desc}
										</span>
									)}
								</span>
							</a>
						);
					})}
				</div>
			</div>
		</div>
	);
};
export default DropDownMenu;
