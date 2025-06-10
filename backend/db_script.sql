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

  select SCOPE_IDENTITY() as id;
end

-- update person
create procedure [dbo].[spUpdatePerson]
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
   Id,
   FirstName,
   LastName 
  from People;
end

-- person exists

create procedure spIsPersonExists
 @Id int 
as
begin
  select 
     case when exists(select 1 from People where Id=@Id) 
     then 1 
     else 0 end as personExists;
end

-- get by id

create procedure spGetPersonById
 @Id int
as
begin
  select
   Id, 
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