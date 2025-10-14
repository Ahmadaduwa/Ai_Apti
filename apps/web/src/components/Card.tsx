import { type HTMLAttributes, type PropsWithChildren } from 'react';
import clsx from 'clsx';

// Allow passing any standard div props (like className, id, etc.)
type CardProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export function Card({ children, className, ...props }: CardProps) {
  // Use clsx to merge default classes with any custom classes passed in
  const cardClasses = clsx('card', className);
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ children, className, ...props }: CardProps) {
  const bodyClasses = clsx('card-body', className);
  return (
    <div className={bodyClasses} {...props}>
      {children}
    </div>
  );
}