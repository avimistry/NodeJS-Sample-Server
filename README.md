# NodeJS-Sample-Server
Simple Backend server based on NodeJS and MongoDB using docker

Contain Simple APIs
1) User Login (POST /login)
2) User Register (POST /user)
3) User List (GET /user)
4) User List with pagination (GET /user/{page})
5) User Detail (GET /user/{id})
6) User Update (PUT /user/{id})
7) User Delete (DELETE /user/{id})
8) Forgot Password (POST /forgotpassword)
9) Reset Password (POST /resetpassword)

There is default user in database with credential email: admin@nodejs.com and password: admin

For forgot password, new password will be generated and sent via email. This password is temporary password that needs to changed using reset password.

If you want to receive email than you need to update add your gmail account email as user and password in base64 format in mail_configuration field of NodeJS/config.js. Refer https://www.base64encode.org/ to encode email and password to base64.