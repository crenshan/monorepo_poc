import type { SVGAttributes } from 'react';

import { icons } from './icons';
import type { IconName } from './icons';
import styles from './Icon.module.css';

export type { IconName };
export type IconSize = 'sm' | 'base' | 'lg' | 'xl';

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: IconSize;
  // When provided, the icon becomes an accessible image with this as its name.
  // Omitted (the default) means the icon is decorative and hidden from assistive tech.
  title?: string;
}

export function Icon({ name, size = 'base', title, className, ...props }: IconProps) {
  const classes = [styles['ds-icon'], styles[`ds-icon--${size}`], className]
    .filter(Boolean)
    .join(' ');

  return (
    <svg
      className={classes}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title && <title>{title}</title>}
      {icons[name]}
    </svg>
  );
}
