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
- `PATCH /api/users/assignCard/{id}` Add Cart To User
- `GET   /api/users/listSummaries` Show All Summaries
- `GET   /api/users/listSummaries/{id}` Show All Summaries Of A User

### Authentication
- `POST  /api/signup` Sign Up
- `POST  /api/login` Log In
- `POST  /api/forgotPassword` Forgot Password
- `PATCH /api/forgotPassword` Reset Password

### Cards
- `GET   /api/cards` Show All Cards
- `POST  /api/cards` Create a New Card

## To Do List

- [ ] Assigning card leads to card duplication on user.
- [x] If a user forgots the password, it should be resetable.
- [x] Signed up users should be able to log in.
- [x] Summary should be created when a new user signs up.
- [x] Added card model
- [x] Added sign-up
- [x] Added user model
