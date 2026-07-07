// =====================================
// BOLETIM.JS - SISTEMA CPA4
// Gestão de boletins escolares
// =====================================


import {


    APP_STATE,


    salvarEstado


} from "./state.js";




import {


    buscarDados,


    adicionarDados,


    guardarDados


} from "./firebase.js";




import {


    gerarID,


    mensagem


} from "./utils.js";




import {


    usuarioAtual,


    temPermissao


} from "./auth.js";









// =====================================
// CARREGAR BOLETINS
// =====================================



async function carregarBoletins(){



    const dados =

    await buscarDados(

        "boletins"

    );







    APP_STATE.boletins =

    dados;







    salvarEstado();







    mostrarBoletins();



    return dados;



}









// =====================================
// MOSTRAR BOLETINS
// =====================================



function mostrarBoletins(){



    const area =

    document.getElementById(

        "boletimContent"

    );







    if(!area){



        return;



    }








    if(

        APP_STATE.boletins.length === 0

    ){



        area.innerHTML =



        `

        <div class="card">


        <h3>

        Nenhum boletim disponível

        </h3>


        </div>

        `;



        return;



    }








    let html =



    `

    <div class="cards">

    `;








    APP_STATE.boletins.forEach(

        boletim=>{



            html +=



            `

            <div class="card">


            <h3>

            ${boletim.aluno}

            </h3>



            <p>

            Classe:

            ${boletim.classe || "-"}

            </p>



            <p>

            Média:

            ${boletim.media || 0}

            </p>




            <button

            onclick="gerarBoletimPDFCPA4('${boletim.id}')">


            Gerar PDF


            </button>



            </div>


            `;



        }

    );







    html +=

    `

    </div>

    `;







    area.innerHTML =

    html;



}









// =====================================
// CRIAR BOLETIM
// =====================================



async function criarBoletim(

    dados

){



    const usuario =

    usuarioAtual();








    if(!usuario){



        mensagem(

            "Faça login",

            "erro"

        );



        return false;



    }








    if(

        !temPermissao(

            "boletim"

        )

    ){



        mensagem(

            "Sem permissão",

            "erro"

        );



        return false;



    }








    const boletim = {



        id:

        gerarID(),



        aluno:

        dados.aluno,



        idAluno:

        dados.idAluno || "",



        classe:

        dados.classe,



        disciplinas:

        dados.disciplinas || [],



        media:

        calcularMedia(

            dados.disciplinas || []

        ),



        criadoPor:

        usuario.nome,



        data:

        new Date()

        .toISOString()



    };








    await adicionarDados(

        "boletins",

        boletim

    );








    APP_STATE.boletins.push(

        boletim

    );







    salvarEstado();







    mensagem(

        "Boletim criado",

        "sucesso"

    );







    mostrarBoletins();



    return true;



}









// =====================================
// CALCULAR MÉDIA
// =====================================



function calcularMedia(

    disciplinas

){



    if(

        disciplinas.length === 0

    ){



        return 0;



    }








    let soma = 0;







    disciplinas.forEach(

        disciplina=>{



            soma +=

            Number(

                disciplina.nota

            );



        }

    );








    return (

        soma /

        disciplinas.length

    )

    .toFixed(

        2

    );



}









// =====================================
// PESQUISAR BOLETIM
// =====================================



function pesquisarBoletim(

    texto

){



    texto =

    texto.toLowerCase();








    return APP_STATE.boletins.filter(

        boletim=>



        boletim.aluno

        .

        toLowerCase()

        .

        includes(

            texto

        )

    );



}









// =====================================
// GERAR PDF DO BOLETIM
// =====================================



function gerarPDFBoletim(

    id

){



    const boletim =

    APP_STATE.boletins.find(

        item=>

        item.id === id

    );








    if(!boletim){



        return;



    }








    if(

        window.gerarBoletimPDF

    ){



        window.gerarBoletimPDF(

            boletim

        );



    }



}









window.gerarBoletimPDFCPA4 =

gerarPDFBoletim;









// =====================================
// INICIALIZAÇÃO
// =====================================



function iniciarBoletim(){



    carregarBoletins();



}








document.addEventListener(

    "DOMContentLoaded",

    ()=>{


        iniciarBoletim();



    }

);









// =====================================
// EXPORTAÇÕES
// =====================================



export {



    iniciarBoletim,


    carregarBoletins,


    criarBoletim,


    mostrarBoletins,


    calcularMedia,


    pesquisarBoletim


};
