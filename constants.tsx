import React from 'react';

export const COLORS = {
  primary: '#6AA495',    // Muted Mint
  secondary: '#316263',  // Transformative Teal
  background: '#F3F0FF', // Quartz
  surface: '#FFFFFF80',  // Translucent White
  accent: '#E6E6FA',     // Lavender Web
  text: '#316263',       // Transformative Teal
  white: '#FFFFFF',
};

export const Icons = {
  Voice: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1v22M17 5v14M22 10v4M7 5v14M2 10v4" />
    </svg>
  ),
  Send: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  ),
  Back: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
};