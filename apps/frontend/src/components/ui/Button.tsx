import React from 'react';

type Variant = 'primary' | 'secondary' | 'back' | 'ghost' | 'link';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
  as?: 'button' | 'a';
};

export default function Button({ variant = 'primary', size = 'md', className = '', children, ...rest }: Props) {
  const variantClass = variant === 'back' ? 'landing-back-btn' : variant === 'secondary' ? 'nav-auth-button' : variant === 'link' ? 'link-button' : '';
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';

  const cls = [variantClass, sizeClass, className].filter(Boolean).join(' ');

  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}
