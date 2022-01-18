import React from 'react'
import './Button.scss'

interface ButtonProps {
	text: string
	onClick(event: React.MouseEvent<HTMLButtonElement>): void
	disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({ text, onClick, disabled }: ButtonProps) => {
	return (
		<button
			className="button"
			onClick={(event) => {
				onClick(event)
			}}
			disabled={disabled}
		>
			<span className="text-wrapper">{text}</span>
		</button>
	)
}
