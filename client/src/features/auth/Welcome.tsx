import { Link } from "react-router-dom";

const Welcome = () => {
	const date = new Date();
	const today = new Intl.DateTimeFormat("en-US",
		{
			dateStyle: "full",
			timeStyle: "long"
		}
	).format(date);

	return (
		<section>
			<p>{today}</p>
			<h1>Welcome!</h1>

			<p><Link to="/dash/teams">View Teams</Link></p>
			<p><Link to="/dash/users">View Users</Link></p>

		</section>
	);
}

export default Welcome;