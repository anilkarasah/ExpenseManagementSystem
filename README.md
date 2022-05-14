# Expense Management System
System designing project for my college lecture.
Contributors: 
- Anıl Karaşah (me)
- Nasır Sabır @nasirsabir
- Atakan Arslan @taqanarslan
- Yasemin Atmaca @yaseminatmaca
- Umut Deşer @deserumut

## API Features

### Users
- `GET   /api/users` Show All Users

### Authentication
- `POST  /api/users/signup` Sign Up
- `POST  /api/users/login` Log In
- `POST  /api/users/forgotPassword` Forgot Password
- `PATCH /api/users/forgotPassword` Reset Password

### Cards
- `GET   /api/cards` Show All Cards
- `POST  /api/cards` Create a New Card
- `PATCH /api/cards/assign` Assign Card

### Summaries
- `GET   /api/users/summaries` Show All Summaries
- `GET   /api/users/summaries/{userID}` Get Summaries of User

## To Do List

- [ ] User information should be kept in the request object after login.
- [ ] JWT should be created after login is successful.
- [x] Assigning card leads to card duplication on user.
- [x] If a user forgots the password, it should be resetable.
- [x] Signed up users should be able to log in.
- [x] Summary should be created when a new user signs up.
- [x] Added card model
- [x] Added sign-up
- [x] Added user model
