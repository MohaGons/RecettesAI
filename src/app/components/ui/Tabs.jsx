"use client";
import React, { useState } from 'react';

export default function Tabs({ 
  tabs = [], 
  initialTab = 0, 
  onTabChange, 
  className = '',
  variant = 'underline',
  ...props 
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const handleTabChange = (index) => {
    setActiveTab(index);
    if (onTabChange) {
      onTabChange(index);
    }
  };
  
  const variants = {
    underline: {
      container: 'border-b',
      tab: (isActive) => `
        py-3 px-4 text-center
        ${isActive 
          ? 'text-primary-600 border-b-2 border-primary-600 font-medium' 
          : 'text-gray-500 hover:text-gray-700'
        }
      `,
    },
    pills: {
      container: 'flex space-x-2',
      tab: (isActive) => `
        py-2 px-4 rounded-full text-center
        ${isActive 
          ? 'bg-primary-600 text-white font-medium' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
      `,
    },
    buttons: {
      container: 'border rounded-lg flex overflow-hidden divide-x',
      tab: (isActive) => `
        py-2 px-4 text-center
        ${isActive 
          ? 'bg-primary-50 text-primary-600 font-medium' 
          : 'bg-white text-gray-600 hover:bg-gray-50'
        }
      `,
    },
  };
  
  const activeVariant = variants[variant] || variants.underline;
  
  return (
    <div className={className} {...props}>
      <div className={`flex ${activeVariant.container}`}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabChange(index)}
            className={`flex-1 transition-colors duration-200 ${activeVariant.tab(index === activeTab)}`}
          >
            {tab.icon && (
              <span className={`mr-2 ${index === activeTab ? 'text-primary-600' : 'text-gray-500'}`}>
                {tab.icon}
              </span>
            )}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
}

export function Tab({ label, icon, content }) {
  return { label, icon, content };
}