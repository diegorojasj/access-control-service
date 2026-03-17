# States

## Overview

Global state managed with Zustand (`AppStore`) in `frontend/src/core/AppContext.tsx`, provided via the `AppContext` component in the layout.

| State | Type | Description |
|-------|------|-------------|
| `user` | `User \| null` | Authenticated user data |
| `setUser` | `(user) => void` | Set authenticated user |
| `reset` | `() => void` | Reset all states to initial values |

## To Do List

| State | Type | Description |
|-------|------|-------------|
| `openToDoListForm` | `boolean` | Controls To Do List form visibility |
| `setOpenToDoListForm` | `(bool) => void` | Set To Do List form visibility |
| `openToDoListTable` | `boolean` | Controls To Do List table visibility |
| `setOpenToDoListTable` | `(bool) => void` | Set To Do List table visibility |

## User Management

| State | Type | Description |
|-------|------|-------------|
| `openUserManagementForm` | `boolean` | Controls User Management form visibility |
| `setOpenUserManagementForm` | `(bool) => void` | Set User Management form visibility |
| `openUserManagementTable` | `boolean` | Controls User Management table visibility |
| `setOpenUserManagementTable` | `(bool) => void` | Set User Management table visibility |

## Role Management

| State | Type | Description |
|-------|------|-------------|
| `openRoleManagementForm` | `boolean` | Controls Role Management form visibility |
| `setOpenRoleManagementForm` | `(bool) => void` | Set Role Management form visibility |
| `openRoleManagementTable` | `boolean` | Controls Role Management table visibility |
| `setOpenRoleManagementTable` | `(bool) => void` | Set Role Management table visibility |

## Permission Management

| State | Type | Description |
|-------|------|-------------|
| `openPermissionManagementForm` | `boolean` | Controls Permission Management form visibility |
| `setOpenPermissionManagementForm` | `(bool) => void` | Set Permission Management form visibility |
| `openPermissionManagementTable` | `boolean` | Controls Permission Management table visibility |
| `setOpenPermissionManagementTable` | `(bool) => void` | Set Permission Management table visibility |
