ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
flush privileges;
create database software;
use software;
select * from Staff;
select * from User_Account;
select count(*) from Product p  Join FProduct Fp on p.productID = Fp.productID
Group by p.name;
select * from FProduct;
select * from Shipper;
select * from Rank_Customer;
select * from Customer;
select * from Order_Info;
select * from Order_Supply;
-- drop table Customer;
-- drop table FProduct;
-- drop table Order_Info;
-- drop table Order_Supply;
-- drop table Product;
-- drop table Rank_Customer;
-- drop table Shipper;
-- drop table Staff;
-- drop table User_Acount;
create table Staff (
	staffID int Primary KEY,
    name varchar(25) not null,
    email varchar(25) not null,
    phoneNumber varchar(12) not null
);
create table User_Account (
	userID int primary key,
    email varchar(25) not null,
    password varchar(25) not null,
    role enum("Staff", "Admin") not null
);

create table Product (
	productID int Primary KEY,
    name varchar(25) not null,
    description varchar(100)
);

CREATE TABLE FProduct (
    fProductID INT,
    productID INT,
    size ENUM("M", "S", "L") NOT NULL,
    price FLOAT NOT NULL,
    PRIMARY KEY (fProductID),
    FOREIGN KEY (productID) REFERENCES Product(productID),
    UNIQUE (productID, size)
);


CREATE TABLE Shipper (
  shipperID INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(25) NOT NULL,
  phoneNumber VARCHAR(12) NOT NULL
);

create table Rank_Customer (
	rankID int primary key,
    nameRank varchar(8) not null,
    lowBound float not null,
    highBound float not null
);

create table Customer (
	customerID int primary key,
    rankID int,
    name varchar(25) not null,
    password varchar(25) not null,
    phoneNumber varchar(12),
    email varchar(25),
    address varchar(100),
    allSpend float default 0,
    foreign key (rankID) references Rank_Customer(rankID)
);
create table Order_Info (
	orderID int primary key,
    customerID int ,
    shipperID int not null,
    shipType enum("Normal", "Fast"),
    totalPrice float default 0 not null,
    Status enum("Prepare", "Delivering","Success","Fail"),
    nameCustomer varchar(25) not null,
    phoneNumber varchar(12) not null,
    address varchar(100) not null,
    foreign key (customerID) references Customer(customerID),
    foreign key (shipperID) references Shipper(shipperID)
);
create table Order_Supply (
	fProductID int,
    orderID int,
    quantity int not null,
    fever varchar(25) default "None",
    primary key (fProductID, orderID),
    foreign key (fProductID) references FProduct(fProductID),
    foreign key (orderID) references Order_Info(orderID)
);

INSERT INTO Rank_Customer (rankID, nameRank, lowBound, highBound)
VALUES
    (1, 'Rank 1', 0, 99.99),
    (2, 'Rank 2', 100, 499.99),
    (3, 'Rank 3', 500, 999.99),
    (4, 'Rank 4', 1000, 9999.99);
    
INSERT INTO Staff (staffID, name, email, phoneNumber)
SELECT
    staffID,
    CONCAT('Staff ', staffID),
    CONCAT('staff', staffID, '@example.com'),
    CONCAT('123-456-', LPAD(ROUND(RAND() * 9999), 4, '0'))
FROM (
    SELECT (ROW_NUMBER() OVER (ORDER BY (SELECT NULL))) AS staffID
    FROM Information_schema.tables s1
    JOIN Information_schema.tables s2
) AS staffData
WHERE staffID <= 100;

INSERT INTO User_Account (userID, email, password, role)
SELECT
    userID,
    CONCAT('user', userID, '@example.com'),
    CONCAT('password', userID),
    CASE WHEN userID % 5 = 0 THEN 'Admin' ELSE 'Staff' END as role
FROM (
    SELECT (ROW_NUMBER() OVER (ORDER BY (SELECT NULL))) AS userID
    FROM Information_schema.tables s1
    JOIN Information_schema.tables s2
) AS userData
WHERE userID <= 100;

ALTER TABLE Order_Info
ADD customerID INT,
ADD FOREIGN KEY (customerID) REFERENCES Customer(customerID);

INSERT INTO Product (productID, name, description)
SELECT 
    productID,
    CONCAT('Product ', productID) as name,
    CONCAT('Description for Product ', productID) as description
FROM (
    SELECT (ROW_NUMBER() OVER (ORDER BY (SELECT NULL))) AS productID
    FROM Information_schema.tables s1
    JOIN Information_schema.tables s2
) AS productData
WHERE productID <= 100;
INSERT INTO FProduct (fProductID, productID, size, price)
SELECT
    ROW_NUMBER() OVER () AS fProductID,
    productID,
    size,
    ROUND(RAND() * 100, 2) as price
FROM (
    SELECT DISTINCT productID, size
    FROM (
        SELECT DISTINCT
            FLOOR(RAND() * 100) + 1 AS productID,
            CASE 
                WHEN RAND() < 0.33 THEN 'M'
                WHEN RAND() >= 0.33 AND RAND() < 0.66 THEN 'S'
                ELSE 'L'
            END AS size
        FROM Information_schema.tables s1
        JOIN Information_schema.tables s2
    ) AS randomData
) AS uniqueSizes;

INSERT INTO Shipper (shipperID, name, phoneNumber)
SELECT
    shipperID,
    CONCAT('Shipper ', shipperID),
    CONCAT('555-888-', LPAD(ROUND(RAND() * 9999), 4, '0'))
FROM (
    SELECT (ROW_NUMBER() OVER (ORDER BY (SELECT NULL))) AS shipperID
    FROM Information_schema.tables s1
    JOIN Information_schema.tables s2
) AS shipperData
WHERE shipperID <= 100;

INSERT INTO Customer (customerID, rankID, name, password, phoneNumber, email, address, allSpend)
SELECT
    customerID,
    FLOOR(RAND() * 4) + 1 as rankID,
    CONCAT('Customer ', customerID),
    CONCAT('password', customerID),
    CONCAT('111-222-', LPAD(ROUND(RAND() * 9999), 4, '0')),
    CONCAT('customer', customerID, '@example.com'),
    CONCAT('Address ', customerID),
    ROUND(RAND() * 1000, 2) as allSpend
FROM (
    SELECT (ROW_NUMBER() OVER (ORDER BY (SELECT NULL))) AS customerID
    FROM Information_schema.tables s1
    JOIN Information_schema.tables s2
) AS customerData
WHERE customerID <= 100;
INSERT INTO Order_Info (orderID, customerID, shipperID, shipType, totalPrice, Status, nameCustomer, phoneNumber, address)
SELECT
    orderID,
    FLOOR(RAND() * 100) + 1 as customerID,
    FLOOR(RAND() * 100) + 1 as shipperID,
    CASE 
        WHEN RAND() < 0.5 THEN 'Normal'
        ELSE 'Fast'
    END as shipType,
    ROUND(RAND() * 1000, 2) as totalPrice,
    CASE 
        WHEN RAND() < 0.25 THEN 'Prepare'
        WHEN RAND() >= 0.25 AND RAND() < 0.5 THEN 'Delivering'
        WHEN RAND() >= 0.5 AND RAND() < 0.75 THEN 'Success'
        ELSE 'Fail'
    END as Status,
    CONCAT('Customer ', FLOOR(RAND() * 100) + 1) as nameCustomer,
    CONCAT('111-222-', LPAD(ROUND(RAND() * 9999), 4, '0')) as phoneNumber,
    CONCAT('Address ', FLOOR(RAND() * 100) + 1) as address
FROM (
    SELECT (ROW_NUMBER() OVER (ORDER BY (SELECT NULL))) + 100 AS orderID
    FROM Information_schema.tables s1
    JOIN Information_schema.tables s2
) AS orderData
WHERE orderID <= 200;

INSERT INTO Order_Supply (fProductID, orderID, quantity, fever)
SELECT
    FLOOR(RAND() * 100) + 1 as fProductID,
    FLOOR(RAND() * 100) + 101 as orderID,
    FLOOR(RAND() * 10) + 1 as quantity,
    CASE 
        WHEN RAND() < 0.25 THEN 'Low'
        WHEN RAND() >= 0.25 AND RAND() < 0.5 THEN 'Medium'
        WHEN RAND() >= 0.5 AND RAND() < 0.75 THEN 'High'
        ELSE 'None'
    END as fever
FROM (
    SELECT (ROW_NUMBER() OVER (ORDER BY (SELECT NULL))) AS orderSupplyID
    FROM Information_schema.tables s1
    JOIN Information_schema.tables s2
) AS orderSupplyData
WHERE orderSupplyID <= 100;

SET SQL_SAFE_UPDATES = 0;
UPDATE Customer AS c
JOIN Rank_Customer AS r ON c.allSpend >= r.lowBound AND c.allSpend < r.highBound
SET c.rankID = r.rankID
WHERE c.customerID IS NOT NULL;