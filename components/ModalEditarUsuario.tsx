'use client';

import { Input, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import API from '@/lib/axios';

export default function ModalEditarUsuario({ isOpen, onClose, usuario }: any) {
  const [formData, setFormData] = useState({
    nombres: '',
    paterno: '',
    materno: '',
    celular: '',
    correo: '',
    expedido: '',
    roles: '',
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombres: usuario?.nombres || '',
        paterno: usuario?.paterno || '',
        materno: usuario?.materno || '',
        celular: usuario?.celular || '',
        correo: usuario?.correo || '',
        expedido: usuario?.expedido || '',
        roles: Array.isArray(usuario?.users?.[0]?.roles)
          ? usuario?.users?.[0]?.roles[0]
          : usuario?.users?.[0]?.roles || '',
      });
    }
  }, [usuario]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Validación mínima
      if (!formData.nombres.trim() || !formData.correo.trim()) {
        alert('Por favor complete los campos obligatorios (Nombres y Correo).');
        return;
      }

      // PATCH /persona/:id
      const resPersona = await API.patch(`/persona/${usuario.id}`, {
        nombres: formData.nombres,
        paterno: formData.paterno,
        materno: formData.materno,
        celular: formData.celular,
        correo: formData.correo,
        expedido: formData.expedido,
      });

      console.log('🟢 Respuesta PATCH /persona:', resPersona.data);

      // PATCH /auth/users/:id → solo si hay usuario
      if (usuario.users?.[0]?.id) {
        console.log('🟡 Enviando PATCH /auth/users:', {
          roles: [formData.roles],
        });

        const resRoles = await API.patch(`/auth/users/${usuario.users[0].id}`, {
          roles: [formData.roles],
        });

        console.log('🟢 Respuesta PATCH /auth/users:', resRoles.data);
      }

      // Mostrar modal de éxito bonito
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error('🔴 Error al actualizar usuario:', error);

      if (error.response) {
        console.error('🔴 Respuesta de error:', error.response.data);
        alert(`Error al actualizar usuario: ${error.response.data.message ?? ''}`);
      } else {
        alert('Error al actualizar usuario');
      }
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="md" backdrop="blur">
        <ModalContent>
          <ModalHeader>Editar Usuario</ModalHeader>
          <ModalBody>
            <Input
              label="Nombres"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
            />
            <Input
              label="Apellido Paterno"
              name="paterno"
              value={formData.paterno}
              onChange={handleChange}
            />
            <Input
              label="Apellido Materno"
              name="materno"
              value={formData.materno}
              onChange={handleChange}
            />
            <Input
              label="Celular"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
            />
            <Input
              label="Correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
            />
            <div>
              <label className="block font-medium mb-1">Expedido</label>
              <select
                name="expedido"
                value={formData.expedido}
                onChange={handleChange}
                className="w-full p-2 rounded-md border dark:bg-gray-900 dark:border-gray-700"
              >
                <option value="">Seleccione un expedido</option>
                <option value="LP">LP - La Paz</option>
                <option value="CB">CB - Cochabamba</option>
                <option value="SC">SC - Santa Cruz</option>
                <option value="OR">OR - Oruro</option>
                <option value="PT">PT - Potosí</option>
                <option value="CH">CH - Chuquisaca</option>
                <option value="TJ">TJ - Tarija</option>
                <option value="BE">BE - Beni</option>
                <option value="PA">PA - Pando</option>
                <option value="QR">QR - Otro</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Rol</label>
              <select
                name="roles"
                value={formData.roles}
                onChange={handleChange}
                className="w-full p-2 rounded-md border dark:bg-gray-900 dark:border-gray-700"
              >
                <option value="">Seleccione un rol</option>
                <option value="user">Usuario</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancelar
            </Button>
            <Button color="primary" onPress={handleSave}>
              Guardar cambios
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal éxito bonito */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        isDismissable
        hideCloseButton
      >
        <ModalContent>
          <ModalHeader className="flex flex-col items-center justify-center">
            <svg
              className="w-12 h-12 text-green-600 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h3 className="text-center text-lg font-semibold">
              ¡Usuario actualizado correctamente!
            </h3>
          </ModalHeader>
          <ModalBody />
          <ModalFooter className="justify-center">
            <Button
              color="primary"
              onPress={() => setShowSuccessModal(false)}
            >
              Aceptar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
