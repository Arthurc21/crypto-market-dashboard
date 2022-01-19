import React, { useEffect } from 'react'
import { StoreContext } from '../../App'
import { UserData } from '../../types/UserData'
import { Store } from '../../types/Store'
import { useNavigate } from 'react-router-dom'
import './DashboardHeader.scss'
import _ from 'lodash'

const defaultUserData: UserData = {
	firstName: '',
	lastName: '',
	email: '',
	phone: ''
}

export const DashboardHeader = (): React.ReactElement => {
	const store: Store = React.useContext(StoreContext)
	const userData = store.userData
	let navigate = useNavigate()

	useEffect(() => {
		if (_.isEqual(userData, defaultUserData)) {
			navigate('/login')
		}
	}, [navigate, userData])

	return (
		<header>
			<p>{`Welcome ${userData.firstName} ${userData.lastName}`}</p>
			<p>{`Email: ${userData.email}`}</p>
			<p>{`Phone number: ${userData.phone}`}</p>
		</header>
	)
}
