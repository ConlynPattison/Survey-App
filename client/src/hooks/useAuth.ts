import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";

export interface IJwtPayload {
	UserInfo?: {
		email: string,
		firstName: string
	}
}

const useAuth = () => {
	const token = useSelector(selectCurrentToken);
	if (token) {
		const decoded = jwtDecode<IJwtPayload>(token).UserInfo;

		if (decoded) {
			const { email, firstName } = decoded;
			return { email, firstName }
		}

	}

	return {
		email: "",
		firstName: ""
	}
}

export default useAuth;