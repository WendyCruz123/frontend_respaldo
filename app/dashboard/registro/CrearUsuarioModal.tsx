"use client";

import { useState } from "react";
import API from "@/lib/axios";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
  Input,
} from "@nextui-org/react";

interface CrearUsuarioStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  ciInicial?: string;
}

export default function CrearUsuarioStepModal({ isOpen, onClose, ciInicial = "" }: CrearUsuarioStepModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formPersona, setFormPersona] = useState({
    ci: ciInicial,
    expedido: "LP",
    nombres: "",
    paterno: "",
    materno: "",
    celular: "",
    correo: ""
  });

  const [formInforme, setFormInforme] = useState({
    tipo_personal: "",
    nombre_unidad: "",
    rol: ""
  });

  const generarPasswordAleatoria = () => Math.random().toString(36).slice(-8) + "Aa1";

  const validarPasoActual = () => {
    if (step === 1) {
      const { ci, nombres, paterno, materno, correo } = formPersona;
      if (!ci || !nombres || !paterno || !materno || !correo) {
        alert("Todos los campos del paso 1 son obligatorios");
        return false;
      }
    }
    if (step === 2) {
      const { tipo_personal, nombre_unidad } = formInforme;
      if (!tipo_personal || !nombre_unidad) {
        alert("Todos los campos del paso 2 son obligatorios");
        return false;
      }
    }
    if (step === 3 && !formInforme.rol) {
      alert("Debes seleccionar un rol");
      return false;
    }
    return true;
  };

  const handleSiguiente = () => {
    if (validarPasoActual()) setStep((prev) => prev + 1);
  };

  const handleAtras = () => setStep((prev) => prev - 1);

  const handleCrearUsuario = async () => {
    if (!validarPasoActual()) return;
    try {
      setLoading(true);

      const resPersona = await API.post("/persona", formPersona);
      const personaId = resPersona.data?.data?.id || resPersona.data?.id;

      if (!personaId) {
        alert("Error: ID de persona no válido");
        return;
      }

      const resInforme = await API.post("/informe-personal", {
        tipo_personal: formInforme.tipo_personal,
        nombre_unidad: formInforme.nombre_unidad,
        persona_id: personaId,
      });

      console.log("Informe registrado:", resInforme.data);

      const usuario = {
        email: formPersona.correo,
        password: generarPasswordAleatoria(),
        persona: personaId,
        roles: [formInforme.rol],
      };

      await API.post("/auth/register", usuario);

      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        onClose();
        location.reload();
      }, 2000);

    } catch (error: any) {
      console.error("Error al registrar:", error);
      alert(error?.response?.data?.message?.toString() ?? "Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  const pasos = ["Datos Personales", "Datos Institucionales", "Rol y Confirmación"];

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onClose} size="xl" backdrop="blur">
        <ModalContent className="p-6">
          <ModalHeader>
            <div className="w-full text-center">
              <h2 className="text-2xl font-bold">Crear Usuario</h2>
              <div className="flex justify-center mt-4 gap-4">
                {pasos.map((label, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 ${step === index + 1 ? "text-primary font-semibold" : "text-gray-400"}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${step === index + 1 ? "bg-primary text-white" : "bg-gray-100"}`}>{index + 1}</div>
                    <span className="hidden md:inline">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </ModalHeader>

          <ModalBody>
            {step === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <Input label="CI" value={formPersona.ci} onChange={(e) => setFormPersona({ ...formPersona, ci: e.target.value })} />
                <Input label="Expedido" value={formPersona.expedido} onChange={(e) => setFormPersona({ ...formPersona, expedido: e.target.value })} />
                <Input label="Nombres" value={formPersona.nombres} onChange={(e) => setFormPersona({ ...formPersona, nombres: e.target.value })} />
                <Input label="Apellido Paterno" value={formPersona.paterno} onChange={(e) => setFormPersona({ ...formPersona, paterno: e.target.value })} />
                <Input label="Apellido Materno" value={formPersona.materno} onChange={(e) => setFormPersona({ ...formPersona, materno: e.target.value })} />
                <Input label="Celular" value={formPersona.celular} onChange={(e) => setFormPersona({ ...formPersona, celular: e.target.value })} />
                <Input label="Correo" value={formPersona.correo} onChange={(e) => setFormPersona({ ...formPersona, correo: e.target.value })} />
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Tipo de Personal</label>
                  <select
                    value={formInforme.tipo_personal}
                    onChange={(e) => setFormInforme({ ...formInforme, tipo_personal: e.target.value })}
                    className="w-full p-2 rounded-md border dark:bg-gray-900 dark:border-gray-700"
                  >
                    <option value="">Selecciona tipo de personal</option>
                    <option value="trabajador">Trabajador</option>
                    <option value="pasante">Pasante</option>
                    <option value="apoyo">Apoyo</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1">Unidad</label>
                  <select
                    value={formInforme.nombre_unidad}
                    onChange={(e) => setFormInforme({ ...formInforme, nombre_unidad: e.target.value })}
                    className="w-full p-2 rounded-md border dark:bg-gray-900 dark:border-gray-700"
                  >
                    <option value="">Selecciona unidad</option>
                    <option value="sistemas">Sistemas</option>
                    <option value="marketing">Marketing</option>
                  </select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <label className="block font-medium">Rol</label>
                <select
                  value={formInforme.rol}
                  onChange={(e) => setFormInforme({ ...formInforme, rol: e.target.value })}
                  className="w-full p-2 rounded-md border dark:bg-gray-900 dark:border-gray-700"
                >
                  <option value="">Selecciona un rol</option>
                  <option value="usuario">user</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
            )}
          </ModalBody>

          <ModalFooter className="justify-between mt-6">
            {step > 1 && <Button variant="light" onPress={handleAtras}>Atrás</Button>}
            {step < 3 ? (
              <Button color="primary" onPress={handleSiguiente}>Siguiente</Button>
            ) : (
              <Button color="success" onPress={handleCrearUsuario} isLoading={loading}>Registrar</Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} isDismissable hideCloseButton>
        <ModalContent>
          <ModalHeader className="flex flex-col items-center justify-center">
            <svg
              className="w-12 h-12 text-green-600 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="text-center text-lg font-semibold">
              ¡Usuario registrado correctamente!
            </h3>
          </ModalHeader>
          <ModalBody />
          <ModalFooter className="justify-center">
            <Button color="primary" onPress={() => setShowSuccessModal(false)}>
              Aceptar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
