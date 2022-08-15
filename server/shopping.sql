\echo 'Delete and recreate shopping db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE shopping;
CREATE DATABASE shopping;
\connect shopping

\i shopping-schema.sql

\echo 'Delete and recreate shopping_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE shopping_test;
CREATE DATABASE shopping_test;
\connect shopping_test

\i shopping-schema.sql