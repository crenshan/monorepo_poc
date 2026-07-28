import { useState } from 'react';
import type { HTMLAttributes } from 'react';

import styles from './Avatar.module.css';

export type AvatarSize = 'sm' | 'base' | 'lg' | 'xl';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  // Always required — it's both the fallback source (initials) and the image alt text.
  name: string;
  src?: string;
  size?: AvatarSize;
  // Set when adjacent visible text already names the person, so the avatar
  // shouldn't also be announced — avoids screen readers reading the name twice.
  decorative?: boolean;
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';

  const first = words[0]!.charAt(0);
  const last = words.length > 1 ? words[words.length - 1]!.charAt(0) : '';
  return (first + last).toUpperCase();
}

export function Avatar({
  name,
  src,
  size = 'base',
  decorative = false,
  className,
  ...props
}: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const classes = [styles['ds-avatar'], styles[`ds-avatar--${size}`], className]
    .filter(Boolean)
    .join(' ');
  const showImage = Boolean(src) && !imageFailed;

  return (
    <span className={classes} aria-hidden={decorative || undefined} {...props}>
      {showImage ? (
        <img
          className={styles['ds-avatar__image']}
          src={src}
          alt={decorative ? '' : name}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span
          className={styles['ds-avatar__initials']}
          role={decorative ? undefined : 'img'}
          aria-label={decorative ? undefined : name}
        >
          {getInitials(name)}
        </span>
      )}
    </span>
  );
}
