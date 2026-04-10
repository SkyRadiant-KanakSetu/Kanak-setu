import type { ReactNode } from 'react';

export function KsButton(props: {
  children: ReactNode;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const {
    children,
    type = 'button',
    variant = 'primary',
    disabled,
    onClick,
    className = '',
  } = props;
  const base =
    'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50';
  const styles =
    variant === 'primary'
      ? 'bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500'
      : 'bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-400';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function KsCard(props: { title?: string; children: ReactNode; className?: string }) {
  const { title, children, className = '' } = props;
  return (
    <div className={`rounded-lg border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      {title ? <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2> : null}
      {children}
    </div>
  );
}
