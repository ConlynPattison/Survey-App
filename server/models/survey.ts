import { Schema, model } from "mongoose";

const surveySchema = new Schema({
	created_at: {
		type: Date,
		default: Date.now()
	},
	last_edited: {
		type: Date,
		default: Date.now()
	},
	name: {
		type: String,
		required: true
	},
	archived: {
		type: Boolean,
		default: false
	},
	team_id: {
		type: Object,
		required: true
	}
});

const Survey = model("Survey", surveySchema);

export default Survey;