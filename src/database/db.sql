CREATE TABLE `user_type` (
    `id` int(1)  NOT NULL ,
    `type` varchar(10)  NOT NULL ,
    PRIMARY KEY (`id`)
);

insert into user_type (id, type) values 
(1, admin),
(2, employee),
(3, person);

CREATE TABLE `person` (
    `id` int(11)  NOT NULL ,
    `fingerprint` varchar(300)  NOT NULL ,
    `name` varchar(50)  NOT NULL ,
    `lastname` varchar(50)  NOT NULL ,
    `surname` varchar(50)  NOT NULL ,
    `birthdate` date  NOT NULL ,
    `curp` varchar(18)  NOT NULL ,
    `estado_id` int(3)  NOT NULL ,
    `municipio_id` int(3)  NOT NULL ,
    `cp` int(6)  NOT NULL ,
    `address` varchar(30)  NOT NULL ,
    `address_num` int(4)  NOT NULL ,
    `address_letter` varchar(2)  NOT NULL ,
    `active` tinyint(1)  NOT NULL ,
    `type` tinyiny(1)  NOT NULL ,
    `vote_flag` tinyint(1)  NOT NULL ,
    `created_at` datetime  NOT NULL ,
    `created_by` varchar(20)  NOT NULL ,
    PRIMARY KEY (`id`),
    CONSTRAINT `uc_person_fingerprint` UNIQUE (`fingerprint`),
    CONSTRAINT `uc_person_curp` UNIQUE (`curp`)
);

CREATE TABLE `users` (
    `id` int(10)  NOT NULL ,
    `id_person` int(11)  NOT NULL ,
    `username` varchar(15)  NOT NULL ,
    `password` varchar(50)  NOT NULL ,
    `type` tinyint(1)  NOT NULL ,
    `created_at` datetime  NOT NULL ,
    `created_by` varchar(15)  NOT NULL ,
    PRIMARY KEY (`id`),
    CONSTRAINT `uc_users_username` UNIQUE (`username`)
);

CREATE TABLE `estados` (
    `id` int(11)  NOT NULL ,
    `clave` varchar(2)  NOT NULL ,
    `nombre` varchar(40)  NOT NULL ,
    `abrev` varchar(10)  NOT NULL ,
    `activo` tinyiny(1)  NOT NULL ,
    PRIMARY KEY (`id`)
);

CREATE TABLE `municipios` (
    `id` int(11)  NOT NULL ,
    `estado_id` int(11)  NOT NULL ,
    `clave` varchar(3)  NOT NULL ,
    `nombre` varchar(100)  NOT NULL ,
    `activo` tinyiny(1)  NOT NULL ,
    PRIMARY KEY (`id`)
);