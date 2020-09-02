const functions = require('firebase-functions');
let admin = require('firebase-admin');
let firebaseToken = require('./firebaseToken.json')
let express = require('express');
let cors = require("cors");
admin.initializeApp({
    credential: admin.credential.cert(firebaseToken),
    databaseURL: "https://als-18.firebaseio.com"
})
let db = admin.firestore();
let app = express();
app.use(cors());


app.post("/code",function(request, response){
    let code;
    if(typeof request.body == "object"){
         code = request.body.code;
    }else{
        code = JSON.parse(request.body);
        code = code.code;
    }
    let cards = db.collection("cards").doc(code.toString());
    let result = {};
    let getCard = cards.get()
        .then(doc=>{
            if(doc.exists){
                result = { 
                    data:  doc.data(),
                    message: "Funcionó.",
                    error: false
                }
            }else{
                result = { 
                    data:  doc.data(),
                    message: "Parece que este código no existe.",
                    error: true
                }
            }
            response.status(200).send(result);
        })
        .catch(err=>{
            result = { 
                message: "Hubo un error en la base de datos.",
                error: true
            }
            response.status(400).send(result);
        })
})

exports.checkCard = functions.https.onRequest(app);
