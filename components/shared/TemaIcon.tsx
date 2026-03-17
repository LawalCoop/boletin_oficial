'use client';

import { createElement } from 'react';
import * as LucideIcons from 'lucide-react';

// Pre-build icon cache at module level
const iconCache = new Map<string, LucideIcons.LucideIcon>();

function resolveIcon(iconName: string): LucideIcons.LucideIcon | null {
  if (iconCache.has(iconName)) {
    return iconCache.get(iconName)!;
  }
  const pascalName = iconName.split('-').map(part =>
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as any)[pascalName] as LucideIcons.LucideIcon | undefined;
  if (Icon) {
    iconCache.set(iconName, Icon);
    return Icon;
  }
  return null;
}

interface TemaIconProps {
  iconName: string;
  className?: string;
  style?: React.CSSProperties;
}

export function TemaIcon({ iconName, className = 'w-3 h-3', style }: TemaIconProps) {
  const Icon = resolveIcon(iconName);
  if (!Icon) return null;
  return createElement(Icon, { className, style });
}
