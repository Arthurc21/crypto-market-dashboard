import React, { useEffect } from 'react'
import { Store, StoreContext } from '../../App'
import { UserData } from '../../types/UserData'
import _ from 'lodash'
import { useNavigate } from 'react-router-dom'

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
	}, [])

	return <span>{userData.firstName}</span>
}
