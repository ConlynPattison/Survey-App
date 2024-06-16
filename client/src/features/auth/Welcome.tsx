import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Welcome = () => {
	const date = new Date();
	const today = new Intl.DateTimeFormat("en-US",
		{
			dateStyle: "full",
			timeStyle: "long"
		}
	).format(date);
	const { email, firstName } = useAuth();

	return (
		<section>
			<p>{today}</p>
			<h1>Welcome {firstName}!</h1>

			<p><Link to="/dash/teams">View Teams</Link></p>
			<p><Link to="/dash/teams/new">Add New Team</Link></p>

			<p><Link to="/dash/users">View Users</Link></p>
			<p><Link to="/dash/users/new">Add New User</Link></p>

		</section>
	);
}

export default Welcome;
