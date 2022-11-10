import { findReference, FindReferenceError } from "@solana/pay";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Keypair, Transaction } from "@solana/web3.js";
import axios from "axios";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FaTwitter } from "react-icons/fa";
import { TwitterTweetEmbed } from "react-twitter-embed";

type TwitterPost = { url: string };

const Home: NextPage = () => {
	const [tweetUrl, setTweetUrl] = useState("");
	const [tweetId, setTweetId] = useState("");
	const [confirmed, setConfirmed] = useState(false);
	const [transaction, setTransaction] = useState<Transaction | null>(null);

	const { connection } = useConnection();
	const { wallet, publicKey, connected, sendTransaction } = useWallet();
	const reference = useMemo(() => {
		return Keypair.generate().publicKey;
	}, []);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitSuccessful },
		reset,
	} = useForm<TwitterPost>();

	const onSubmit = ({ url }: TwitterPost) => {
		setTransaction(null);
		const arr = url.split("/");
		setTweetUrl(url);
		setTweetId(arr[arr.length - 1] || "");
	};

	const handlePay = async () => {
		setConfirmed(false);
		const address = publicKey?.toBase58();

		const payload = {
			reference,
			address,
			tweetUrl,
			tweetId,
			saveToDb: false,
		};

		axios
			.post(`/api/submit`, { ...payload })
			.then((res) => {
				// Deserialize the transaction from the response
				const transaction = Transaction.from(
					Buffer.from(res.data.transaction, "base64")
				);
				setTransaction(transaction);
			})
			.catch((err) => {
				console.log(err.message);
			});
	};

	// Send the transaction once it's fetched
	useEffect(() => {
		const handleSaveToDb = () => {
			if (!publicKey) return;

			const payload = {
				reference,
				address: publicKey.toBase58(),
				tweetUrl,
				tweetId,
				saveToDb: true,
			};

			axios.post(`/api/submit`, { ...payload }).catch((err) => {
				console.log(err.message);
			});
		};
		const trySendTransaction = async () => {
			if (!transaction) {
				return;
			}
			try {
				await sendTransaction(transaction, connection);
				handleSaveToDb();
				reset();
			} catch (e) {
				console.error(e);
			} finally {
				setTransaction(null);
			}
		};
		trySendTransaction();
	}, [
		transaction,
		connection,
		sendTransaction,
		reset,
		publicKey,
		reference,
		tweetUrl,
		tweetId,
	]);

	// Check every 0.5s if the transaction is completed
	useEffect(() => {
		const interval = setInterval(async () => {
			if (!reference) return;
			try {
				// Check if there is any transaction for the reference
				await findReference(connection, reference);
				setConfirmed(true);
			} catch (e) {
				if (e instanceof FindReferenceError) {
					// No transaction found yet, ignore this error
					return;
				}
				console.error("Unknown error", e);
			}
		}, 500);
		return () => {
			clearInterval(interval);
		};
	}, [connection, reference, reset]);

	return (
		<>
			<Head>
				<title>Utility APE | Pay To Raid</title>
				<meta
					name="description"
					content="Community, Utility, and Security for the Solana ecosystem through our advanced Discord bots & web3 integrations."
				/>
				<link rel="icon" href="/images/utilityape.png" />
			</Head>
			<div className="relative h-screen w-screen">
				<Image
					src="/images/bg-1.jpg"
					alt="background"
					fill
					priority
					className="object-cover"
				/>
				<main className="absolute w-full leading-normal tracking-normal text-white">
					<div className="container mx-auto flex h-screen flex-col flex-wrap items-center justify-center py-8 px-4">
						<div className="w-full max-w-3xl rounded-xl bg-gray-900 bg-opacity-50 bg-clip-padding ring-1 ring-gray-500 backdrop-blur-md backdrop-filter">
							<div className="flex flex-col md:flex-row">
								{confirmed ? (
									<div className="flex h-full w-full flex-col items-center justify-center">
										<p className="my-6 flex items-center text-center text-sm leading-5 text-gray-300">
											Payment confirmed!
											<br />
											Thank you for using Utility APE.
											<br />
											Please allow us 24 to 48 hours to
											review.
										</p>
									</div>
								) : (
									<>
										<div className="flex-1 p-4">
											<div className="flex h-full flex-col items-center justify-center">
												<h1 className="py-4 text-center text-3xl font-bold leading-5 text-gray-50">
													Pay To Raid
												</h1>
												<div className="mt-4">
													<WalletMultiButton />
												</div>
												{wallet && connected ? (
													<form
														className="flex w-full flex-col gap-4"
														onSubmit={handleSubmit(
															onSubmit
														)}
													>
														<div>
															<div className="mt-8 flex">
																<span className="inline-flex items-center rounded-l-md border-t border-l border-b border-gray-300 bg-white px-3 text-sm text-gray-500 shadow-sm">
																	<FaTwitter />
																</span>
																<input
																	type="text"
																	className="w-full flex-1 appearance-none rounded-r-lg border border-gray-300 bg-white py-2 px-4 text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600"
																	placeholder="e.g. https://twitter.com/utilityapeNFT/status/1588789205530193921"
																	{...register(
																		"url",
																		{
																			required:
																				{
																					value: true,
																					message:
																						"Twitter Post URL Required!",
																				},
																			pattern:
																				{
																					value: /^https?:\/\/(www.|m.|mobile.)?twitter\.com\/(?:#!\/)?\w+\/status?\/\d+/i,
																					message:
																						"Invalid URL Provided!",
																				},
																		}
																	)}
																/>
															</div>
															{errors.url && (
																<div className="my-2 text-center text-xs text-red-500">
																	{
																		errors
																			.url
																			.message
																	}
																</div>
															)}
														</div>
														<button
															type="submit"
															className="gradient focus:shadow-outline mx-auto w-full transform rounded-md py-2 px-4 font-bold text-white shadow transition duration-75 ease-in-out hover:bg-white hover:text-black active:scale-95 lg:mx-0"
														>
															Validate
														</button>
														{isSubmitSuccessful && (
															<>
																{transaction ? (
																	<div className="flex h-full w-full flex-col items-center justify-center">
																		<p className="flex items-center text-center text-sm leading-5 text-gray-300">
																			Processing
																			payment...
																		</p>
																	</div>
																) : (
																	<button
																		onClick={
																			handlePay
																		}
																		type="button"
																		className="gradient focus:shadow-outline mx-auto w-full transform rounded-md py-2 px-4 font-bold text-white shadow transition duration-75 ease-in-out hover:bg-white hover:text-black active:scale-95 lg:mx-0"
																	>
																		Pay
																	</button>
																)}
															</>
														)}
													</form>
												) : null}
											</div>
										</div>
										<div className="m-4 flex max-h-[50vh] flex-1 justify-center overflow-auto border-t-2 border-gray-500 py-4 text-center md:mx-0 md:max-h-[80vh] md:border-t-0 md:border-l-2 md:px-4">
											{isSubmitSuccessful ? (
												<TwitterTweetEmbed
													key={tweetId}
													placeholder="Loading..."
													tweetId={tweetId}
												/>
											) : (
												<p className="mt-6 flex items-center text-justify text-sm leading-5 text-gray-300">
													Please connect your wallet
													and then enter the URL of
													the tweet you want to be
													raided.
													<br />4 SOL is needed for
													payment (discounts apply
													automatically if your wallet
													has UA Gen1/Gen2).
												</p>
											)}
										</div>
									</>
								)}
							</div>
						</div>
					</div>
				</main>
			</div>
		</>
	);
};

export default Home;
