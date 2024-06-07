import { Link } from "react-router-dom";

const DashHeader = () => {
	return (
		<header>
			<div>
				<Link to="/dash/teams">
					<h1>Survey App</h1>
				</Link>
				<nav>
					{/* todo: add nav buttons */}
				</nav>
			</div>
		</header>
	);
}

export default DashHeader;