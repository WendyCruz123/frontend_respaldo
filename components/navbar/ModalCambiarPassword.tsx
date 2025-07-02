'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@nextui-org/react';
import API from '@/lib/axios'
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface ModalCambiarPasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalCambiarPassword({
  isOpen,
  onClose,
}: ModalCambiarPasswordProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');
 const [isLoading, setIsLoading] = useState(false);

  const handleGuardar = async () => {
     
  if (!currentPassword || !newPassword || !repeatNewPassword) {
    toast.error('Por favor complete todos los campos.');
    return;
  }

  if (newPassword !== repeatNewPassword) {
    toast.error('Las contraseñas nuevas no coinciden.');
    return;
  }

  if (newPassword.length < 8) {
    toast.error('La nueva contraseña debe tener al menos 8 caracteres.');
    return;
  }

  try {
    setIsLoading(true);
    // Hacer la petición al backend
    await API.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });

    // Si todo OK
    toast.success('Contraseña cambiada correctamente.');
    // También podrías usar toast.success('Contraseña cambiada correctamente.');
    onClose();

    // Limpiar los campos
    setCurrentPassword('');
    setNewPassword('');
    setRepeatNewPassword('');
  } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);
      const msg = error.response?.data?.message || 'Error al cambiar contraseña.';
      toast.error(msg);
    } finally {
      setIsLoading(false); // Desactivamos loading
    }
    
  };

 return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      backdrop="blur"
      isDismissable={false}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Cambiar Contraseña
            </ModalHeader>
            <ModalBody>
              <Input
                label="Ingrese su contraseña actual (*)"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Por favor ingrese su contraseña actual"
                isRequired
              />
              <Input
                label="Ingrese su nueva contraseña (*)"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Contraseña mínima de 8 caracteres"
                isRequired
              />
              <Input
                label="Repita su nueva contraseña (*)"
                type="password"
                value={repeatNewPassword}
                onChange={(e) => setRepeatNewPassword(e.target.value)}
                placeholder="Repita la nueva contraseña"
                isRequired
              />
              <p className="text-red-500 text-sm text-center mt-2">
                Por favor no olvide su contraseña, ya que es indispensable para
                ingresar al sistema
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onPress={handleGuardar}
                isLoading={isLoading} // Usamos loading aquí
              >
                Guardar
              </Button>
              <Button color="warning" variant="light" onPress={onClose}>
                Cancelar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}