import React, { useState, ChangeEvent } from 'react';

const sections = ['all', 'saved', 'shortlisted', 'ignored'];

interface SidebarProps {
  onSectionChange: (section: string) => void
}

function Sidebar({ onSectionChange }: SidebarProps) {
  const [ section, setSection ] = useState('all')

  const onSectionChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget
    setSection(value)
    onSectionChange(value);
  }

  return <div className="sidebar">
    { sections.map((option: string) => {
      return <label htmlFor={option} key={option} className="sidebar-item">
        <input type="radio" id={option} name="section" checked={section === option} onChange={onSectionChanged} value={option}/> {option}
      </label>
    })}
  </div>
};

export default Sidebar;
