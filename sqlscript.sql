

CREATE TABLE authuser
(
	auth_id SERIAL,
	email varchar(255) PRIMARY KEY NOT NULL,
	password varchar(255) NOT NULL,
	jic varchar(255)
	
);

INSERT INTO authuser (email, password)
VALUES ('firstusr@email.com', '123'); 

INSERT INTO authuser (email, password)
VALUES ('secondusr@email.com', '234'); 

SELECT * FROM authuser;

-- 1 to many 
ALTER TABLE SECONDARY_TABL_NAME
ADD COLUMN fk_COLUMN_NAME;

ALTER TABLE book
ADD CONSTRAINT fk_NAMEofConstraint
FOREIGN KEY(fk_COLUMN_NAME) REFERENCES firstTableName(pk_columnName);
-- 1 to 1
CREATE TABLE passport
(
	passport_id int PRIMARY KEY,
	serial_number int NOT NULL,
	fk_passport_person int UNIQUE REFERENCES person(person_id)
);


