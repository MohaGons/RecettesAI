"use client";

import React from 'react';

export default function Card({ 
  children, 
  className = '', 
  padding = true,
  shadow = true,
  ...props 
}) {
  return (
    <div 
      className={`
        bg-white rounded-lg overflow-hidden
        ${padding ? 'p-4' : ''}
        ${shadow ? 'shadow-sm' : ''}
        ${className}
      `} 
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ 
  children, 
  className = '',
  ...props 
}) {
  return (
    <div 
      className={`mb-4 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = '',
  ...props
}) {
  return (
    <h3 
      className={`text-lg font-semibold ${className}`} 
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardContent({
  children,
  className = '',
  ...props
}) {
  return (
    <div 
      className={className} 
      {...props}
    >
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = '',
  ...props
}) {
  return (
    <div 
      className={`mt-4 pt-4 border-t ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
}