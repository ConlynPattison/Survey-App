import { Schema, model } from "mongoose";

const teamSchema = new Schema(
	{
		name: {
			type: String,
			required: true
		},
		owner_id: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User"
		},
		admin_ids: [{
			type: Schema.Types.ObjectId,
			required: false,
			ref: "User"
		}]
	},
	{
		timestamps: true
	}
);

const Team = model("Team", teamSchema);

export default Team;