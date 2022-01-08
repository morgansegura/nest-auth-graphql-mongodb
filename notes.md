### <b>Objective: </b> Create an authentication app with NestJS, GraphQL, TypeORM and MongoDB

#### Auth Checklist:

1. Create a new user
2. Email authentication
3. Securely signin user
4. Permission roles set on signup, default: ['user', 'admin', 'mediator']
5. Manually enforced mediator
6. Securely logout
7. Mediator can assign roles and delete, or block users
8. Forgot password

#### User Checklist:

1. CRUD User Profile

src/
app.module.ts
main.ts
auth/
inputs/
login-user.input.ts
login-user.input.ts
auth.entity.ts
auth.module.ts
auth.resolver.ts
auth.service.ts
auth.type.ts

Password

- Passwords will contain at least 1 upper case letter
- Passwords will contain at least 1 lower case letter
- Passwords will contain at least 1 number or special character
- There is no length validation (min, max) in this regex!

/(?:(?=._\d)|(?=._\W+))(?![.\n])(?=._[A-Z])(?=._[a-z]).\*$/

Depemdencies:

npm i --save @nestjs/graphql @nestjs/typeorm typeorm apollo-server-express grapnel graphql-tools mongodb uuid class-validator class-transformer bcrypt @nestjs/jwt @nestjs/passport passport passport-jwt passport-local

Dev Dependencies:

npm i -D @types/uuid @types/bcrypt @types/passport-jwt @types/passport @types/passport-local
