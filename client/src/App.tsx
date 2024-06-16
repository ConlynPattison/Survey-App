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
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";

const App = () => {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				{/* public routes */}
				<Route index element={<Public />} />
				<Route path="login" element={<Login />} />

				{/* protected routes */}
				<Route element={<PersistLogin />}>
					<Route element={<RequireAuth allowedUsers={["Conlyn", "Carl"]} />}> {/* where props would be included to restrict */}
						<Route element={<Prefetch />}> {/* Subsribe to data once while within dash/protected routes */}
							<Route path="dash" element={<DashLayout />}>
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
					</Route>
				</Route>
				{/* end of protected routes */}

			</Route>
		</Routes>
	);
}

export default App;
