db.system.js.save(
 {
     _id: "traerDisponibilidadCocheras",
     value : function(usuario, fecha) 
             { 
                var v_idusuario;
                var v_fecha;
                var v_items;
                var v_item;
                var v_id;
                var v__id;
                var v_garage;
                var allreservasArray1;
                var allreservasArray2;

                v_idusuario = usuario;// "fl"
                v_fecha = fecha;//"25/12/2016";

                //Borra le la colección temporaria los estados de las cocheras
                db.tmpEstado.remove({"idUsuario" : v_idusuario});


                //printjson(v_fecha);

                //printjson("Entra");

                var v_items = db.garages.find();

                //Recorre todas las cocheras 
                while(v_items.hasNext()) 
                    {
                        v_item = v_items.next();
                        v_id = v_item.id;
                        v_garage = v_item.garage;
                        v__id = v_item._id;
                        //printjson(v_garage);

                        //Busca si tiene una reserva al usuario ingresado
                         allreservasArray1 = db.reservations.find({
                            $and: [
                            { "idUsuario" : v_idusuario },
                            { "idCochera" : v_id },
                            { "fecha" : v_fecha }
                            ]
                            }).toArray();

                        //Si encontro reservas coloca a la cochera como Su reserva
                        if (allreservasArray1.length > 0) 
                         {
                                    db.tmpEstado.insert( {"_id" : v__id, "idUsuario" : v_idusuario, "id" : v_id , "garage" : v_garage, "Estado" : "Su reserva", "Posicion" : 3});
                         } 
                         else {
                                //Busca si existen reservas para la fecha 
                                 allreservasArray2 = db.reservations.find({
                                    $and: [
                                    { "idCochera" : v_id },
                                    { "fecha" : v_fecha }
                                    ]
                                    }).sort({ hora: 1 }).toArray();

                                    if (allreservasArray2.length <= 0) {
                                            db.tmpEstado.insert( {"_id" : v__id, "idUsuario" : v_idusuario, "id" : v_id , "garage" : v_garage, "Estado" : "Disponible", "Posicion" : 1});
                                    } else {
                                            var v_encontro;
                                            v_hora_check = 8;
                                            z = 0;
                                            v_encontro = 0;
                                            while(z < allreservasArray2.length) {
                                                    v_hora_base = Number(allreservasArray2[z].hora.substring(0, 2));
                                                    if (v_hora_check != v_hora_base) {
                                                            v_encontro = 1;
                                                            //printjson("Entra");
                                                    }
                                                    v_hora_check = v_hora_check + 1;
                                                    z = z + 1;
                                            }
                                            if ((v_encontro == 1) || (z < 11)) {
                                                    db.tmpEstado.insert( {"_id" : v__id, "idUsuario" : v_idusuario, "id" : v_id , "garage" : v_garage, "Estado" : "Reserva parcial", "Posicion" : 2});
                                            } else {
                                                    db.tmpEstado.insert( {"_id" : v__id, "idUsuario" : v_idusuario, "id" : v_id , "garage" : v_garage, "Estado" : "Reserva completa", "Posicion" : 4});
                                            }
                                    }
                                }
                       } //del While
                       
                       // Devuelve los estados para la chochera
                       return db.tmpEstado.find({"idUsuario" : v_idusuario},{"idUsuario" : 0, "Posicion" : 0}).sort({ Posicion: 1 }).toArray() ;
             }
 });

       