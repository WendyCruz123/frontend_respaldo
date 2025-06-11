'use client';

import { Input, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { useState } from 'react';
import API from '@/lib/axios';

export default function ModalEditarUsuario({ isOpen, onClose, usuario }: any) {
  const [formData, setFormData] = useState({
    nombres: usuario?.nombres || '',
    paterno: usuario?.paterno || '',
    celular: usuario?.celular || '',
    correo: usuario?.correo || '',
    roles: Array.isArray(usuario?.users?.[0]?.roles) ? usuario?.users?.[0]?.roles[0] : usuario?.users?.[0]?.roles || '',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Actualizar Persona
      await API.patch(`/persona/${usuario.id}`, {
        nombres: formData.nombres,
        paterno: formData.paterno,
        celular: formData.celular,
        correo: formData.correo,
      });

      // Actualizar Roles del usuario (en auth)
      if (usuario.users?.[0]?.id) {
        await API.patch(`/auth/users/${usuario.users[0].id}`, {
          roles: [formData.roles],
        });
      }

      onClose();
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      alert('Error al actualizar usuario');
    }
  };

  return (
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
          <Input
            label="Rol"
            name="roles"
            value={formData.roles}
            onChange={handleChange}
            placeholder="Ej: user, administrador"
          />
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
  );
}
