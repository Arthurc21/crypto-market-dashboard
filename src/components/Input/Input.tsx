import React, { useState, useEffect, forwardRef } from 'react'
import './index.scss'

interface InputProps {
	id: string
	label: string
	value: string
	required?: boolean
	placeholder?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ id, label, value, required = false, placeholder }, ref?) => {
		const elementId = `${id}-input`
		return (
			<div className="input">
				<div className="label-container">
					<label className="input-label" htmlFor={elementId}>
                        {label}
                    </label>
                    {required && <div className='required-icon'>&nbsp;*</div>}
				</div>
                <div>
                    <input
                        type="text"
                        value={value}
                        placeholder={placeholder}
                    />
                </div>
			</div>
		)
	}
)
