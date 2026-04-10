INSERT INTO public."user" (id, name, username, password, role, status) 
VALUES 
-- DEFAULT PASSWORD: 1234 (sha256: 03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4)
(1, 'Diego Rojas', 'diego', '$argon2id$v=19$m=65536,t=2,p=1$6T2JbxbEd08HQrVXeXrJhw$+WU99suJYiL+xmOM4ORyOF+S3Sd63A9UCXzxLigv8lU', 'admin', 1),
(2, 'Marco', 'marco', '$argon2id$v=19$m=65536,t=2,p=1$6T2JbxbEd08HQrVXeXrJhw$+WU99suJYiL+xmOM4ORyOF+S3Sd63A9UCXzxLigv8lU', 'common', 1),
(3, 'Cecilia', 'cecilia', '$argon2id$v=19$m=65536,t=2,p=1$6T2JbxbEd08HQrVXeXrJhw$+WU99suJYiL+xmOM4ORyOF+S3Sd63A9UCXzxLigv8lU', 'readonly', 1)
ON CONFLICT (id)
DO NOTHING;

INSERT INTO public."user" (id, name, username, password, role, status)
VALUES
-- DEFAULT PASSWORD: 1234 (same hash as above)
(4,  'Alice Johnson',    'alice',    '$argon2id$v=19$m=65536,t=2,p=1$6T2JbxbEd08HQrVXeXrJhw$+WU99suJYiL+xmOM4ORyOF+S3Sd63A9UCXzxLigv8lU', 'todo_full',        1),
(5,  'Bob Smith',        'bob',      '$argon2id$v=19$m=65536,t=2,p=1$6T2JbxbEd08HQrVXeXrJhw$+WU99suJYiL+xmOM4ORyOF+S3Sd63A9UCXzxLigv8lU', 'todo_contributor', 1),
(6,  'Carlos Rivera',    'carlos',   '$argon2id$v=19$m=65536,t=2,p=1$6T2JbxbEd08HQrVXeXrJhw$+WU99suJYiL+xmOM4ORyOF+S3Sd63A9UCXzxLigv8lU', 'todo_editor',      1),
(7,  'Emma Wilson',      'emma',     '$argon2id$v=19$m=65536,t=2,p=1$6T2JbxbEd08HQrVXeXrJhw$+WU99suJYiL+xmOM4ORyOF+S3Sd63A9UCXzxLigv8lU', 'user_manager',     1),
(8,  'Frank Chen',       'frank',    '$argon2id$v=19$m=65536,t=2,p=1$6T2JbxbEd08HQrVXeXrJhw$+WU99suJYiL+xmOM4ORyOF+S3Sd63A9UCXzxLigv8lU', 'role_manager',     1),
(9,  'Grace Kim',        'grace',    '$argon2id$v=19$m=65536,t=2,p=1$6T2JbxbEd08HQrVXeXrJhw$+WU99suJYiL+xmOM4ORyOF+S3Sd63A9UCXzxLigv8lU', 'supervisor',       1),
(10, 'Henry Brown',      'henry',    '$argon2id$v=19$m=65536,t=2,p=1$6T2JbxbEd08HQrVXeXrJhw$+WU99suJYiL+xmOM4ORyOF+S3Sd63A9UCXzxLigv8lU', 'common',           1),
(11, 'Isabella Davis',   'isabella', '$argon2id$v=19$m=65536,t=2,p=1$6T2JbxbEd08HQrVXeXrJhw$+WU99suJYiL+xmOM4ORyOF+S3Sd63A9UCXzxLigv8lU', 'power_user',       1),
(12, 'James Martinez',   'james',    '$argon2id$v=19$m=65536,t=2,p=1$6T2JbxbEd08HQrVXeXrJhw$+WU99suJYiL+xmOM4ORyOF+S3Sd63A9UCXzxLigv8lU', 'content_mod',      1),
(13, 'Katelyn Thompson', 'katelyn',  '$argon2id$v=19$m=65536,t=2,p=1$6T2JbxbEd08HQrVXeXrJhw$+WU99suJYiL+xmOM4ORyOF+S3Sd63A9UCXzxLigv8lU', 'auditor',          1),
(14, 'Liam Anderson',    'liam',     '$argon2id$v=19$m=65536,t=2,p=1$6T2JbxbEd08HQrVXeXrJhw$+WU99suJYiL+xmOM4ORyOF+S3Sd63A9UCXzxLigv8lU', 'junior',           1),
(15, 'Mia Jackson',      'mia',      '$argon2id$v=19$m=65536,t=2,p=1$6T2JbxbEd08HQrVXeXrJhw$+WU99suJYiL+xmOM4ORyOF+S3Sd63A9UCXzxLigv8lU', 'readonly',         1),
(16, 'Noah White',       'noah',     '$argon2id$v=19$m=65536,t=2,p=1$6T2JbxbEd08HQrVXeXrJhw$+WU99suJYiL+xmOM4ORyOF+S3Sd63A9UCXzxLigv8lU', 'todo_full',        1),
(17, 'Olivia Harris',    'olivia',   '$argon2id$v=19$m=65536,t=2,p=1$6T2JbxbEd08HQrVXeXrJhw$+WU99suJYiL+xmOM4ORyOF+S3Sd63A9UCXzxLigv8lU', 'todo_contributor', 1),
(18, 'Patrick Lewis',    'patrick',  '$argon2id$v=19$m=65536,t=2,p=1$6T2JbxbEd08HQrVXeXrJhw$+WU99suJYiL+xmOM4ORyOF+S3Sd63A9UCXzxLigv8lU', 'user_manager',     1),
(19, 'Quinn Robinson',   'quinn',    '$argon2id$v=19$m=65536,t=2,p=1$6T2JbxbEd08HQrVXeXrJhw$+WU99suJYiL+xmOM4ORyOF+S3Sd63A9UCXzxLigv8lU', 'role_manager',     1),
(20, 'Rachel Clark',     'rachel',   '$argon2id$v=19$m=65536,t=2,p=1$6T2JbxbEd08HQrVXeXrJhw$+WU99suJYiL+xmOM4ORyOF+S3Sd63A9UCXzxLigv8lU', 'supervisor',       1),
(21, 'Samuel Lee',       'samuel',   '$argon2id$v=19$m=65536,t=2,p=1$6T2JbxbEd08HQrVXeXrJhw$+WU99suJYiL+xmOM4ORyOF+S3Sd63A9UCXzxLigv8lU', 'power_user',       1),
(22, 'Tina Walker',      'tina',     '$argon2id$v=19$m=65536,t=2,p=1$6T2JbxbEd08HQrVXeXrJhw$+WU99suJYiL+xmOM4ORyOF+S3Sd63A9UCXzxLigv8lU', 'content_mod',      1),
(23, 'Ulysses Hall',     'ulysses',  '$argon2id$v=19$m=65536,t=2,p=1$6T2JbxbEd08HQrVXeXrJhw$+WU99suJYiL+xmOM4ORyOF+S3Sd63A9UCXzxLigv8lU', 'auditor',          1)
ON CONFLICT (id)
DO NOTHING;

SELECT setval(pg_get_serial_sequence('public."user"', 'id'), (SELECT MAX(id) FROM public."user"));