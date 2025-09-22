import React, { useState, useRef, useEffect, useId } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}

const ArrowDropDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M7 10l5 5 5-5H7z"/><path d="M0 0h24v24H0V0z" fill="none"/></svg>;

const Select: React.FC<SelectProps> = ({ label, value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="select-container" ref={containerRef}>
      <button
        type="button"
        className="select-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={labelId}
      >
        <span id={labelId}>{selectedOption?.label || label}</span>
        <ArrowDropDownIcon />
      </button>
      {isOpen && (
        <ul className="select-options" role="listbox">
          {options.map(option => (
            <li
              key={option.value}
              className="select-option"
              onClick={() => handleOptionClick(option.value)}
              role="option"
              aria-selected={value === option.value}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
