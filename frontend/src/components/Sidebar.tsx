import React, { useState, ChangeEvent } from 'react';

const sections = ['all', 'saved', 'shortlisted', 'ignored'];

interface SidebarProps {
  filterBySection: (section: string) => void
}

function Sidebar({ filterBySection }: SidebarProps) {
  const [ section, setSection ] = useState('All')

  const onSectionChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setSection(event.currentTarget.value)
    filterBySection(section);
  }

  return <div className="sidebar">
    { sections.map((option: string) => {
      return <label key={option} className="sidebar-item"><input type="radio" name="section" checked={section === option} onChange={onSectionChanged} value={option}/> {option}</label>
    })}
  </div>
};

export default Sidebar;
