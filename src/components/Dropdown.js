// src/components/Dropdown.js
import React, { useState } from 'react';

const Dropdown = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none"
      >
        {typeof title === 'string' ? (
          <span>{title}</span>
        ) : (
          title
        )}
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-blue-800 rounded-md shadow-lg z-10">
          <ul className="py-1">
            {items.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="block px-4 py-2 text-white hover:bg-blue-700"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
