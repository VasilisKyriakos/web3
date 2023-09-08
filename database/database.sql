CREATE TABLE products (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    category VARCHAR(255),
    subcategory VARCHAR(255)
);

-- Creating categories table
CREATE TABLE categories (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255)
);

-- Creating subcategories table
CREATE TABLE subcategories (
    uuid VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    category_id VARCHAR(255),  -- foreign key referencing categories(id)
    FOREIGN KEY (category_id) REFERENCES categories(id)
);


CREATE TABLE shops (
    id BIGINT PRIMARY KEY,
    lat DECIMAL(10,7),
    lon DECIMAL(10,7),
    name VARCHAR(255)
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);



CREATE INDEX idx_category ON products (category);
CREATE INDEX idx_subcategory ON products (subcategory);