import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import UsersList from "./features/users/UsersList";
import TeamsList from "./features/teams/TeamsList";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Public />} />
				<Route path="login" element={<Login />} />
				<Route path="dash" element={<DashLayout />}>
					{/* todo: protected routes will go here */}
					<Route index element={<Welcome />} />

					<Route path="teams">
						<Route index element={<TeamsList />} />
					</Route>

					<Route path="users">
						<Route index element={<UsersList />} />
						<Route path=":id" element={<EditUser />} />
						<Route path="new" element={<NewUserForm />} />
					</Route>
				</Route>
			</Route>
		</Routes>
	);
}

export default App
