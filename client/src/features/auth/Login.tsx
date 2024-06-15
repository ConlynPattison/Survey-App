import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "./authApiSlice";
import { setCredentials } from "./authSlice";

const Login = () => {
	const emailRef = useRef<HTMLInputElement>(null);
	const errRef = useRef<HTMLInputElement>(null);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errMsg, setErrMsg] = useState("");

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [login, { isLoading }] = useLoginMutation();

	useEffect(() => {
		emailRef.current?.focus();
	}, []);

	useEffect(() => {
		setErrMsg("");
	}, [email, password])

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		try {
			const { accessToken } = await login({ email, password }).unwrap();
			dispatch(setCredentials({ accessToken }));
			setEmail("");
			setPassword("");
			navigate("/dash");
		} catch (err: any) {
			if (!err.status) {
				setErrMsg("No server response");
			} else if (err.status === 400) {
				setErrMsg("Missing email or password");
			} else if (err.status === 401) {
				setErrMsg("Unauthorized");
			} else {
				setErrMsg(err.data?.message);
			}
			errRef.current?.focus();
		}
	}

	const handleEmailInput = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
	const handlePasswordInput = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

	if (isLoading) return (
		<p>Loading...</p>
	);

	return (
		<section>
			<header>
				<h1>Login</h1>
			</header>
			<main>
				<p ref={errRef} hidden={!errMsg} aria-live="assertive">{errMsg}</p>

				<form className="form" onSubmit={handleSubmit}>
					<label htmlFor="email">Email:</label>
					<input
						type="text"
						id="email"
						ref={emailRef}
						value={email}
						onChange={handleEmailInput}
						autoComplete="off"
						required
					/>

					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						onChange={handlePasswordInput}
						value={password}
						required
					/>
					<button>Sign In</button>
				</form>
			</main>
			<footer>
				<Link to="/">Back to Home</Link>
			</footer>
		</section >
	);
}

export default Login;
