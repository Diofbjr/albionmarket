'use client';

import { Server } from './lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  server: Server;
  onChange: (server: Server) => void;
}

export default function ServerSelect({ server, onChange }: Props) {
  return (
    <Select value={server} onValueChange={(value) => onChange(value as Server)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione o servidor" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="west">West (Américas)</SelectItem>
        <SelectItem value="east">East (Ásia)</SelectItem>
        <SelectItem value="europe">Europe</SelectItem>
      </SelectContent>
    </Select>
  );
}