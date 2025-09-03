create database if not exists db_mahasiswa;
use db_mahasiswa;

create table if not exists users (
id int auto_increment primary key,
email varchar(255) not null,
name varchar(255) not null,
password varchar(255) not null,
createdAt datetime default current_timestamp,
updatedAt datetime default current_timestamp on update current_timestamp);

create table if not exists mahasiswa (
id int auto_increment primary key,
name varchar(45) not null,
createdAt datetime default current_timestamp,
updatedAt datetime default current_timestamp on update current_timestamp,
user_id INT,
constraint fk_mahasiswa_user foreign key (user_id) references users(id) on delete set null);

create table if not exists mata_kuliah (
id int auto_increment primary key,
name varchar(45) not null,
createdAt datetime default current_timestamp,
updatedAt datetime default current_timestamp on update current_timestamp,
user_id INT,
constraint fk_mata_kuliah_user foreign key (user_id) references users(id) on delete set null);

create table if not exists nilai (
id int auto_increment primary key,
name varchar(45) not null,
indeks varchar(255) not null,
skor int,
createdAt datetime default current_timestamp,
updatedAt datetime default current_timestamp on update current_timestamp,
mata_kuliah_id int,
mahasiswa_id int,
user_id int,
constraint fk_nilai_mata_kuliah foreign key (mata_kuliah_id) references mata_kuliah(id) on delete set null,
constraint fk_nilai_mahasiswa foreign key (mahasiswa_id) references mahasiswa(id) on delete set null,
constraint fk_nilai_user foreign key (user_id) references users(id) on delete set null);