import React, { useState, useEffect, forwardRef } from 'react'
import './Input.scss'

interface InputProps {
	id: string
	label: string
	value: string
	required?: boolean
	placeholder?: string
	onChange(value: string): void
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ id, label, value, required = false, placeholder, onChange }, ref?) => {
		const elementId = `${id}-input`

		return (
			<div className="input">
				<div className="label-container">
					<label className="input-label" htmlFor={elementId}>
						{label}
					</label>
					{required && <div className="required-icon">&nbsp;*</div>}
				</div>
				<div className="input-container">
					<input
						type="text"
						value={value}
						placeholder={placeholder}
						onChange={(e) => onChange(e.target.value)}
					/>
				</div>
			</div>
		)
	}
)
