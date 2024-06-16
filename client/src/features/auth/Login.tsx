import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "./authApiSlice";
import { setCredentials } from "./authSlice";
import usePersist from "../../hooks/usePersist";

const Login = () => {
	const emailRef = useRef<HTMLInputElement>(null);
	const errRef = useRef<HTMLInputElement>(null);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errMsg, setErrMsg] = useState("");
	const [persist, setPersist] = usePersist();

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
	const handleToggle = () => setPersist((prev: any) => !prev); // todo:

	if (isLoading) return (
		<p>Loading...</p>
	);

	return (
		<section>
			<header>
				<h1>Login</h1>
			</header>
			<main className="ml-auto mr-auto w-fit">
				<p ref={errRef} hidden={!errMsg} aria-live="assertive">{errMsg}</p>

				<form className="card w-96" onSubmit={handleSubmit}>
					<label className="form-control w-full" htmlFor="email">
						<div className="label">
							<span className="label-text">Email:</span>
						</div>
						<input
							className="input input-bordered w-full"
							type="text"
							id="email"
							ref={emailRef}
							value={email}
							onChange={handleEmailInput}
							autoComplete="off"
							required
						/>
					</label>

					<label
						className="form-control w-full mt-5"
						htmlFor="password"
					>
						<div className="label">
							<span className="label-text">Password:</span>
						</div>
						<input
							className="input input-bordered w-full"
							type="password"
							id="password"
							onChange={handlePasswordInput}
							value={password}
							required
						/>
					</label>

					<button className="btn btn-primary mt-10">Sign In</button>

					<div className="form-control">
						<label className="label cursor-pointer">
							<span className="label-text">Trust This Device</span>
							<input
								className="checkbox"
								type="checkbox"
								id="persist"
								onChange={handleToggle}
								checked={persist}
							/>
						</label>
					</div>

				</form>
			</main>
			<footer>
				<Link to="/">Back to Home</Link>
			</footer>
		</section >
	);
}

export default Login;
