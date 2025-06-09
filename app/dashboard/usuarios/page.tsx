'use client';

import { useEffect, useState } from 'react';
import API from '@/lib/axios';
import {
  Button, Input
} from '@nextui-org/react';
import CrearUsuarioModal from '@/app/dashboard/registro/CrearUsuarioModal';


export default function UsuariosRegistrados() {
  const [personas, setPersonas] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showCrearModal, setShowCrearModal] = useState(false);

  const fetchPersonas = async () => {
    try {
      const res = await API.get('/persona', { params: { limit: 1000 } });
      setPersonas(res.data.data.rows);
    } catch (error) {
      console.error("Error al obtener personas", error);
    }
  };

  useEffect(() => {
    fetchPersonas();
  }, []);

  const personasFiltradas = personas.filter((p) =>
    `${p.nombres} ${p.paterno} ${p.materno}`.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.ci?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.correo?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPages = Math.ceil(personasFiltradas.length / itemsPerPage);
  const paginated = personasFiltradas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Usuarios Registrados</h2>
        <Button onClick={() => setShowCrearModal(true)} color="primary">Crear Usuario</Button>
      </div>

      <Input
        placeholder="Buscar usuario"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="mb-4"
      />

      <div className="overflow-auto rounded-lg">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-default-100">
              <th className="py-2 px-4">Nombre</th>
              <th className="py-2 px-4">Tipo</th>
              <th className="py-2 px-4">Unidad</th>
              <th className="py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((persona) => (
              <tr key={persona.id} className="border-b">
                <td className="py-2 px-4">
                  <div className="font-bold">{persona.paterno} {persona.materno} {persona.nombres}</div>
                  <div className="text-sm text-gray-500">{persona.correo}</div>
                </td>
                <td className="py-2 px-4">{persona.tipo_personal}</td>
                <td className="py-2 px-4">{persona.nombre_unidad}</td>
                <td className="py-2 px-4 space-x-2">👁️ ✏️ 🗑️</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <Button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} isDisabled={currentPage === 1}>← Anterior</Button>
        <span>Página {currentPage} de {totalPages}</span>
        <Button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} isDisabled={currentPage === totalPages}>Siguiente →</Button>
      </div>

      {/* Modal Crear Usuario STEP */}
     <CrearUsuarioModal
  isOpen={showCrearModal}
  onClose={() => {
    setShowCrearModal(false);
    fetchPersonas();
  }}
/>

    </div>
  );
}
