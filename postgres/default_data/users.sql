INSERT INTO public."user" (id, name, username, password, role, status) 
VALUES 
-- DEFAULT PASSWORD: 1234 (encoded: NDktNTAtNTEtNTI=)
(1, 'Diego Rojas', 'diego', '$argon2id$v=19$m=65536,t=2,p=1$+fJXV4+ziBWjMbooYICEcQ$lCu/bsHYJXxkIRygf6Y8glPMJB+bS8/UR3DXGcPNri8', 'admin', 1),
(2, 'Marco', 'marco', '$argon2id$v=19$m=65536,t=2,p=1$+fJXV4+ziBWjMbooYICEcQ$lCu/bsHYJXxkIRygf6Y8glPMJB+bS8/UR3DXGcPNri8', 'common', 1),
(3, 'Cecilia', 'cecilia', '$argon2id$v=19$m=65536,t=2,p=1$+fJXV4+ziBWjMbooYICEcQ$lCu/bsHYJXxkIRygf6Y8glPMJB+bS8/UR3DXGcPNri8', 'readonly', 1)
ON CONFLICT (id)
DO NOTHING;

SELECT setval(pg_get_serial_sequence('public."user"', 'id'), (SELECT MAX(id) FROM public."user"));