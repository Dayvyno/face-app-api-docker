BEGIN TRANSACTION;

INSERT INTO users(name, email, entries, joined)
VALUES
  ('Dayve', 'dayve@gmail.com', 5, '2018-03-03');

INSERT INTO login (hash, email)
VALUES 
  ('$2a$10$T4Otf2O43w9yEHrg41gaPusYUTIJpyXMNLw6IVuR4wBOsRxd8oZNe', 'dayve@gmail.com');

  COMMIT;