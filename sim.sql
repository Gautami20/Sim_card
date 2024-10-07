CREATE TABLE sim_cards (
    sim_number VARCHAR(20) PRIMARY KEY SERIAL,
    phone_number VARCHAR(15) UNIQUE,
    status VARCHAR(10) CHECK (status IN ('active', 'inactive')),
    activation_date TIMESTAMP NOT NULL
);
