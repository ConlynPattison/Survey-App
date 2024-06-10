import { useNavigate } from "react-router-dom";
import { useAddNewUserMutation } from "./usersApiSlice";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { getQueryErrorMessage } from "../../app/api/apiUtil";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^[A-Za-z0-9!@#$%]{4,12}$/;

const NewUserForm = () => {
	const [addNewUser, {
		isLoading,
		isSuccess,
		isError,
		error
	}] = useAddNewUserMutation();

	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [validEmail, setValidEmail] = useState(false);
	const [password, setPassword] = useState("");
	const [validPassword, setValidPassword] = useState(false);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");

	useEffect(() => {
		setValidEmail(EMAIL_REGEX.test(email));
	}, [email]);

	useEffect(() => {
		setValidPassword(PASSWORD_REGEX.test(password));
	}, [password]);

	useEffect(() => {
		if (isSuccess) {
			setEmail("");
			setPassword("");
			setFirstName("");
			setLastName("");
			navigate("/dash/users")
		}
	}, [isSuccess]);

	const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target?.value);
	const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target?.value);
	const onFirstNameChange = (e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target?.value);
	const onLastNameChange = (e: ChangeEvent<HTMLInputElement>) => setLastName(e.target?.value);

	const canSave = validEmail && validPassword && !isLoading;

	const onSaveUserClicked = async (e: FormEvent) => {
		e.preventDefault();
		if (canSave) {
			await addNewUser({ email, password, firstName, lastName });
		}
	}

	return (
		<>
			<p>{getQueryErrorMessage(isError, error)}</p>

			<form onSubmit={onSaveUserClicked}>
				<div >
					<h2>New User</h2>
					<div>
						<button
							title="Save"
							disabled={!canSave}
							type="submit"
						> Save
						</button>
					</div>
				</div>
				<label htmlFor="email">
					Email: <span>[3-20 letters]</span></label>
				<input
					id="email"
					name="email"
					type="email"
					autoComplete="off"
					value={email}
					onChange={onEmailChange}
				/>

				<label htmlFor="password">
					Password: <span>[4-12 chars incl. !@#$%]</span></label>
				<input
					id="password"
					name="password"
					type="password"
					value={password}
					onChange={onPasswordChange}
				/>

				<label htmlFor="first-name">
					First Name: </label>
				<input
					id="first-name"
					name="first-name"
					type="text"
					value={firstName}
					onChange={onFirstNameChange}
				/>

				<label htmlFor="last-name">
					Last Name: </label>
				<input
					id="last-name"
					name="last-name"
					type="text"
					value={lastName}
					onChange={onLastNameChange}
				/>

			</form>
		</>
	);
}

export default NewUserForm;
