'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ServerSelect from '../ServerSelect/ServerSelect';
import SearchBar from '../SearchBar/SearchBar';
import { Server } from '@/components/lib/api';

interface MarketHeaderProps {
  server: Server;
  setServer: (server: Server) => void;
  setSelectedItem: (item: string) => void;
}

export default function MarketHeader({ server, setServer, setSelectedItem }: MarketHeaderProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
      <ServerSelect server={server} onChange={setServer} />
      <Card className="md:col-span-2 shadow-sm border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Buscar Item</CardTitle>
          <CardDescription>Procure por armas, armaduras ou materiais do Albion Online</CardDescription>
        </CardHeader>
        <CardContent>
          <SearchBar onItemSelected={setSelectedItem} />
        </CardContent>
      </Card>
    </div>
  );
}