'use client';

import { useEffect, useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import {
  SearchIcon,
  PencilIcon,
} from 'lucide-react';
import API from '@/lib/axios';
import CrearUsuarioModal from '@/app/dashboard/registro/CrearUsuarioModal';
import ModalEditarUsuario from '@/components/ModalEditarUsuario'; // Importar Modal Editar

interface Persona {
  id: string;
  ci: string;
  nombres: string;
  paterno: string;
  celular: string;
  correo: string;
  users: {
    id: string;
    email: string;
    roles: string[] | string;
  }[];
}

export default function ListaUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Persona[]>([]);
  const [search, setSearch] = useState('');
  const [orderAsc, setOrderAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Estado del modal Crear Usuario
  const [showModalCrearUsuario, setShowModalCrearUsuario] = useState(false);

  // Estado del modal Editar Usuario
  const [showModalEditarUsuario, setShowModalEditarUsuario] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState<Persona | null>(null);

  const fetchUsuarios = async () => {
    try {
      const res = await API.get('/persona', {
        params: {
          limit: 1000, // traer todos
          offset: 0,
        },
      });
      setUsuarios(res.data.data.rows);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const filteredUsuarios = usuarios
    .filter((persona) =>
      `${persona.nombres ?? ''} ${persona.paterno ?? ''} ${persona.ci ?? ''}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) =>
      orderAsc
        ? (a.nombres ?? '').localeCompare(b.nombres ?? '')
        : (b.nombres ?? '').localeCompare(a.nombres ?? '')
    );

  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);

  const paginatedUsuarios = filteredUsuarios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 rounded-lg max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">USUARIOS REGISTRADOS</h1>
        <Button
          color="primary"
          onPress={() => setShowModalCrearUsuario(true)}
        >
          Crear Usuario
        </Button>
      </div>

      <Input
        className="mb-4"
        placeholder="Buscar por nombre o CI..."
        startContent={<SearchIcon size={18} />}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1); // resetea a página 1 al buscar
        }}
      />

      <div className="overflow-auto rounded-lg">
        <table className="w-full table-fixed border-collapse text-left">
          <thead>
            <tr className="bg-blue-500 dark:bg-[#1e1e2f] text-sm font-semibold">
              <th
                className="py-2 px-4 cursor-pointer select-none"
                onClick={() => setOrderAsc(!orderAsc)}
              >
                Nombre {orderAsc ? '🔼' : '🔽'}
              </th>
              <th className="py-2 px-4">CI</th>
              <th className="py-2 px-4">Celular</th>
              <th className="py-2 px-4">Rol</th>
              <th className="py-2 px-4 w-[80px] text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsuarios.map((persona) => (
              <tr key={persona.id} className="border-b hover:bg-default-50 text-sm">
                <td className="py-2 px-4">
                  <div className="flex flex-col">
                    <span className="font-medium">{persona.nombres} {persona.paterno}</span>
                    <span className="text-xs text-gray-500">{persona.users[0]?.email ?? '---'}</span>
                  </div>
                </td>
                <td className="py-2 px-4">{persona.ci ?? '---'}</td>
                <td className="py-2 px-4">{persona.celular ?? '---'}</td>
                <td className="py-2 px-4">
                  {Array.isArray(persona.users[0]?.roles)
                    ? persona.users[0]?.roles.join(', ')
                    : persona.users[0]?.roles ?? 'Sin rol'}
                </td>
                <td className="py-2 px-4">
                  <div className="flex justify-center items-center gap-2">
                    <PencilIcon
                      className="cursor-pointer"
                      size={18}
                      onClick={() => {
                        setUsuarioAEditar(persona);
                        setShowModalEditarUsuario(true);
                      }}
                    />
                    {/* <TrashIcon
                      className="cursor-pointer text-red-500"
                      size={18}
                      onClick={() => alert(`Eliminar usuario ${persona.nombres}`)}
                    /> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-4">
        <Button
          onPress={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          isDisabled={currentPage === 1}
        >
          ← Anterior
        </Button>
        <span>Página {currentPage} de {totalPages}</span>
        <Button
          onPress={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          isDisabled={currentPage === totalPages}
        >
          Siguiente →
        </Button>
      </div>

      {/* Modal Crear Usuario */}
      {showModalCrearUsuario && (
        <CrearUsuarioModal
          isOpen={showModalCrearUsuario}
          onClose={() => {
            setShowModalCrearUsuario(false);
            fetchUsuarios(); // refresca la lista cuando se cierra el modal
          }}
        />
      )}

      {/* Modal Editar Usuario */}
      {showModalEditarUsuario && usuarioAEditar && (
        <ModalEditarUsuario
          isOpen={showModalEditarUsuario}
          onClose={() => {
            setShowModalEditarUsuario(false);
            setUsuarioAEditar(null);
            fetchUsuarios(); // refresca lista después de editar
          }}
          usuario={usuarioAEditar}
        />
      )}
    </div>
  );
}
