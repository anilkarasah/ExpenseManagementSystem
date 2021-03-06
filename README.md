# Expense Management System

System designing project for my college lecture.
Contributors: 
- Anıl Karaşah (me)
- Nasır Sabır @nasirsabir
- Atakan Arslan @taqanarslan
- Yasemin Atmaca @yaseminatmaca
- Umut Deşer @deserumut

## To Install

1. Clone this repository to a local folder on your computer.
2. Open a command prompt on that folder.
3. Type `npm init`. Required modules will get downloaded to a folder.
4. Type `npm start`.
5. Server should open.

#### Required Environment Variables

- NODE_ENV (`development` or `production`)
- PORT
- DATABASE (MongoDB Atlas connection string)
- DATABASE_PASSWORD (password for Atlas)
- JWT_SECRET (a string for hashing JSON Web Token)
- JWT_EXPIRES_IN (default: 90d)
- JWT_COOKIE_EXPIRES_IN (default: 30)

## API Documentation

You can view the documentation of the API via [Postman Documentation of EMS](https://documenter.getpostman.com/view/19777122/UyxjEkai)

## To Do List

- [x] User should be able to see all of his/her cards.
- [x] User information should be kept in the request object after login.
- [x] JWT should be created after login is successful.
- [x] Assigning card leads to card duplication on user.
- [x] If a user forgots the password, it should be resetable.
- [x] Signed up users should be able to log in.
- [x] Summary should be created when a new user signs up.
- [x] Added card model
- [x] Added sign-up
- [x] Added user model
