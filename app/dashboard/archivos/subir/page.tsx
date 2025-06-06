'use client';

import { useEffect, useState } from 'react';
import API from '@/lib/axios';
import {
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import CrearUsuarioModal from '../../registro/CrearUsuarioModal';

export default function SubirArchivoPage() {
  const [ci, setCi] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [personas, setPersonas] = useState<any[]>([]);
  const [personaSeleccionada, setPersonaSeleccionada] = useState<any>(null);
  const [tipoRespaldo, setTipoRespaldo] = useState('');
  const [tiposRespaldos, setTiposRespaldos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(true);
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [noEncontrado, setNoEncontrado] = useState(false);

  useEffect(() => {
    const fetchPersonas = async () => {
      if (ci.length >= 3) {
        try {
          const res = await API.get('/persona', { params: { search: ci } });
          setPersonas(res.data.data.rows);
          setNoEncontrado(false);
        } catch (error: any) {
          if (error.response?.status === 404) {
            setNoEncontrado(true);
            setPersonas([]);
          }
        }
      } else {
        setPersonas([]);
        setNoEncontrado(false);
      }
    };
    fetchPersonas();
  }, [ci]);

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

  const handleSelectPersona = (persona: any) => {
    setPersonaSeleccionada(persona);
    setCi(persona.ci);
    setPersonas([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
    }
  };

  const resetForm = () => {
    setCi('');
    setDescripcion('');
    setFile(null);
    setPreviewUrl(null);
    setPersonas([]);
    setPersonaSeleccionada(null);
    setTipoRespaldo('');
  };

  const handleUpload = async () => {
    if (!file || !personaSeleccionada || !descripcion.trim() || !tipoRespaldo) return;
    try {
      setLoading(true);
      const token = document.cookie.split('; ').find((row) => row.startsWith('accessToken='))?.split('=')[1];
      if (!token) throw new Error('Token no encontrado en cookies');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const usuario_id = payload.id;
      const respaldoRes = await API.post('/respaldo', {
        usuario_id,
        persona_id: personaSeleccionada.id,
        descripcion,
        tipo_respaldo_id: tipoRespaldo
      });
      const respaldo_id = respaldoRes.data.data.id;
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
      await API.post('/archivos', {
        nombre: nombreArchivo,
        url,
        tamaño: file.size,
        extension: 'pdf',
        comprimido: false,
        estado: 'activo',
        respaldo_id,
      });
      setModalSuccess(true);
      setIsModalOpen(true);
      resetForm();
    } catch (error) {
      console.error('Error al subir archivo completo', error);
      setModalSuccess(false);
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-6">SUBIR NUEVO ARCHIVO PDF</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="block font-medium mb-1">CI del Usuario</label>
    <Input
      value={ci}
      onChange={(e) => setCi(e.target.value)}
      classNames={{
        inputWrapper: "bg-[#e0e0e0] dark:bg-[#1e1e1e]",
        input: "text-black dark:text-white placeholder-gray-500"
      }}
    />
    {personas.length > 0 && (
      <ul className="border rounded bg-white dark:bg-gray-900 max-h-40 overflow-y-auto mt-2">
        {personas.map((p) => (
          <li
            key={p.id}
            onClick={() => handleSelectPersona(p)}
            className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            {p.ci} - {p.nombres} {p.paterno}
          </li>
        ))}
      </ul>
    )}
    {noEncontrado && ci.length >= 4 && (
      <Button color="danger" className="mt-2 w-full" onClick={() => setMostrarModalRegistro(true)}>
        Registrar nuevo usuario
      </Button>
    )}
  </div>

  <div>
    <label className="block font-medium mb-1">Descripción</label>
    <Input
      value={descripcion}
      onChange={(e) => setDescripcion(e.target.value)}
      classNames={{
        inputWrapper: "bg-[#e0e0e0] dark:bg-[#1e1e1e]",
        input: "text-black dark:text-white placeholder-gray-500"
      }}
    />
  </div>

  <div>
    <label className="block font-medium mb-1">Tipo de Respaldo</label>
    <select
      value={tipoRespaldo}
      onChange={(e) => setTipoRespaldo(e.target.value)}
      className="w-full p-2 rounded-md bg-[#e0e0e0] dark:bg-[#1e1e1e] text-black dark:text-white border dark:border-gray-700"
    >
      <option value="">Selecciona un tipo</option>
      {tiposRespaldos.map((tipo: any) => (
        <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
      ))}
    </select>
  </div>

  <div>
    <label className="block font-medium mb-1">Seleccionar PDF</label>
    <input
      type="file"
      accept="application/pdf"
      onChange={handleFileChange}
      className="w-full rounded-md bg-[#e0e0e0] dark:bg-[#1e1e1e] p-2 text-sm text-gray-700 dark:text-white border dark:border-gray-700"
    />
  </div>
</div>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="w-full h-32 mt-4 flex items-center justify-center border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-800"
      >
        Arrastra tu PDF aquí
      </div>

      {previewUrl && (
        <div className="my-4">
          <p className="font-semibold mb-2">Vista previa:</p>
          <iframe src={previewUrl} className="w-full h-64 border rounded-md" />
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-end items-center gap-4 mt-6">
        <Button onClick={handleUpload} isDisabled={!file || !personaSeleccionada || loading || !tipoRespaldo} color="primary">
          {loading ? 'Subiendo...' : 'Aceptar'}
        </Button>
        <Button onClick={resetForm} color="danger" variant="flat">
          Cancelar
        </Button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isDismissable hideCloseButton>
        <ModalContent>
          <ModalHeader className="flex flex-col items-center justify-center">
            {modalSuccess ? (
              <CheckIcon className="w-12 h-12 text-green-600 mb-2" />
            ) : (
              <svg
                className="w-12 h-12 text-red-600 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <h3 className="text-center text-lg">
              {modalSuccess ? 'Archivo subido correctamente.' : 'Error al subir el archivo.'}
            </h3>
          </ModalHeader>
          <ModalBody />
          <ModalFooter className="justify-center">
            <Button color="primary" onPress={() => setIsModalOpen(false)}>
              Aceptar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <CrearUsuarioModal isOpen={mostrarModalRegistro} onClose={() => setMostrarModalRegistro(false)} ciInicial={ci} />
    </div>
  );
}