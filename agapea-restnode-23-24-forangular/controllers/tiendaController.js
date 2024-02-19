
const { initializeApp } = require('firebase/app');
const admin = require('firebase-admin');
const stripeservice = require("../servicios/servicioStripe");
const servicioPaypal = require("../servicios/servicioPaypal");
//OJO!! nombre variable donde se almacena la cuenta de acceso servicio firebase: FIREBASE_CONFIG (no admite cualquier nombre)
//no meter el json aqui en fichero de codigo fuente como dice la doc...
const app = initializeApp(JSON.parse(process.env.FIREBASE_CONFIG));
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.SERVICE_ACCOUNT)),
    databaseURL: 'https://ageapeaclase.firebaseio.com'
}, 'adminTiendaController');

const axios = require('axios');
//------------ CONFIGURACION ACCESO:  FIREBASE-AUTHENTICATION -------------
const { getAuth } = require('firebase/auth');

const auth = getAuth(app); //<--- servicio de acceso a firebase-authentication

//------------ CONFIGURACION ACCESO:  FIREBASE-DATABASE -------------------
const { getFirestore, getDocs, collection, where, query, doc,
    addDoc, getDoc, orderBy, startAt, updateDoc, arrayUnion, arrayRemove } = require('firebase/firestore');

const db = getFirestore(app); //<---- servicio de acceso a todas las colecciones de la BD definida en firebase-database



function generaRespuesta(codigo, mensaje, errores, token, datoscliente, otrosdatos, res) {
    //if(req.body.refreshtoken) token=req.body.refreshtoken;
    res.status(200).send({ codigo, mensaje, errores, token, datoscliente, otrosdatos });
}

module.exports = {
    recuperarProvincias: async (req, res, next) => {
        try {
            let _resp = await axios.get(`https://apiv1.geoapi.es/provincias?type=JSON&key=${process.env.GEOAPI_KEY}&sandbox=0`);
            let _provs = _resp.data.data;
            /*
            let _snapProvs = await getDocs(collection(db, 'provincias'), orderBy('PRO'));

            let _provs = [];
            _snapProvs.forEach(snapProv => _provs.push(snapProv.data()));
            */
            res.status(200).send(_provs);

        } catch (error) {
            console.log('error al recuperar provincias...', error);
            res.status(200).send([]);
        }
    },
    recuperarMunicipios: async (req, res, next) => {
        try {
            let _codpro = req.query.codpro;
            let _resp = await axios.get(`https://apiv1.geoapi.es/municipios?CPRO=${_codpro}&type=JSON&key=${process.env.GEOAPI_KEY}&sandbox=0`);
            let _munis = _resp.data.data;
            /*
            console.log('recuperando municipios de provincia...', _codpro);

            let _snapMunis = await getDocs(collection(db, 'municipios'), orderBy('DMUN50'), where('CPRO', '==', _codpro));

            let _munis = [];
            _snapMunis.forEach(snapMuni => _munis.push(snapMuni.data()));*/
            res.status(200).send(_munis)

        } catch (error) {
            console.log('error al recuperar municipios...', error);
            res.status(200).send([]);
        }
    },
    recuperarLibros: async (req, res, next) => {
        try {
            let _idcat = req.query.idcat;
            console.log('recuperando libros de categoria...', _idcat);
            //firebase NO PUEDE BUSCAR POR PATRONES dentro de un campo de texto, como cualquier otra bd...solucion? o bajas toda la coleccion de libros y buscas del lado del cliente
            //o buscas api externas de busqueda de texto: https://firebase.google.com/docs/firestore/solutions/search?provider=algolia
            //muy usadas como algolia,elastic,...
            let _snapshotibros = await getDocs(query(collection(db, 'libros'), orderBy('IdCategoria'), startAt(_idcat)));
            let _libros = [];
            _snapshotibros.forEach(snaplibro => _libros.push(snaplibro.data()));

            res.status(200).send(_libros);

        } catch (error) {
            console.log('error al recuperar libros...', error);
            res.status(200).send([]);

        }
    },
    recuperarUnLibro: async (req, res, next) => {
        try {
            let _isbn = req.query.isbn;
            console.log('recuperando libro con isbn...', _isbn);

            let _librosnaps = await getDocs(query(collection(db, 'libros'), where('ISBN13', '==', _isbn)));
            let _libro = {};
            _librosnaps.forEach(librosnap => _libro = librosnap.data());

            res.status(200).send(_libro);

        } catch (error) {
            console.log('error al recuperar libro por isbn...', error);
            res.status(200).send(undefined);
        }
    },
    recuperarCategorias: async (req, res, next) => {
        try {
            let _idcat = req.query.idcat;
            let _regex;
            if (_idcat == "raices") {
                _regex = new RegExp("^[0-9]{1,}$");
            } else {
                _regex = new RegExp("^" + _idcat + "-[0,9]{1,}$")
            }
            let _catSnaps = await getDocs(collection(db, 'categorias'));

            let _cats = [];
            _catSnaps.forEach(catdoc => _cats.push(catdoc.data()));

            res.status(200).send(_cats.filter(cat => _regex.test(cat.IdCategoria)).sort((a, b) => parseInt(a.IdCategoria) < parseInt(b.IdCategoria) ? -1 : 1));

        } catch (error) {
            console.log('error recuperar categorias...', error);
            res.status(200).send([]);
        }
    },
    finalizarPedido: async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                throw new Error('no hay token en cabecera');
            }
            const tokenprueba = await admin.auth().verifyIdToken(token);

            const email = tokenprueba.email;

            let { pedido } = req.body;
            console.log('Datos del pedido...', pedido);

            /// Creo un objeto pedido a insertar sin los datos de la tarjeta
            let _pedidoInsert = {
                idPedido: pedido.idPedido,
                fechaPedido: pedido.fechaPedido,
                estadoPedido: pedido.estadoPedido,
                elementosPedido: pedido.elementosPedido,
                subtotalPedido: pedido.subTotalPedido,
                gastosEnvioPedido: pedido.gastosEnvio,
                totalPedido: pedido.totalPedido,
                datosPago: {
                    tipodireccionenvio: pedido.datosPago.tipodireccionenvio,
                    direccionEnvio: pedido.datosPago.direccionEnvio,
                    nombreEnvio: pedido.datosPago.nombreEnvio,
                    apellidosEnvio: pedido.datosPago.apellidosEnvio,
                    telefonoEnvio: pedido.datosPago.telefonoEnvio,
                    emailEnvio: pedido.datosPago.emailEnvio,
                    metodoPago: pedido.datosPago.metodoPago,
                }
            }
            //let _resultInsertPedido = await addDoc(collection(db, 'pedidos'), _pedidoInsert);
            //Añadimos el pedido directamente al cliente
            let _clienteSnapshot = await getDocs(query(collection(db, 'clientes'), where('cuenta.email', '==', email)));
            let idcliente = _clienteSnapshot.docs[0].id;
            let docRef = doc(db, 'clientes', idcliente);
            //Añadimos el pedido directamente al cliente
            let _resultInsert = await updateDoc(docRef, {
                pedidos: arrayUnion(pedido)
            });
            if (_pedidoInsert.datosPago.metodoPago === 'pagopaypal') {
                let _resp = await servicioPaypal.crearPagoPAYPAL(email, _pedidoInsert);
                console.log('respuesta de paypal...', _resp);
                generaRespuesta(0, _resp, null, null, null, null, res);
            } else {
                let _respidCustomer = await stripeservice.createCustomer(_pedidoInsert);
                let _respidCard = await stripeservice.createCardFromCustomer(_respidCustomer);
                let _respidCharge = await stripeservice.createCharge(_respidCustomer, _respidCard, _pedidoInsert.totalPedido, _pedidoInsert.idPedido);
                if (_respidCard !== 'succeeded') {
                    throw new Error('Error al finalizar el pago con tarjeta');
                }
                generaRespuesta(0, _resp, null, null, null, null, res);
            }
        } catch (error) {
            console.log('error al finalizar pedido...', error);
            generaRespuesta(1, 'error al finalizar pedido en servicio de nodejs contra firebase', error.message, null, null, null, res);

        }
    },
    PayPalCallBack: async (req, res, next) => {

        let { email, idpedido, cancel } = req.query;
        //necesito obtener el id-pago generado por paypal para el pedido
        //Actualizamos el pedido que se encuentra en el cliente
        let _pagoSnapshot = await getDocs(
            query(
                collection(db, "pagosPayPal"),
                where("idpedido", "==", idpedido),
                where("idcliente", "==", email)
            )
        );

        let _pago = _pagoSnapshot.docs[0].data();
        let _finPagoOk = await servicioPaypal.finalizarPagoPAYPAL(_pago.idpago);

        if (!_finPagoOk || cancel == true)
            throw new Error("Error al finalizar pago con PAYPAL");
        let _clienteSnapshot = await getDocs(
            query(collection(db, "clientes"), where("cuenta.email", "==", email))
        );
        //Actualizamos el pedido que se encuentra en el cliente
        let _idCliente = _clienteSnapshot.docs[0].id;
        let docRef = doc(db, "clientes", _idCliente);
        // Obtén el documento
        let docSnapshot = await getDoc(docRef);

        // Asegúrate de que el documento exista y tenga un campo pedidosCliente
        if (
            docSnapshot.exists &&
            Array.isArray(docSnapshot.data().pedidosCliente)
        ) {
            // Encuentra el índice del pedido que quieres actualizar
            let index = docSnapshot
                .data()
                .pedidosCliente.findIndex((pedido) => pedido.idPedido === idpedido);

            // Si el pedido existe en el array
            if (index !== -1) {
                // Crea una copia del array pedidosCliente
                let pedidosCliente = [...docSnapshot.data().pedidosCliente];

                // Actualiza el estado del pedido
                pedidosCliente[index].estadoPedido = "pagado";

                // Actualiza el documento con el nuevo array
                let _resultUpdate = await updateDoc(docRef, { pedidosCliente });
            }
        }
        res
            //http://localhost:4200/Tienda/PedidoFinalizado?email=alexanderbelmont2103@gmail.com&idpedido=4acb5dd1-deae-4e58-8641-90dc7f6e949f%22
            .status(200)
            .redirect(
                `http://localhost:4200/Tienda/PedidoFinalizado?email=${email}&idpedido=${idpedido}`
            );

    },
    buscarLibros: async (req, res, next) => {
        // Crear una referencia a la colección de libros
        console.log("buscando libros con el patrón:", req.params.busqueda);
        let busqueda = req.params.busqueda;
        let librosRef = collection(db, "libros");

        //Cogemos todos los libros de la coleccion, y después filtramos por el patrón
        const librosSnap = await getDocs(librosRef);
        let libros = [];
        librosSnap.forEach((doc) => {
            if (
                doc.data().Titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                doc.data().Autores.toLowerCase().includes(busqueda.toLowerCase()) ||
                doc.data().ISBN13.toLowerCase().includes(busqueda.toLowerCase())
            ) {
                libros.push(doc.data());
            }
        });
        res.status(200).send(libros);
    }


}