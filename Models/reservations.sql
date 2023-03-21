CREATE TABLE IF NOT EXISTS reservations (
    reservation_id serial PRIMARY KEY,
    guests int NOT NULL,
    dateres varchar(10) NOT NULL,
    hourres int NOT NULL,
    allergy varchar(256)
)