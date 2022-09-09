import React, { PropsWithChildren } from 'react';
import classnames from 'classnames';

const BaseCard: React.FC<
  PropsWithChildren<{
    loading?: boolean;
    className?: string;
    title?: string;
    description?: string;
  }>
> = ({
  className = '',
  children,
  loading = false,
  title = '',
  description = '',
}) => {
  const cls = classnames(className, 'rounded-lg bg-white p-6 drop-shadow-sm');

  if (loading) {
    return <div className={classnames(cls, 'p-10')}>loading...</div>;
  }

  return (
    <div className={cls}>
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      <p className="mb-4 text-sm">{description}</p>
      {children}
    </div>
  );
};

export default BaseCard;