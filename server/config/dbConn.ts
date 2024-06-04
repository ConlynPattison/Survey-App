import { connect } from "mongoose";

export const connectDB = async () => {
	try {
		await connect(process.env.DATABASE_URI!);
	} catch (err) {
		console.log(err)
	}
}
