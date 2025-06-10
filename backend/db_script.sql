use master
go

create database PersonDb
go

use PersonDb
go

create table People
(
  Id int identity,
  FirstName nvarchar(30) not null,
  LastName nvarchar(30) not null

  constraint PK_Person_Id primary key (Id)
)
go

insert into People (FirstName,LastName)
values 
('John','Doe'),
('Mike','Clark')
go

-- People table procedures

-- create person
create procedure spCreatePerson
  @FirstName nvarchar(30),
  @LastName nvarchar(30)
as
begin
  insert into People (FirstName,LastName)
  values (@FirstName,@LastName);

  select SCOPE_IDENTITY();
end

-- update person
create procedure spGetPeople
  @Id int,
  @FirstName nvarchar(30),
  @LastName nvarchar(30)
as
begin
  update People 
  set FirstName=@FirstName, LastName=@LastName
  where Id=@Id;   
end   

-- get all
create procedure spGetPeople
as
begin
  select 
   FirstName,
   LastName 
  from People;
end

-- get by id

create procedure spGetPersonById
 @Id int
as
begin
  select 
   FirstName,
   LastName 
  from People
  where Id=@Id;
end   

-- delete

create procedure spDeletePerson
  @Id int 
as
begin
  delete from People where Id=@Id;
end  