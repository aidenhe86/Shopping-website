-- both test users have the password "password"

INSERT INTO users (username, password, first_name, last_name, email, address, city, state, zip, is_admin)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User',
        'joel@joelburton.com',
        'testaddress',
        'testCity',
        'testState',
        '10000',
        FALSE),
       ('testadmin',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Admin!',
        'joel@joelburton.com',
        'testaddress',
        'testCity',
        'testState',
        '10000',
        TRUE);

INSERT INTO categories (category)
VALUES  ('soda'),
        ('cake'),
        ('candy'),
        ('chips');