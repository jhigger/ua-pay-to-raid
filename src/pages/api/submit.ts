import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
	clusterApiUrl,
	Connection,
	LAMPORTS_PER_SOL,
	PublicKey,
	SystemProgram,
	Transaction,
} from "@solana/web3.js";
import axios from "axios";
import BigNumber from "bignumber.js";
import { type NextApiRequest, type NextApiResponse } from "next";
import { shopAddress } from "../../lib/address";
import { prisma } from "../../server/db/client";

const submit = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		if (req.method === "POST") {
			// Process a POST request
			const { reference, address, tweetUrl, tweetId, saveToDb } =
				req.body;

			const hasDiscount = await axios
				.get(
					`https://api-mainnet.magiceden.dev/v2/wallets/${address}/tokens?listStatus=unlisted`
				)
				.then((res) => {
					const collections = ["utility_ape", "utility_ape_gen_2"];
					const arr: [] = res.data;
					return arr.some(
						({ collection }: { collection: string }) => {
							return collections.includes(collection);
						}
					);
				});

			const payment = hasDiscount ? 3 : 4;

			if (saveToDb) {
				await prisma.raid.create({
					data: {
						reference,
						address,
						tweetUrl,
						tweetId,
						payment,
					},
				});

				return res.status(200).json({ message: "saved to db" });
			}

			const { transaction, message } = await pay(
				reference,
				address,
				payment
			);

			res.status(200).json({ transaction, message });
		} else {
			// Handle any other HTTP method
			res.status(200).json({ name: "Hello, world!" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

const pay = async (reference: string, address: string, payment: number) => {
	const buyerPublicKey = new PublicKey(address);
	const sellerPublicKey = shopAddress;

	const network = WalletAdapterNetwork.Mainnet;
	const endpoint = clusterApiUrl(network);
	const connection = new Connection(endpoint);

	// Get a recent blockhash to include in the transaction
	const { blockhash } = await connection.getLatestBlockhash("finalized");

	const transaction = new Transaction({
		recentBlockhash: blockhash,
		// The buyer pays the transaction fee
		feePayer: buyerPublicKey,
	});

	// Create the instruction to send SOL from the buyer to the shop
	const transferInstruction = SystemProgram.transfer({
		fromPubkey: buyerPublicKey,
		lamports: new BigNumber(payment)
			.multipliedBy(LAMPORTS_PER_SOL)
			.toNumber(),
		toPubkey: sellerPublicKey,
	});

	// Add the reference to the instruction as a key
	// This will mean this transaction is returned when we query for the reference
	transferInstruction.keys.push({
		pubkey: new PublicKey(reference),
		isSigner: false,
		isWritable: false,
	});

	// Add the instruction to the transaction
	transaction.add(transferInstruction);

	// Serialize the transaction and convert to base64 to return it
	const serializedTransaction = transaction.serialize({
		// We will need the buyer to sign this transaction after it's returned to them
		requireAllSignatures: false,
	});

	const base64Transaction = serializedTransaction.toString("base64");
	const message = "Thank you for your purchase of Pay To Raid";
	return {
		transaction: base64Transaction,
		message,
	};
};

export default submit;
