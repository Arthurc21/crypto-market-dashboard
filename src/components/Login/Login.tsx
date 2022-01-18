import React, { useEffect, useState } from 'react'
import { Input } from '../Input/Input'
import { useNavigate } from 'react-router-dom'
import { UserData } from '../../types/UserData'

interface LoginProps {
	onSubmit(userData: UserData): void
}

export const Login = ({ onSubmit }: LoginProps): React.ReactElement => {
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('')
	const [submitDisabled, setSubmitDisabled] = useState(true)
	let navigate = useNavigate()

	const handleSubmit = () => {
		console.log('onSubmit')
		const userData: UserData = {
			firstName: firstName,
			lastName: lastName,
			email: email,
			phone: phone
		}
		if (true) {
			navigate('/dashboard')
			onSubmit(userData)
		}
	}

	useEffect(() => {
		setSubmitDisabled(!(firstName.length > 0 && lastName.length > 0 && email.length > 0 && phone.length > 0))
	}, [firstName, lastName, email, phone])

	return (
		<div>
			<h2>Login</h2>
			<Input
				id="input-first-name"
				label="Name"
				value={firstName}
				required={true}
				placeholder="First"
				onChange={(value) => setFirstName(value)}
			/>
			<Input
				id="input-last-name"
				label=""
				value={lastName}
				required={true}
				placeholder="Last"
				onChange={(value) => setLastName(value)}
			/>
			<Input
				id="input-email"
				label="Email"
				value={email}
				required={true}
				placeholder="Email"
				onChange={(value) => setEmail(value)}
			/>
			<Input
				id="input-phone"
				label="Phone Number"
				value={phone}
				required={true}
				placeholder="Phone"
				onChange={(value) => setPhone(value)}
			/>
			<button onClick={() => handleSubmit()} disabled={submitDisabled}>
				Submit
			</button>
		</div>
	)
}
