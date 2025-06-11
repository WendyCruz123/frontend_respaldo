'use client';

import { useEffect, useState } from 'react';
import API from '@/lib/axios';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from '@nextui-org/react';

interface ModalEditarArchivoProps {
  isOpen: boolean;
  onClose: () => void;
  archivo: any; // El archivo que vas a editar
  onUpdate: () => void; // Callback para actualizar la tabla
}

export default function ModalEditarArchivo({
  isOpen,
  onClose,
  archivo,
  onUpdate,
}: ModalEditarArchivoProps) {
  const [ci, setCi] = useState('');
  const [personas, setPersonas] = useState<any[]>([]);
  const [personaSeleccionada, setPersonaSeleccionada] = useState<any>(null);
  const [descripcion, setDescripcion] = useState('');
  const [tipoRespaldo, setTipoRespaldo] = useState('');
  const [tiposRespaldos, setTiposRespaldos] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Cargar datos iniciales cuando abre el modal
  useEffect(() => {
    if (archivo) {
      setDescripcion(archivo.respaldo?.descripcion || '');
      setTipoRespaldo(archivo.respaldo?.tipo_respaldo?.id || '');
      setPersonaSeleccionada(archivo.respaldo?.persona || null);
      setCi(archivo.respaldo?.persona?.ci || '');
    }
  }, [archivo]);

  // Obtener tipos de respaldo
  useEffect(() => {
    const fetchTiposRespaldos = async () => {
      try {
        const res = await API.get('/tipos-respaldos', { params: { limit: 100 } });
        setTiposRespaldos(res.data.data.rows);
      } catch (error) {
        console.error('Error al obtener tipos de respaldo:', error);
      }
    };
    fetchTiposRespaldos();
  }, []);

  // Buscar personas por CI
  useEffect(() => {
    const fetchPersonas = async () => {
      if (ci.length >= 3) {
        try {
          const res = await API.get('/persona', { params: { search: ci } });
          setPersonas(res.data.data.rows);
        } catch (error) {
          console.error('Error al buscar personas:', error);
          setPersonas([]);
        }
      } else {
        setPersonas([]);
      }
    };
    fetchPersonas();
  }, [ci]);

  const handleSelectPersona = (persona: any) => {
    setPersonaSeleccionada(persona);
    setCi(persona.ci);
    setPersonas([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
    }
  };

  const handleGuardarCambios = async () => {
    if (!personaSeleccionada || !descripcion.trim() || !tipoRespaldo) return;

    try {
      setLoading(true);

      // PATCH /respaldo/:id
      await API.patch(`/respaldo/${archivo.respaldo.id}`, {
        persona_id: personaSeleccionada.id,
        descripcion,
        tipo_respaldo_id: tipoRespaldo,
      });

      // Si hay un nuevo PDF, subirlo y actualizar archivo
      if (file) {
        const token = document.cookie.split('; ').find((row) => row.startsWith('accessToken='))?.split('=')[1];
        if (!token) throw new Error('Token no encontrado en cookies');

        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await API.post('/files/back-files', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });

        const nombreArchivo = uploadRes.data.files;
        const url = `http://localhost:5000/ds/files/back-files/${nombreArchivo}`;

        // PATCH /archivos/:id
        await API.patch(`/archivos/${archivo.id}`, {
          nombre: nombreArchivo,
          url,
          tamaño: file.size,
          extension: 'pdf',
        });
      }

      onClose();
      onUpdate(); // Actualizar la tabla
    } catch (error) {
      console.error('Error al editar archivo:', error);
      alert('Error al editar archivo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isDismissable={!loading}>
      <ModalContent>
        <ModalHeader>Editar Archivo PDF</ModalHeader>
        <ModalBody>
          {/* Buscar CI */}
          <label className="block font-medium mb-1">CI del Usuario</label>
          <Input value={ci} onChange={(e) => setCi(e.target.value)} />
          {personas.length > 0 && (
            <ul className="border rounded bg-white dark:bg-stone-500  text-gray-950 max-h-40 overflow-y-auto mt-2">
              {personas.map((p) => (
                <li
                  key={p.id}
                  onClick={() => handleSelectPersona(p)}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                >
                  {p.ci} - {p.nombres} {p.paterno}
                </li>
              ))}
            </ul>
          )}

          {/* Descripción */}
          <label className="block font-medium mb-1 mt-4">Descripción</label>
          <Input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />

          {/* Tipo de respaldo */}
          <label className="block font-medium mb-1 mt-4">Tipo de Respaldo</label>
          <select
            value={tipoRespaldo}
            onChange={(e) => setTipoRespaldo(e.target.value)}
            className="w-full p-2 rounded-md bg-gray-100 dark:bg-stone-500  text-gray-950"
          >
            <option value="">Selecciona un tipo</option>
            {tiposRespaldos.map((tipo: any) => (
              <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
            ))}
          </select>

          {/* Cambiar PDF */}
          <label className="block font-medium mb-1 mt-4">Reemplazar PDF (opcional)</label>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} isDisabled={loading}>
            Cancelar
          </Button>
          <Button color="primary" onPress={handleGuardarCambios} isLoading={loading}>
            Guardar cambios
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
