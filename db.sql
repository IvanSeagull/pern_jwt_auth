create table users(
    user_id serial primary key,
    username VARCHAR(255) unique not null,
    password VARCHAR(255) not null,
    role int references roles(role_id) not null
);
create table roles(
    role_id serial primary key,
    rolname VARCHAR(255) unique not null
);