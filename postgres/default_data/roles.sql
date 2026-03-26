INSERT INTO public.roles (id, name, description, is_immutable, created_at, updated_at) 
VALUES 
(1, 'admin', 'Administrator', true, NOW(), NOW()),
(2, 'common', 'Common User', false, NOW(), NOW()),
(3, 'readonly', 'Readonly User', false, NOW(), NOW())
ON CONFLICT (id) 
DO NOTHING;

SELECT setval(pg_get_serial_sequence('public.roles', 'id'), (SELECT MAX(id) FROM public.roles));