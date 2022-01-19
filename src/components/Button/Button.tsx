import React from 'react'
import './Button.scss'

interface ButtonProps {
	id: string
	text: string
	onClick(event: React.MouseEvent<HTMLButtonElement>): void
	disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({ id, text, onClick, disabled }: ButtonProps) => {
	return (
		<button
			id={id}
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
