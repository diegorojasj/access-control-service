INSERT INTO public.permission (name, description) VALUES
-- User Management
('user:create', 'Allow creation of new users'),
('user:read', 'Allow display of user list and profile details'),
('user:update', 'Allow modification of existing user profiles'),
('user:delete', 'Allow removal or deactivation of users'),

-- Role Management
('role:create', 'Allow creation of new custom roles'),
('role:read', 'Allow display of role list and definitions'),
('role:update', 'Allow modification of existing roles'),
('role:delete', 'Allow removal of custom roles'),

-- Permission Management
('permission:create', 'Allow creation of new system permissions'),
('permission:read', 'Allow display of available permissions and access matrices'),
('permission:update', 'Allow modification of permission definitions'),
('permission:delete', 'Allow removal of permissions from the system'),

-- To-do list management
('todo:create', 'Allow creation of new to-do tasks'),
('todo:read', 'Allow display of to-do lists and individual task details'),
('todo:update', 'Allow modification of task details and status changes'),
('todo:delete', 'Allow removal of tasks from the to-do list')

-- Conditional
ON CONFLICT (name) 
DO NOTHING;