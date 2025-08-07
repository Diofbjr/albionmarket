'use client';

import {
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export default function ServerSelectContent() {
  return (
    <SelectContent>
      <SelectItem value="west">West (Américas)</SelectItem>
      <SelectItem value="east">East (Ásia)</SelectItem>
      <SelectItem value="europe">Europe</SelectItem>
    </SelectContent>
  );
}