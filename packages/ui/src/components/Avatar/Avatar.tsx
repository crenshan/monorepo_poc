import { useState } from 'react';
import type { HTMLAttributes } from 'react';

import styles from './Avatar.module.css';

/** Size of an {@link Avatar}. */
export type AvatarSize = 'sm' | 'base' | 'lg' | 'xl';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * The person's name. Always required — it's both the source for the fallback
   * initials and the accessible/image alt text (unless `decorative` is set).
   */
  name: string;
  /** URL of the image to display. Falls back to initials if omitted or if the image fails to load. */
  src?: string;
  /** Size of the avatar. Defaults to `'base'`. */
  size?: AvatarSize;
  /**
   * Set when adjacent visible text already names the person, so the avatar
   * shouldn't also be announced — avoids screen readers reading the name twice.
   * When `true`, the avatar is hidden from assistive tech (`aria-hidden`, empty
   * image `alt`, no `role`/`aria-label` on the initials fallback).
   */
  decorative?: boolean;
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';

  const first = words[0]!.charAt(0);
  const last = words.length > 1 ? words[words.length - 1]!.charAt(0) : '';
  return (first + last).toUpperCase();
}

/**
 * Displays a person's picture, or their initials as a fallback when no image is
 * provided or the image fails to load. Reach for it when representing a user or
 * account in lists, headers, or comments.
 *
 * @category Data Display
 *
 * @example
 * ```tsx
 * <Avatar name="Ada Lovelace" src="/avatars/ada.jpg" size="lg" />
 * ```
 *
 * @remarks
 * By default the avatar exposes the person's name to assistive tech (`role="img"` with
 * `aria-label`, or image `alt` text); set `decorative` when nearby visible text already
 * names the person, to avoid the name being announced twice.
 */
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
