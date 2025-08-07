'use client';

import {
  Select,
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
import { Server, ServerSelectProps } from '../../types/types';
import ServerSelectContent from './ServerSelectContent';

export default function ServerSelect({ server, onChange }: ServerSelectProps) {
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
          <ServerSelectContent />
        </Select>
      </CardContent>
    </Card>
  );
}