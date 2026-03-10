INSERT INTO public."user" (id, name, username, password, role) 
VALUES 
-- DEFAULT PASSWORD: 1234
(1, 'Diego Rojas', 'diego', '$argon2id$v=19$m=65536,t=2,p=1$zYjYHcPpBOJ9eGOn9Vv7EA$6x5kA4xjKtQGgsmvYNLgSdzZut+h2tUTe73a3YO+0mw', 'admin'),
(2, 'Marco', 'marco', '$argon2id$v=19$m=65536,t=2,p=1$zYjYHcPpBOJ9eGOn9Vv7EA$6x5kA4xjKtQGgsmvYNLgSdzZut+h2tUTe73a3YO+0mw', 'common'),
(3, 'Cecilia', 'cecilia', '$argon2id$v=19$m=65536,t=2,p=1$zYjYHcPpBOJ9eGOn9Vv7EA$6x5kA4xjKtQGgsmvYNLgSdzZut+h2tUTe73a3YO+0mw', 'readonly')
ON CONFLICT (id) 
DO NOTHING;