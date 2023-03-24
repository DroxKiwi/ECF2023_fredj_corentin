CREATE TABLE IF NOT EXISTS users (
    user_id serial PRIMARY KEY,
    email varchar(256) UNIQUE NOT NULL,
    token varchar(80),
    salt varchar(80),
    hash varchar(80),
    role varchar(80) NOT NULL,
    preferences text[]
);

CREATE TABLE IF NOT EXISTS reservations (
    reservation_id serial PRIMARY KEY,
    email varchar(256) NOT NULL,
    guests int NOT NULL,
    dateres varchar(15) NOT NULL,
    hourres int NOT NULL,
    allergy varchar(256)
);

CREATE TABLE IF NOT EXISTS openhours (
    openhour_id serial PRIMARY KEY,
    day varchar(15) NOT NULL,
    state varchar(15) NOT NULL,
    maxguests int NOT NULL,
    openhour int NOT NULL,
    closehour int NOT NULL
);

CREATE TABLE IF NOT EXISTS menus (
    menu_id serial PRIMARY KEY,
    type varchar(256) NOT NULL,
    title varchar(256) NOT NULL,
    description varchar(256) NOT NULL,
    price float NOT NULL
);

CREATE TABLE IF NOT EXISTS images (
    image_id serial PRIMARY KEY,
    name varchar(256) NOT NULL,
    title varchar(256) NOT NULL,
    description varchar(256),
    selectedfor int
);

CREATE TABLE IF NOT EXISTS logs (
    log_id serial PRIMARY KEY,
    user_id int NOT NULL,
    user_email varchar(256) NOT NULL,
    log_message varchar(256)
);

CREATE TABLE IF NOT EXISTS contacts (
    user_id int,
    type varchar(80),
    message varchar(500),
    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS formules (
    formule_id serial PRIMARY KEY,
    title varchar(256) NOT NULL,
    period varchar(256) NOT NULL,
    description varchar(256) NOT NULL,
    price float NOT NULL
);

INSERT INTO users (
    email, token, salt,  hash, role, preferences
    ) VALUES (
        'corentinfredj.dev@gmail.com', 'iqC0_ikQaMW6tPYu', 'aKN1WN-Jxu6Sd3Zw', 'xZotNnkVaLPRwS2B9kFykKgrDBMJEzSwl/nUx2hj9rY=', 'ROLE_ADMIN', '{"darkmode"}'
);