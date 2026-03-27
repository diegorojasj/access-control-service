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

SELECT setval(pg_get_serial_sequence('public.roles', 'id'), (SELECT MAX(id) FROM public.roles));