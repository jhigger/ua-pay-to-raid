import axios from "axios";
import { useEffect, useState } from "react";
import { FaExternalLinkSquareAlt } from "react-icons/fa";

/* eslint-disable @next/next/no-img-element */
const HistoryPanel = () => {
	const [raids, setRaids] = useState([]);

	useEffect(() => {
		axios
			.get("/api/raids")
			.then((res) => {
				setRaids(
					res.data.raids.filter(({ raided }: { raided: boolean }) => {
						return raided;
					})
				);
			})
			.catch((err) => console.log(err));
	}, []);

	return (
		<div className="max-h-96 w-full max-w-3xl overflow-auto rounded-xl bg-gray-900 bg-opacity-50 bg-clip-padding ring-1 ring-gray-500 backdrop-blur-md backdrop-filter">
			<div className="flex h-full flex-col items-center justify-center p-4">
				<h2 className="py-4 text-center text-2xl font-bold leading-5 text-gray-50">
					Recently Raided
				</h2>

				<div className="container mx-auto mt-4 flex w-full flex-col items-center justify-center rounded-lg">
					<ul className="flex flex-col divide-y">
						{raids.map(
							(
								{
									tweetUrl,
									createdAt,
								}: {
									tweetUrl: string;
									createdAt: string;
								},
								idx
							) => {
								return (
									<Row
										key={idx}
										twitterHandle={
											tweetUrl.split("/")[3] || ""
										}
										tweetUrl={tweetUrl}
										date={createdAt}
									/>
								);
							}
						)}
					</ul>
				</div>
			</div>
		</div>
	);
};

const Row = ({
	twitterHandle,
	tweetUrl,
	date,
}: {
	twitterHandle: string;
	tweetUrl: string;
	date: string;
}) => {
	return (
		<li className="flex flex-row bg-gray-900 bg-opacity-0 hover:bg-opacity-50">
			<div className="flex w-full flex-1 select-none items-center p-4">
				<div className="mr-4 flex h-10 w-10 flex-col items-center justify-center">
					<img
						alt="profile"
						src={`https://unavatar.io/twitter/${twitterHandle}`}
						className="mx-auto h-10 w-10 rounded-full object-cover "
					/>
				</div>
				<div className="mr-8 flex-1 pl-1 md:mr-16">
					<div className="font-medium dark:text-white">
						{twitterHandle}
					</div>
					<a
						href={tweetUrl}
						target="_blank"
						rel="noreferrer"
						className="flex max-w-xl items-center gap-2 text-sm text-gray-600 dark:text-gray-200"
					>
						Twitter Post
						<FaExternalLinkSquareAlt />
					</a>
				</div>
				<div className="text-xs text-gray-600 dark:text-gray-200">
					{new Date(date).toLocaleDateString()}
				</div>
			</div>
		</li>
	);
};

export default HistoryPanel;
