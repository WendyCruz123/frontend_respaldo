'use client';

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";

const columns = [
  { name: "Nombre", uid: "nombre" },
  { name: "Rol", uid: "tipo_personal" },
  { name: "Unidad", uid: "unidad" },
  { name: "Acciones", uid: "acciones" },
];

export const TableWrapper = ({ personas }: { personas: any[] }) => {
  const renderCell = (persona: any, columnKey: string) => {
    switch (columnKey) {
      case "nombre":
        return (
          <div>
            <p className="font-medium text-sm">{persona.nombres} {persona.paterno} {persona.materno}</p>
            <p className="text-xs text-gray-500">{persona.correo}</p>
          </div>
        );
      case "tipo_personal":
        return (
          <span className="text-sm text-gray-700">{persona.tipo_personal}</span>
        );
      case "unidad":
        return (
          <span className="text-sm text-gray-700">{persona.nombre_unidad}</span>
        );
      case "acciones":
        return (
          <div className="flex items-center gap-2 justify-center">
            <button className="text-gray-500 hover:text-blue-500">
              <EyeIcon size={18} />
            </button>
            <button className="text-gray-500 hover:text-green-500">
              <PencilIcon size={18} />
            </button>
            <button className="text-gray-500 hover:text-red-500">
              <TrashIcon size={18} />
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <Table aria-label="Tabla de usuarios registrados" removeWrapper>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              hideHeader={column.uid === "acciones"}
              align={column.uid === "acciones" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody items={personas ?? []}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey as string)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};