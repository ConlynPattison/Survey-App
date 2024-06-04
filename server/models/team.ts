import { Schema, model } from "mongoose";

const teamSchema = new Schema({
	created_at: {
		type: Date,
		default: Date.now()
	},
	name: {
		type: String,
		required: true
	},
	owner_id: {
		type: Object,
		required: false
	},
	admin_ids: [{
		type: Object,
		required: false
	}]
});

const Team = model("Team", teamSchema);

export default Team;