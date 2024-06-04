import { Schema, model } from "mongoose";

const surveySchema = new Schema(
	{
		title: {
			type: String,
			required: true
		},
		archived: {
			type: Boolean,
			default: false
		},
		team_id: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "Team"
		}
	},
	{
		timestamps: true
	}
);

const Survey = model("Survey", surveySchema);

export default Survey;