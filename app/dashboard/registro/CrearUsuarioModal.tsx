import { useState } from 'react';
import API from '@/lib/axios';
import {
  Button, Input, Modal, ModalContent,
  ModalHeader, ModalBody, ModalFooter
} from '@nextui-org/react';

interface CrearUsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  ciInicial?: string;
}

export default function CrearUsuarioModal({ isOpen, onClose, ciInicial = '' }: CrearUsuarioModalProps) {
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formPersona, setFormPersona] = useState({
    ci: ciInicial,
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

    return true;
  };

  const handleCrearUsuario = async () => {
    if (!validarFormulario()) return;

    try {
      setLoading(true);

      const resPersona = await API.post('/persona', formPersona);
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

      setTimeout(() => {
        setShowSuccessModal(false);
        onClose();
        location.reload();
      }, 2000);
    } catch (error: any) {
      console.error("Error al registrar", error);
      alert(error?.response?.data?.message?.toString() ?? 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onClose} size="lg">
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
            <Button variant="light" onPress={onClose}>Cancelar</Button>
            <Button color="primary" onPress={handleCrearUsuario} isLoading={loading}>Registrar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={showSuccessModal} onOpenChange={() => setShowSuccessModal(false)} size="sm" isDismissable={false}>
        <ModalContent>
          <ModalHeader className="text-center">✅ Éxito</ModalHeader>
          <ModalBody className="text-center">
            <p>Usuario registrado correctamente.</p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
