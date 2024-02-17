//para inicializar firebase:  https://firebase.google.com/docs/web/setup?authuser=0&hl=es#add-sdks-initialize

const { initializeApp } = require('firebase/app');
//OJO!! nombre variable donde se almacena la cuenta de acceso servicio firebase: FIREBASE_CONFIG (no admite cualquier nombre)
//no meter el json aqui en fichero de codigo fuente como dice la doc...
const app = initializeApp(JSON.parse(process.env.FIREBASE_CONFIG));

//------------ CONFIGURACION ACCESO:  FIREBASE-AUTHENTICATION -------------
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
    sendEmailVerification, checkActionCode, applyActionCode, sendPasswordResetEmail
    , confirmPasswordReset } = require('firebase/auth');

const auth = getAuth(app); //<--- servicio de acceso a firebase-authentication

//------------ CONFIGURACION ACCESO:  FIREBASE-DATABASE -------------------
const { getFirestore, getDocs, collection, where, query, addDoc,
    getDoc, updateDoc, doc, arrayRemove, arrayUnion } = require('firebase/firestore');

const db = getFirestore(app); //<---- servicio de acceso a todas las colecciones de la BD definida en firebase-database

function generaRespuesta(codigo, mensaje, errores, token, datoscliente, otrosdatos, res) {
    //if(req.body.refreshtoken) token=req.body.refreshtoken;
    res.status(200).send({ codigo, mensaje, errores, token, datoscliente, otrosdatos });
}


module.exports = {
    login: async (req, res, next) => {
        try {
            console.log('datos mandados por servicio de angular...', req.body); //{email: ..., password: ....}

            //1º inicio de sesion en FIREBASE con email y password:
            // https://firebase.google.com/docs/auth/web/password-auth?authuser=0&hl=es#sign_in_a_user_with_an_email_address_and_password
            let _userCredential = await signInWithEmailAndPassword(auth, req.body.email, req.body.password);
            //console.log('resultado del login en firebase ....', _userCredential);

            //2º recuperar de la bd de firebase-firestore de la coleccion clientes los datos del cliente asociados al email de la cuenta
            //y almacenar el JWT q firebase a originado por nosotros 
            //https://firebase.google.com/docs/firestore/query-data/get-data?hl=es&authuser=0#get_multiple_documents_from_a_collection
            let _clienteSnapShot = await getDocs(query(collection(db, 'clientes'), where('cuenta.email', '==', req.body.email)));
            //console.log('snapshot recuperado de clientes...', _clienteSnapShot);
            let _datoscliente = _clienteSnapShot.docs.shift().data();

            console.log('datos del clietne recuperados...', _datoscliente);

            res.status(200).send(
                {
                    codigo: 0,
                    mensaje: 'login oks...',
                    error: null,
                    datoscliente: _datoscliente,
                    token: await _userCredential.user.getIdToken(),
                    otrosdatos: null
                }
            );

        } catch (error) {
            console.log('error en el login....', error);
            res.status(200).send(
                {
                    codigo: 1,
                    mensaje: 'Login fallido, credenciales incorrectas',
                    error: error.message,
                    datoscliente: null,
                    token: null,
                    otrosdatos: null
                }
            );
        }
    },
    registro: async (req, res, next) => {
        try {
            console.log('datos recibidos por el servicio de angular desde comp.registro...', req.body);
            let { cuenta, ...restocliente } = req.body.body.cliente;
            let password = req.body.body.password;

            console.log('cuenta y resto cliente...', cuenta);
            console.log('password...', password);

            //1º creacion de una cuenta FIREBASE dentro de Authentication basada en email y contraseña:
            //https://firebase.google.com/docs/auth/web/password-auth?authuser=0&hl=es#create_a_password-based_account
            let _userCredential = await createUserWithEmailAndPassword(auth, cuenta.email, password);
            console.log('resultado creacion creds. usuario  recien registrado....', _userCredential);

            //2º mandamos email de activacion de cuenta:
            await sendEmailVerification(_userCredential.user);

            //3º almacenamos los datos del cliente (nombre, apellidos, ...) en coleccion clientes de firebase-database
            //https://firebase.google.com/docs/firestore/manage-data/add-data?hl=es&authuser=0#add_a_document
            let _clienteRef = await addDoc(collection(db, 'clientes'), req.body.body.cliente);
            console.log('ref.al documento insertado en coleccion clientes de firebase...', _clienteRef);


            res.status(200).send(
                {
                    codigo: 0,
                    mensaje: 'registro oks...',
                    error: null,
                    datoscliente: _userCredential.user,
                    token: await _userCredential.user.getIdToken(),
                    otrosdatos: null
                }
            );
        } catch (error) {
            console.log('error en el registro....', error);
            res.status(200).send(
                {
                    codigo: 1,
                    mensaje: 'registro fallido',
                    error: error.message,
                    datoscliente: null,
                    token: null,
                    otrosdatos: null
                }
            );
        }
    },
    comprobarEmail: async (req, res, next) => {
        try {
            let _email = req.query.email;
            console.log('email en parametro...', _email);
            console.log(_email);

            const q = query(collection(db, 'clientes'), where('cuenta.email', '==', _email));
            const _clienteSnapShot = await getDocs(q);
            console.log('snapshot recuperado de clientes...', _clienteSnapShot.docs);
            let _datoscliente = _clienteSnapShot.docs.shift().data();

            console.log('datos del clietne recuperados con ese email....', _datoscliente);
            if (_datoscliente) {
                res.status(200).send(
                    {
                        codigo: 0,
                        mensaje: 'email existe',
                        error: null,
                        datoscliente: _datoscliente,
                        token: null,
                        otrosdatos: null
                    }
                );

            } else {
                throw new Error('no existe cliente con ese email, email no registrado');
            }
        } catch (error) {
            console.log('error en el comprobacion email....', error);
            res.status(200).send(
                {
                    codigo: 1,
                    mensaje: 'comprobacion email fallida',
                    error: error.message,
                    datoscliente: null,
                    token: null,
                    otrosdatos: null
                }
            );
        }

    },
    activarCuenta: async (req, res, next) => {
        try {
            let { mod, cod, key } = req.query;
            //1º comprobar si el token de activacion de la cuenta es para verificar-email o no 
            // lo ideal tb seria comprobar q el token enviado pertenece al usuario q quiere activar la cuenta (su email)
            let _actionCodeInfo = await checkActionCode(auth, cod); //<---objeto clase ActionCodeInfo
            console.log('actioncodeinfo en activar cuenta usuario firebase....', _actionCodeInfo);

            let _email = _actionCodeInfo.data.email;

            if (_actionCodeInfo.operation == 'VERIFY_EMAIL') {
                //en _actionCodeInfo.data <--- email, comprobar si exite en clientes...
                await applyActionCode(auth, cod);
                //actualizar en coleccion clientes el campo cuenta.cuentaActiva a true
                const q = query(collection(db, 'clientes'), where('cuenta.email', '==', _email));
                const _clienteSnapShot = await getDocs(q);
                console.log('snapshot recuperado de clientes...', _clienteSnapShot.docs.shift().data);
                await updateDoc(doc(db, 'clientes', _clienteSnapShot.docs.shift().id), { 'cuenta.cuentaActiva': true });
                res.status(200).send(
                    {
                        codigo: 0,
                        mensaje: 'activacion cuenta oks',
                        error: null,
                        datoscliente: null,
                        token: null,
                        otrosdatos: null
                    }
                );

            } else {
                throw new Error('token no valido para verificar EMAIL...');
            }

        } catch (error) {
            console.log('error en activacion cuenta usuario....', error);
            res.status(200).send(
                {
                    codigo: 1,
                    mensaje: 'activacion cuenta fallida',
                    error: error.message,
                    datoscliente: null,
                    token: null,
                    otrosdatos: null
                }
            );
        }

    },
    operarDireccion: async (req, res, next) => {
        console.log(req.body); //{ direccion:..., operacion: ..., email: ...}
        try {
            //recupero de la coleccion clientes el documento con ese email, lanzo query:
            let _refcliente = (await getDocs(query(collection(db, 'clientes'), where('cuenta.email', '==', req.body.email)))).docs[0];
            console.log('cliente recuperado de firebase-database...', _refcliente.data());

            switch (req.body.operacion) {
                case 'borrar':
                    //tengo elimiinar del array de direcciones del objeto cliente recuperado la direccion q nos pasan: arrayRemove
                    await updateDoc(_refcliente.ref, { 'direcciones': arrayRemove(req.body.direccion) });
                    break;

                case 'crear':
                    //tengo q añadir al array de direcciones del objeto cliente recuperado la nueva direccion:  arrayUnion
                    await updateDoc(_refcliente.ref, { 'direcciones': arrayUnion(req.body.direccion) });
                    break;

                case 'fin-modificacion':
                    //dos posibilidades: accedes a direccion, la recuperas y vas modificandop prop.por prop o eliminas y añades
                    let _direcciones = _refcliente.data().direcciones;
                    let _posmodif = _direcciones.findIndex(direc => direc.idDireccion == req.body.direccion.idDireccion);
                    _direcciones[_posmodif] = req.body.direccion;

                    await updateDoc(_refcliente.ref, { 'direcciones': _direcciones });
                    break;
            }

            //OJO!!! si usas la ref.al documento cliente de arriba, es un snapshot...no esta actualizada!!!! a las nuevas
            //direcciones, tienes q volver a hacer query...esto no vale:
            //let _clienteActualizado=(await getDoc(doc(db,'clientes',_refcliente.id))).data();
            let _clienteActualizado = (await getDocs(query(collection(db, 'clientes'), where('cuenta.email', '==', req.body.email)))).docs[0].data();

            console.log('cliente actualizado mandado en el restmessage....', _clienteActualizado);

            generaRespuesta(0, `${req.body.operacion} sobre direccion realizada OK!!`, null, '', _clienteActualizado, '', res);

        } catch (error) {
            console.log('error en operar direcciones...', error);
            generaRespuesta(6, `fallo a la hora de ${req.body.operacion} sobre direccion ${req.body.direccion.calle} al guardar en bd...`, error, null, null, null, res);
        }
    },
    uploadImagen: async (req, res, next) => {
        try {
            //tengo q coger la extension del fichero, en req.body.imagen:  data:image/jpeg
            let _nombrefichero = 'imagen____' + req.body.emailcliente;//  + '.' + req.body.imagen.split(';')[0].split('/')[1]   ;
            console.log('nombre del fichero a guardar en STORGE...', _nombrefichero);
            let _result = await uploadString(ref(storage, `imagenes/${_nombrefichero}`), req.body.imagen, 'data_url'); //objeto respuesta subida UploadResult         

            //podrias meter en coleccion clientes de firebase-database en prop. credenciales en prop. imagenAvatar
            //el nombre del fichero y en imagenAvatarBASE&$ el contenido de la imagen...
            let _refcliente = await getDocs(query(collection(db, 'clientes'), where('cuenta.email', '==', req.body.emailcliente)));
            _refcliente.forEach(async (result) => {
                await updateDoc(result.ref, { 'cuenta.imagenAvatarBASE64': req.body.imagen });
            });

            generaRespuesta(0, 'Imagen avatar subida OK!!! al storage de firebase', '', null, null, null, res);
        } catch (error) {
            console.log('error subida imagen...', error);
            generaRespuesta(5, 'fallo a la hora de subir imagen al storage', error, null, null, null, res);

        }
    },
    updateDatosCliente: async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                throw new Error('no hay token en cabecera');
            }
            const idcliente = (await auth.verifyIdToken(token)).uid;
            const email = (await auth.verifyIdToken(token)).email;
            let { datoscliente, password } = req.body;
            const datosactualizados = await updateDoc(doc(db, 'clientes', idcliente), datoscliente);
            console.log('datos actualizados en firebase...', datosactualizados);
            //Si la password no esta vacia, enviamos email de cambio de contraseña
            if (String.length(password) > 0) {
                const actionCodeSettings = {
                    url: `http://localhost:4200/Cliente/CambioContraseñaOk?email=${email}&pass=${password}`,
                    iOS: {
                        bundleId: 'com.example.ios'
                    },
                    android: {
                        packageName: 'com.example.android',
                        installApp: true,
                        minimumVersion: '12'
                    },
                    handleCodeInApp: true
                };
                await sendPasswordResetEmail(auth, email, actionCodeSettings);
                generaRespuesta(1, 'Datos cliente actualizados OK!!!', '', token, datosactualizados, null, res);

            }
            generaRespuesta(0, 'Datos cliente actualizados OK!!!', '', token, datosactualizados, null, res);

        } catch (error) {
            console.log('error en UpdateDatosCliente...', error);
            generaRespuesta(5, 'fallo a la hora de actualizar datos', error, null, null, null, res);
        }

    },
    confirmarCambioContraseña: async (req, res, next) => {
        try {
            const { email, token, pass } = req.query;
            const resp = await confirmPasswordReset(auth, token, pass);
            console.log('respuesta de confirmacion cambio contraseña...', resp);
            generaRespuesta(0, 'Cambio contraseña confirmado OK!!!', '', null, null, null, res);
        } catch (error) {
            generaRespuesta(1, 'Cambio contraseña con errores', error.message, null, null, null, res);
        }
    }
}