'use client';

import { useEffect, useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import {
  SearchIcon,
  PencilIcon,
  TrashIcon,
  FileTextIcon,
} from 'lucide-react';
import API from '@/lib/axios';
import ModalEditarArchivo from '@/components/ModalEditarArchivo'; // <--- IMPORTANTE

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
    tipo_respaldo?: {
      id: string;
      nombre: string;
    } | null;
  } | null;
}

export default function ListaArchivosPage() {
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const [search, setSearch] = useState('');
  const [orderAsc, setOrderAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Estado para el modal de eliminar
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [archivoAEliminar, setArchivoAEliminar] = useState<Archivo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estado para el modal de editar
  const [showEditModal, setShowEditModal] = useState(false);
  const [archivoAEditar, setArchivoAEditar] = useState<any>(null);

  const fetchArchivos = async () => {
    try {
      const res = await API.get('/archivos');
      setArchivos(res.data.data.rows);
    } catch (error) {
      console.error('Error al obtener archivos:', error);
    }
  };

  useEffect(() => {
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
    );

  const totalPages = Math.ceil(filteredArchivos.length / itemsPerPage);
  const paginatedArchivos = filteredArchivos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Abrir modal de eliminar
  const handleOpenDeleteModal = (archivo: Archivo) => {
    setArchivoAEliminar(archivo);
    setShowDeleteModal(true);
  };

  // Confirmar eliminar
  const handleConfirmDelete = async () => {
    if (!archivoAEliminar) return;

    try {
      setIsDeleting(true);

      await API.delete(`/archivos/${archivoAEliminar.id}`);

      setArchivos((prev) => prev.filter((a) => a.id !== archivoAEliminar.id));

      setShowDeleteModal(false);
      setArchivoAEliminar(null);
    } catch (error) {
      console.error('Error al eliminar archivo:', error);
      alert('Error al eliminar archivo');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 rounded-lg max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">LISTA DE ARCHIVOS</h1>
      </div>
      <Input
          className="mb-4"
          placeholder="Buscar por nombre o CI..."
          startContent={<SearchIcon size={18} />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          
        />

      <div className="overflow-auto rounded-lg">
        <table className="w-full table-fixed border-collapse text-left">
          <thead>
            <tr className="bg-blue-500 dark:bg-[#1e1e2f] text-sm font-semibold">
              <th className="py-2 px-4">Usuario</th>
              <th className="py-2 px-4">CI</th>
              <th className="py-2 px-4">Descripción</th>
              <th
                className="py-2 px-4 cursor-pointer select-none"
                onClick={() => setOrderAsc(!orderAsc)}
              >
                Fecha de Subida {orderAsc ? '🔼' : '🔽'}
              </th>
              <th className="py-2 px-4 w-[80px] text-center">Archivo</th>
              <th className="py-2 px-4 w-[120px] text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedArchivos.map((archivo) => (
              <tr key={archivo.id} className="border-b hover:bg-default-50 text-sm">
                <td className="py-2 px-4">
                  {archivo.respaldo?.persona
                    ? `${archivo.respaldo.persona.nombres} ${archivo.respaldo.persona.paterno}`
                    : '---'}
                </td>
                <td className="py-2 px-4">{archivo.respaldo?.persona?.ci ?? '---'}</td>
                <td className="py-2 px-4">{archivo.respaldo?.descripcion ?? '---'}</td>
                <td className="py-2 px-4">
                  {archivo.respaldo?.fecha
                    ? new Date(archivo.respaldo.fecha).toLocaleDateString()
                    : '---'}
                </td>
                <td className="py-2 px-4 text-center">
                  <a href={archivo.url} target="_blank" rel="noopener noreferrer" className="inline-block">
                    <FileTextIcon className="cursor-pointer text-blue-600" size={24} />
                  </a>
                </td>
                <td className="py-2 px-4">
                  <div className="flex justify-center items-center gap-2">
                    <PencilIcon
                      className="cursor-pointer"
                      size={18}
                      onClick={() => {
                        setArchivoAEditar(archivo);
                        setShowEditModal(true);
                      }}
                    />
                    <TrashIcon
                      className="cursor-pointer text-red-500"
                      size={18}
                      onClick={() => handleOpenDeleteModal(archivo)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

      {/* Modal de Confirmar Eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md text-center">
            <h2 className="text-lg font-bold mb-4">Confirmar Eliminación</h2>
            <p className="mb-6">¿Estás seguro que deseas eliminar el archivo <strong>{archivoAEliminar?.nombre}</strong>?</p>
            <div className="flex justify-center gap-4">
              <Button variant="light" onPress={() => setShowDeleteModal(false)} isDisabled={isDeleting}>
                Cancelar
              </Button>
              <Button color="danger" onPress={handleConfirmDelete} isLoading={isDeleting}>
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Editar */}
      {showEditModal && (
        <ModalEditarArchivo
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          archivo={archivoAEditar}
          onUpdate={() => {
            setShowEditModal(false);
            fetchArchivos();
          }}
        />
      )}
    </div>
  );
}
