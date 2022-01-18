import React, { useState, useEffect, forwardRef } from 'react'
import './Input.scss'

interface InputProps {
	id: string
	label: string
	labelPosition?: 'left' | 'top'
	value: string
	required?: boolean
	placeholder?: string
	short?: boolean
	onChange(value: string): void
	errorMessage?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			id,
			label = '',
			labelPosition = 'top',
			value,
			required = false,
			placeholder,
			short = false,
			onChange,
			errorMessage
		},
		ref?
	) => {
		const elementId = `${id}-input`

		return (
			<div className={`input label-position-${labelPosition}`}>
				<div className={`label-container position-${labelPosition}`}>
					<label className="input-label" htmlFor={elementId}>
						{label}
					</label>
					{required && <div className="required-icon">&nbsp;*</div>}
				</div>
				<div className="input-container">
					<div className="input-wrapper">
						<input
							className={short ? 'short' : ''}
							ref={ref}
							type="text"
							value={value}
							placeholder={placeholder}
							onChange={(e) => onChange(e.target.value)}
						/>
					</div>
					<div className="error-message-container">
						<p className="error-message">{errorMessage}</p>
					</div>
				</div>
			</div>
		)
	}
)
