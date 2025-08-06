'use client';

import { Server } from './lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Props {
  server: Server;
  onChange: (server: Server) => void;
}

export default function ServerSelect({ server, onChange }: Props) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Servidor</CardTitle>
        <CardDescription>Selecione o servidor de Albion Online.</CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={server} onValueChange={(value) => onChange(value as Server)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o servidor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="west">West (Américas)</SelectItem>
            <SelectItem value="east">East (Ásia)</SelectItem>
            <SelectItem value="europe">Europe</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}