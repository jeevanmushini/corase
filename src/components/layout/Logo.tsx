"use client";

import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <svg 
            viewBox="0 0 100 100" 
            className={className} 
            fill="currentColor" 
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Recreating the stylized geometric C based on the provided image */}
            <path d="M75 15 L25 15 L10 40 L25 85 L75 85 L90 60 L75 60 L65 75 L30 75 L20 40 L30 25 L65 25 L75 40 L45 40 L45 55 L90 55 L90 40 L75 15 Z" />
        </svg>
    );
};

export default Logo;
