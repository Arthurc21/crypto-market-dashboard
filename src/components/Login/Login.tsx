import React from 'react'
import { Input } from '../Input/Input'

export const Login = (): React.ReactElement => {
    return (
        <div>
            <h2>Login</h2>
            <Input 
            id='input-name'
            label='Name'
            value=''
            required={true}
            placeholder='name'
            />
        </div>
    )
}