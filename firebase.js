// =====================================
// FIREBASE.JS - SISTEMA CPA4
// Configuração Firebase + Firestore
// =====================================



import {


    initializeApp


} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";




import {


    getFirestore,


    collection,


    addDoc,


    getDocs,


    doc,


    setDoc,


    deleteDoc


} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";









// =====================================
// CONFIGURAÇÃO FIREBASE
// =====================================



const firebaseConfig = {


    apiKey:

    "AIzaSyBKgc_5jASgJ1qnRNpt299Z5KamVJcbVsM",



    authDomain:

    "sistemacpa4.firebaseapp.com",



    projectId:

    "sistemacpa4",



    storageBucket:

    "sistemacpa4.firebasestorage.app",



    messagingSenderId:

    "1089294198162",



    appId:

    "1:1089294198162:web:ee0775317e15c020b24d4b"



};









// =====================================
// INICIALIZAR FIREBASE
// =====================================



const app =

initializeApp(

    firebaseConfig

);








const db =

getFirestore(

    app

);









// =====================================
// ESTADO DA CONEXÃO
// =====================================



let firebaseOnline = false;









// Teste simples


async function verificarFirebase(){



    try{



        await getDocs(

            collection(

                db,

                "usuarios"

            )

        );







        firebaseOnline = true;



    }

    catch(erro){



        firebaseOnline = false;



        console.error(

            "Firebase offline:",

            erro

        );



    }







    atualizarEstadoFirebase();



}









function atualizarEstadoFirebase(){



    const elemento =

    document.getElementById(

        "estadoFirebase"

    );







    if(!elemento){



        return;



    }








    if(firebaseOnline){



        elemento.innerText =

        "Online";



        elemento.className =

        "status online";



    }

    else{



        elemento.innerText =

        "Offline";



        elemento.className =

        "status offline";



    }



}









// =====================================
// BUSCAR DADOS
// =====================================



async function buscarDados(

    tabela

){



    try{



        const resultado =

        await getDocs(

            collection(

                db,

                tabela

            )

        );







        const dados = [];







        resultado.forEach(

            item=>{



                dados.push(

                    {


                        id:item.id,


                        ...item.data()



                    }

                );



            }

        );








        firebaseOnline = true;



        atualizarEstadoFirebase();







        return dados;



    }

    catch(erro){



        console.error(

            "Erro ao buscar:",

            tabela,

            erro

        );







        firebaseOnline = false;



        atualizarEstadoFirebase();







        return [];



    }



}









// =====================================
// ADICIONAR DADOS
// =====================================



async function adicionarDados(

    tabela,

    dados

){



    try{



        const resultado =

        await addDoc(

            collection(

                db,

                tabela

            ),

            dados

        );







        firebaseOnline = true;



        atualizarEstadoFirebase();







        return resultado.id;



    }

    catch(erro){



        console.error(

            "Erro ao adicionar:",

            erro

        );







        return null;



    }



}









// =====================================
// GUARDAR / ATUALIZAR
// =====================================



async function guardarDados(

    tabela,

    id,

    dados

){



    try{



        await setDoc(

            doc(

                db,

                tabela,

                id

            ),

            dados

        );







        return true;



    }

    catch(erro){



        console.error(

            "Erro ao guardar:",

            erro

        );







        return false;



    }



}









// =====================================
// REMOVER DADOS
// =====================================



async function removerDados(

    tabela,

    id

){



    try{



        await deleteDoc(

            doc(

                db,

                tabela,

                id

            )

        );







        return true;



    }

    catch(erro){



        console.error(

            "Erro ao remover:",

            erro

        );







        return false;



    }



}









// =====================================
// INICIALIZAÇÃO
// =====================================



verificarFirebase();









// =====================================
// ESTADO FIREBASE (função)
// =====================================



function estadoFirebase(){



    return firebaseOnline;



}









// =====================================
// EXPORTAÇÕES
// =====================================



export {



    app,


    db,


    buscarDados,


    adicionarDados,


    guardarDados,


    removerDados,


    verificarFirebase,


    firebaseOnline,


    estadoFirebase


};
