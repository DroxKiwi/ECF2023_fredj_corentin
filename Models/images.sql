CREATE TABLE IF NOT EXISTS images (
    image_id serial PRIMARY KEY,
    name varchar(256) NOT NULL,
    title varchar(256) NOT NULL,
    selectedfor varchar(80)
)