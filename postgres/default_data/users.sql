INSERT INTO public."user" (id, name, username, password, role) 
VALUES 
-- DEFAULT PASSWORD: 1234 (encoded: NDktNTAtNTEtNTI=)
(1, 'Diego Rojas', 'diego', '$argon2id$v=19$m=65536,t=2,p=1$+fJXV4+ziBWjMbooYICEcQ$lCu/bsHYJXxkIRygf6Y8glPMJB+bS8/UR3DXGcPNri8', 'admin'),
(2, 'Marco', 'marco', '$argon2id$v=19$m=65536,t=2,p=1$+fJXV4+ziBWjMbooYICEcQ$lCu/bsHYJXxkIRygf6Y8glPMJB+bS8/UR3DXGcPNri8', 'common'),
(3, 'Cecilia', 'cecilia', '$argon2id$v=19$m=65536,t=2,p=1$+fJXV4+ziBWjMbooYICEcQ$lCu/bsHYJXxkIRygf6Y8glPMJB+bS8/UR3DXGcPNri8', 'readonly')
ON CONFLICT (id) 
DO NOTHING;