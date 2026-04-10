INSERT INTO public.roles (id, name, description, permissions, is_immutable, created_at, updated_at)
VALUES
(1, 'admin', 'Administrator', ARRAY['allinone:all'], true, NOW(), NOW()),
(2, 'common', 'Common User', ARRAY[
    'todo:view', 'todo:create', 'todo:update', 'todo:delete', 'todo:check', 'todo:uncheck',
    'user:view',
    'role:view'
], false, NOW(), NOW()),
(3, 'readonly', 'Readonly User', ARRAY[
    'todo:view',
    'user:view',
    'role:view'
], false, NOW(), NOW())
ON CONFLICT (id)
DO NOTHING;

INSERT INTO public.roles (id, name, description, permissions, is_immutable, created_at, updated_at)
VALUES
-- Full todo control, no user/role management
(4, 'todo_full', 'Todo Full Access', ARRAY[
    'todo:view', 'todo:create', 'todo:update', 'todo:delete', 'todo:check', 'todo:uncheck'
], false, NOW(), NOW()),
-- Can create and check todos, but cannot edit or delete
(5, 'todo_contributor', 'Todo Contributor', ARRAY[
    'todo:view', 'todo:create', 'todo:check', 'todo:uncheck'
], false, NOW(), NOW()),
-- Can edit and check todos, but cannot create or delete
(6, 'todo_editor', 'Todo Editor', ARRAY[
    'todo:view', 'todo:update', 'todo:check', 'todo:uncheck'
], false, NOW(), NOW()),
-- Full user management + view todos and roles
(7, 'user_manager', 'User Manager', ARRAY[
    'user:view', 'user:create', 'user:update', 'user:suspend', 'user:unsuspend',
    'todo:view',
    'role:view'
], false, NOW(), NOW()),
-- Full role management + view users and todos
(8, 'role_manager', 'Role Manager', ARRAY[
    'role:view', 'role:create', 'role:update', 'role:delete',
    'user:view',
    'todo:view'
], false, NOW(), NOW()),
-- Can check todos and suspend users, but cannot create or delete anything
(9, 'supervisor', 'Supervisor', ARRAY[
    'todo:view', 'todo:check', 'todo:uncheck',
    'user:view', 'user:suspend', 'user:unsuspend',
    'role:view'
], false, NOW(), NOW()),
-- Full todo + create users + view roles (elevated common user)
(10, 'power_user', 'Power User', ARRAY[
    'todo:view', 'todo:create', 'todo:update', 'todo:delete', 'todo:check', 'todo:uncheck',
    'user:view', 'user:create',
    'role:view'
], false, NOW(), NOW()),
-- Can update/delete todos and suspend users, but cannot create
(11, 'content_mod', 'Content Moderator', ARRAY[
    'todo:view', 'todo:update', 'todo:delete',
    'user:view', 'user:suspend',
    'role:view'
], false, NOW(), NOW()),
-- Can create and delete todos (no update), view-only elsewhere
(12, 'auditor', 'Auditor', ARRAY[
    'todo:view', 'todo:create', 'todo:delete',
    'user:view',
    'role:view'
], false, NOW(), NOW()),
-- Minimal access: only view and create todos, nothing else
(13, 'junior', 'Junior User', ARRAY[
    'todo:view', 'todo:create'
], false, NOW(), NOW())
ON CONFLICT (id)
DO NOTHING;

SELECT setval(pg_get_serial_sequence('public.roles', 'id'), (SELECT MAX(id) FROM public.roles));