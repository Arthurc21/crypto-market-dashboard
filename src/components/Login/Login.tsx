import React, { useEffect, useState } from 'react'
import { Input } from '../Input/Input'
import { useNavigate } from 'react-router-dom'
import { UserData } from '../../types/UserData'
import './Login.scss'
import { Button } from '../Button/Button'

interface LoginProps {
	onSubmit(userData: UserData): void
}

export const Login = ({ onSubmit }: LoginProps): React.ReactElement => {
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('')
	const [emailErrorMessage, setEmailErrorMessage] = useState<string>()
	const [phoneErrorMessage, setPhoneErrorMessage] = useState<string>()
	const [submitDisabled, setSubmitDisabled] = useState(true)
	const emailValidation = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'i')
	const numberValidation = new RegExp(/^\d{10}$/)
	let navigate = useNavigate()

	const validateFields = (): boolean => {
		let invalidFields = false
		if (!emailValidation.test(email)) {
			setEmailErrorMessage('Email not valid')
			invalidFields = true
		} else setEmailErrorMessage(undefined)
		if (!numberValidation.test(phone)) {
			setPhoneErrorMessage('Phone number not valid, please make sure it is a 10 digit number')
			invalidFields = true
		} else setPhoneErrorMessage(undefined)
		return !invalidFields
	}

	const handleSubmit = () => {
		const userData: UserData = {
			firstName: firstName,
			lastName: lastName,
			email: email,
			phone: phone
		}
		if (validateFields()) {
			navigate('/dashboard')
			onSubmit(userData)
		}
	}

	useEffect(() => {
		setSubmitDisabled(!(firstName.length > 0 && lastName.length > 0 && email.length > 0 && phone.length > 0))
	}, [firstName, lastName, email, phone])

	return (
		<div className="login-container">
			<h1>Welcome</h1>
			<p>Please enter the requested data</p>
			<div className="input-wrapper name-container">
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
					placeholder="Last"
					onChange={(value) => setLastName(value)}
				/>
			</div>
			<div className="input-wrapper">
				<Input
					id="input-email"
					label="Email"
					value={email}
					required={true}
					placeholder="Email"
					onChange={(value) => setEmail(value)}
					errorMessage={emailErrorMessage}
				/>
			</div>
			<div className="input-wrapper">
				<Input
					id="input-phone"
					label="Phone Number"
					value={phone}
					required={true}
					placeholder="Phone"
					onChange={(value) => setPhone(value)}
					errorMessage={phoneErrorMessage}
				/>
			</div>
			<div className="button-wrapper">
				<Button text="Continue" onClick={() => handleSubmit()} disabled={submitDisabled} />
			</div>
		</div>
	)
}
