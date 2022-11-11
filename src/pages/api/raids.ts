import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";

const raids = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		if (req.method === "GET") {
			// Process a GET request
			const raids = await prisma.raid.findMany();

			res.status(200).json({ raids });
		} else {
			// Handle any other HTTP method
			res.status(200).json({ name: "Hello, world!" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

export default raids;
