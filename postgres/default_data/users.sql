INSERT INTO public."user" (id, name, username, password, role, status) 
VALUES 
-- DEFAULT PASSWORD: 1234 (sha256: 03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4)
(1, 'Diego Rojas', 'diego', '$argon2id$v=19$m=65536,t=2,p=1$6T2JbxbEd08HQrVXeXrJhw$+WU99suJYiL+xmOM4ORyOF+S3Sd63A9UCXzxLigv8lU', 'admin', 1),
(2, 'Marco', 'marco', '$argon2id$v=19$m=65536,t=2,p=1$6T2JbxbEd08HQrVXeXrJhw$+WU99suJYiL+xmOM4ORyOF+S3Sd63A9UCXzxLigv8lU', 'common', 1),
(3, 'Cecilia', 'cecilia', '$argon2id$v=19$m=65536,t=2,p=1$6T2JbxbEd08HQrVXeXrJhw$+WU99suJYiL+xmOM4ORyOF+S3Sd63A9UCXzxLigv8lU', 'readonly', 1)
ON CONFLICT (id)
DO NOTHING;

SELECT setval(pg_get_serial_sequence('public."user"', 'id'), (SELECT MAX(id) FROM public."user"));