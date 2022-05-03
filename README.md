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
- `GET /api/users` Show All Users
- `PATCH /api/users/assignCard/{id}` Add Cart To User

### Authentication
- `POST /api/signup` Sign Up

### Cards
- `GET /api/cards` Show All Cards
- `POST /api/cards` Create a New Card

## To Do List

- [ ] Card numbers must be masked on the response.
- [ ] CVV numbers must be hidden on the response.
- [x] Added card model
- [x] Added sign-up
- [x] Added user model
