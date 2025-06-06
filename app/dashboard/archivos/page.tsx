'use client';

import { useEffect, useState } from 'react';
import { Input } from '@nextui-org/react';
import {
  SearchIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  FileTextIcon,
} from 'lucide-react';
import API from '@/lib/axios';

interface Archivo {
  id: string;
  nombre: string;
  url: string;
  extension: string;
  tamaño: number;
  respaldo: {
    id: string;
    descripcion: string;
    fecha: string;
    persona: {
      id: string;
      ci: string;
      nombres: string;
      paterno: string;
    } | null;
  } | null;
}

export default function ListaArchivosPage() {
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const [search, setSearch] = useState('');
  const [orderAsc, setOrderAsc] = useState(true);

  useEffect(() => {
    const fetchArchivos = async () => {
      try {
        const res = await API.get('/archivos');
        console.log('Archivos obtenidos:', res.data.data.rows);
        setArchivos(res.data.data.rows);
      } catch (error) {
        console.error('Error al obtener archivos:', error);
      }
    };

    fetchArchivos();
  }, []);

  const filteredArchivos = archivos
    .filter((archivo) =>
      `${archivo.respaldo?.persona?.nombres ?? ''} ${archivo.respaldo?.persona?.paterno ?? ''} ${archivo.respaldo?.persona?.ci ?? ''}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) =>
  orderAsc
    ? new Date(a.respaldo?.fecha ?? 0).getTime() - new Date(b.respaldo?.fecha ?? 0).getTime()
    : new Date(b.respaldo?.fecha ?? 0).getTime() - new Date(a.respaldo?.fecha ?? 0).getTime()
)


  return (
    <div className="p-6 bg-white dark:bg-black rounded-lg shadow-md max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Listado de Archivos PDF</h1>
        <Input
          className="w-72"
          placeholder="Buscar por nombre o CI..."
          startContent={<SearchIcon size={18} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-default-100 text-left text-sm font-semibold">
            <th className="p-3">Usuario</th>
            <th className="p-3">CI</th>
            <th className="p-3">Descripción</th>
            <th
              className="p-3 cursor-pointer select-none"
              onClick={() => setOrderAsc(!orderAsc)}
            >
              Fecha de Subida {orderAsc ? '🔼' : '🔽'}
            </th>
            <th className="p-3">Archivo</th>
            <th className="p-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredArchivos.map((archivo) => (
            <tr
              key={archivo.id}
              className="border-b border-default-200 hover:bg-default-50 text-sm"
            >
              <td className="p-3">
                {archivo.respaldo?.persona
                  ? `${archivo.respaldo.persona.nombres} ${archivo.respaldo.persona.paterno}`
                  : '---'}
              </td>
              <td className="p-3">{archivo.respaldo?.persona?.ci ?? '---'}</td>
              <td className="p-3">{archivo.respaldo?.descripcion ?? '---'}</td>
              <td className="p-3">{archivo.respaldo?.fecha? new Date(archivo.respaldo.fecha).toLocaleDateString(): '---'}
              </td>
              <td className="p-3 flex items-center gap-2 text-blue-600">
                <FileTextIcon size={18} />
                <span>{archivo.nombre}</span>
              </td>
              <td className="p-3 flex justify-center gap-3 text-default-600">
                <a
                  href={archivo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <EyeIcon className="cursor-pointer" size={18} />
                </a>
                <PencilIcon className="cursor-pointer" size={18} />
                <TrashIcon
                  className="cursor-pointer text-red-500"
                  size={18}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
