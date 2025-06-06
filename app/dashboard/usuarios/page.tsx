'use client';

import { useEffect, useState } from 'react';
import API from '@/lib/axios';
import {
  Button, Input, Modal, ModalContent,
  ModalHeader, ModalBody, ModalFooter, useDisclosure
} from '@nextui-org/react';

export default function UsuariosRegistrados() {
  const [personas, setPersonas] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formPersona, setFormPersona] = useState({
    ci: '',
    expedido: 'LP',
    nombres: '',
    paterno: '',
    materno: '',
    celular: '',
    correo: '',
    tipo_personal: '',
    nombre_unidad: ''
  });

  const generarPasswordAleatoria = () => {
    return Math.random().toString(36).slice(-8) + 'Aa1';
  };

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

  const validarFormulario = () => {
    const { ci, nombres, paterno, materno, correo, tipo_personal, nombre_unidad } = formPersona;

    const emailRegex = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;

    if (!ci || !nombres || !paterno || !materno || !correo || !tipo_personal || !nombre_unidad) {
      alert('Todos los campos son obligatorios');
      return false;
    }

    if (!emailRegex.test(correo.toLowerCase())) {
      alert('Correo electrónico inválido');
      return false;
    }

    const existe = personas.find(p =>
      p.ci === ci || p.correo.toLowerCase() === correo.toLowerCase()
    );

    if (existe) {
      alert('Ya existe un usuario con ese CI o correo');
      return false;
    }

    return true;
  };

  const handleCrearUsuario = async () => {
    if (!validarFormulario()) return;

    try {
      setLoading(true);

      const resPersona = await API.post('/persona', formPersona);
      console.log("Respuesta backend persona:", resPersona.data);

      const personaId = resPersona.data?.data?.id || resPersona.data?.id;

      if (!personaId) {
        alert('Error: ID de persona no válido');
        return;
      }

      const usuario = {
        email: formPersona.correo,
        password: generarPasswordAleatoria(),
        persona: personaId,
        roles: ['user']
      };

      await API.post('/auth/register', usuario);

      setShowSuccessModal(true);

      setFormPersona({
        ci: '',
        expedido: 'LP',
        nombres: '',
        paterno: '',
        materno: '',
        celular: '',
        correo: '',
        tipo_personal: '',
        nombre_unidad: ''
      });

      setTimeout(() => {
        setShowSuccessModal(false);
        fetchPersonas();
      }, 3000);

      onOpenChange();

    } catch (error: any) {
      console.error("Error al registrar", error);
      alert(error?.response?.data?.message?.toString() ?? 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

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
        <Button onPress={onOpen} color="primary">Crear Usuario</Button>
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
        <Button onPress={() => setCurrentPage((p) => Math.max(p - 1, 1))} isDisabled={currentPage === 1}>← Anterior</Button>
        <span>Página {currentPage} de {totalPages}</span>
        <Button onPress={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} isDisabled={currentPage === totalPages}>Siguiente →</Button>
      </div>

      {/* Modal Registro */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          <ModalHeader>Registrar Persona y Usuario</ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-2 gap-4">
              <Input label="CI" value={formPersona.ci} onChange={(e) => setFormPersona({ ...formPersona, ci: e.target.value })} />
              <Input label="Expedido" value={formPersona.expedido} onChange={(e) => setFormPersona({ ...formPersona, expedido: e.target.value })} />
              <Input label="Nombres" value={formPersona.nombres} onChange={(e) => setFormPersona({ ...formPersona, nombres: e.target.value })} />
              <Input label="Apellido Paterno" value={formPersona.paterno} onChange={(e) => setFormPersona({ ...formPersona, paterno: e.target.value })} />
              <Input label="Apellido Materno" value={formPersona.materno} onChange={(e) => setFormPersona({ ...formPersona, materno: e.target.value })} />
              <Input label="Celular" value={formPersona.celular} onChange={(e) => setFormPersona({ ...formPersona, celular: e.target.value })} />
              <Input label="Correo" value={formPersona.correo} onChange={(e) => setFormPersona({ ...formPersona, correo: e.target.value })} />
              <Input label="Unidad" value={formPersona.nombre_unidad} onChange={(e) => setFormPersona({ ...formPersona, nombre_unidad: e.target.value })} />
              <Input label="Tipo de Personal" value={formPersona.tipo_personal} onChange={(e) => setFormPersona({ ...formPersona, tipo_personal: e.target.value })} />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onOpenChange}>Cancelar</Button>
            <Button color="primary" onPress={handleCrearUsuario} isLoading={loading}>Registrar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Éxito */}
      <Modal isOpen={showSuccessModal} onOpenChange={() => setShowSuccessModal(false)} size="sm" isDismissable={false}>
        <ModalContent>
          <ModalHeader className="text-center">✅ Éxito</ModalHeader>
          <ModalBody className="text-center">
            <p>Usuario registrado correctamente.</p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}