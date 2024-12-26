db = db.getSiblingDB(`${process.env.MONGO_DB}`);
db.createUser({
    user: "admin",
    pwd: "admin",  // Asegúrate de usar la misma contraseña que en el admin
    roles: [
      { role: "root", db: "admin" },  // Esto da acceso completo a la base de datos admin
      { role: "readWrite", db: `${process.env.MONGO_DB}` }  // Permite lectura y escritura en la base de datos Comunidades
    ]
  })

print('User admin created successfully');
