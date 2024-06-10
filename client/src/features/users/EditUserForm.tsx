import { useNavigate } from "react-router-dom";
import { User, useDeleteUserMutation, useUpdateUserMutation } from "./usersApiSlice";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { getQueryErrorMessage } from "../../app/api/apiUtil";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^[A-Za-z0-9!@#$%]{4,12}$/;

const EditUserForm = ({ user }: { user: User }) => {
	// todo: revist to decide if renaming these vars would be good
	const [updateUser, {
		isLoading,
		isSuccess,
		isError,
		error
	}] = useUpdateUserMutation();

	const [deleteUser, {
		isSuccess: isDeleteSuccess,
		isError: isDeleteError,
		error: deleteError
	}] = useDeleteUserMutation();

	const navigate = useNavigate();

	const [email, setEmail] = useState(user.email);
	const [validEmail, setValidEmail] = useState(false);
	const [password, setPassword] = useState("");
	const [validPassword, setValidPassword] = useState(false);
	const [firstName, setFirstName] = useState(user.first_name);
	const [lastName, setLastName] = useState(user.last_name);

	useEffect(() => {
		setValidEmail(EMAIL_REGEX.test(email));
	}, [email]);

	useEffect(() => {
		setValidPassword(PASSWORD_REGEX.test(password));
	}, [password]);

	useEffect(() => {
		if (isDeleteSuccess || isSuccess) {
			setEmail("");
			setPassword("");
			setFirstName("");
			setLastName("");
			navigate("/dash/users");
		}
	});

	const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target?.value);
	const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target?.value);
	const onFirstNameChange = (e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target?.value);
	const onLastNameChange = (e: ChangeEvent<HTMLInputElement>) => setLastName(e.target?.value);

	const onSaveUserClicked = async (e: FormEvent) => {
		if (password) { // password resubmission not required by api
			await updateUser({ id: user.id, email, password, firstName, lastName });
		} else {
			await updateUser({ id: user.id, email, firstName, lastName })
		}
	}

	const onDeleteUserClicked = async () => {
		await deleteUser({ id: user.id })
	}

	const canSave = password
		? validEmail && validPassword && !isLoading
		: validEmail && !isLoading;

	const errorContent = (
		getQueryErrorMessage(isError, error) || getQueryErrorMessage(isDeleteError, deleteError)
	) ?? "";

	return (
		<>
			<p>{errorContent}</p>

			<form onSubmit={e => e.preventDefault()}>
				<div >
					<h2>New User</h2>
					<div>
						<button
							title="Save"
							disabled={!canSave}
							onClick={onSaveUserClicked}
						> Save
						</button>
						<button
							title="Delete"
							onClick={onDeleteUserClicked}
						> Delete
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

export default EditUserForm;
