db.accion.drop()
db.accion.insert({Ida:"R", deA:"Reserva"})
db.accion.insert({Ida:"O", deA:"Ocupación"})
db.accion.insert({Ida:"A", deA:"Anulación"})
db.accion.insert({Ida:"L", deA:"Login"})
db.accion.insert({Ida:"F", deA:"Logoff"})
db.accion.find()