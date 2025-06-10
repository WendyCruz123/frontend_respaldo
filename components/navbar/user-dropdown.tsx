import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarItem,
} from "@nextui-org/react";
import React from "react";

export const UserDropdown = () => {
  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Avatar
            as='button'
            color='secondary'
            size='md'
            src='/gatito.jpg'
          />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu aria-label='User menu actions'>
        <DropdownItem key='edit_account'>Editar cuenta</DropdownItem>
        <DropdownItem key='edit_data'>Editar datos</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
