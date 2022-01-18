import React from 'react'
import './Tab.scss'

interface TabProps {
	text: string
	value: string
	onClick(value: string): void
	selected: boolean
}

export const Tab: React.FC<TabProps> = ({ text, value, onClick, selected = false }: TabProps) => {
	return (
		<div className={`tab ${selected ? 'selected' : ''}`} onClick={() => onClick(value)}>
			<div className="span-wrapper">
				<span>{text}</span>
			</div>
		</div>
	)
}
