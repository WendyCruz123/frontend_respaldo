'use client';

import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarItem,
} from '@nextui-org/react';
import React, { useState } from 'react';
import ModalCambiarPassword from '@/components/navbar/ModalCambiarPassword';

export const UserDropdown = () => {
  const [showModalCambiarPassword, setShowModalCambiarPassword] = useState(false);

  return (
    <>
      <Dropdown>
        <NavbarItem>
          <DropdownTrigger>
            <Avatar as='button' color='secondary' size='md' src='/gatito.jpg' />
          </DropdownTrigger>
        </NavbarItem>
        <DropdownMenu aria-label='User menu actions'>
          <DropdownItem key='edit_account'>Ver perfil</DropdownItem>
          <DropdownItem
            key='edit_data'
            onPress={() => setShowModalCambiarPassword(true)} // 👈 Aquí abrimos el modal
          >
            Cambiar contraseña
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {/* Modal cambiar contraseña */}
      <ModalCambiarPassword
        isOpen={showModalCambiarPassword}
        onClose={() => setShowModalCambiarPassword(false)}
      />
    </>
  );
};
