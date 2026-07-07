// =====================================
// CPA.JS - SISTEMA CPA4
// Controle de Avaliação e Desempenho
// =====================================



import {


    APP_STATE,


    salvarEstado


} from "./state.js";





import {


    adicionarDados,


    buscarDados,


    guardarDados


} from "./firebase.js";





import {


    gerarID,


    mensagem,


    formatarData


} from "./utils.js";





import {


    usuarioAtual,


    temPermissao


} from "./auth.js";









// =====================================
// CARREGAR CPA
// =====================================



async function carregarCPA(){



    const dados =

    await buscarDados(

        "cpa"

    );







    APP_STATE.cpa =

    dados;







    salvarEstado();







    mostrarCPA();



    return dados;



}









// =====================================
// MOSTRAR AVALIAÇÕES
// =====================================



function mostrarCPA(){



    const area =

    document.getElementById(

        "cpaContent"

    );








    if(!area){



        return;



    }








    if(

        APP_STATE.cpa.length === 0

    ){



        area.innerHTML =



        `

        <div class="card">


        <h3>

        Nenhuma avaliação cadastrada

        </h3>


        </div>

        `;



        return;



    }








    let html =



    `

    <div class="cards">

    `;








    APP_STATE.cpa.forEach(

        avaliacao=>{



            html +=



            `

            <div class="card">


            <h3>

            ${avaliacao.aluno}

            </h3>



            <p>

            Disciplina:

            ${avaliacao.disciplina}

            </p>



            <p>

            Nota:

            ${avaliacao.nota}

            </p>



            <small>

            Data:

            ${formatarData(

                avaliacao.data

            )}

            </small>


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
// ADICIONAR AVALIAÇÃO
// =====================================



async function adicionarCPA(

    dados

){



    const usuario =

    usuarioAtual();







    if(!usuario){



        mensagem(

            "Faça login primeiro",

            "erro"

        );



        return false;



    }








    if(

        !temPermissao(

            "cpa"

        )

    ){



        mensagem(

            "Sem permissão",

            "erro"

        );



        return false;



    }








    const avaliacao = {



        id:

        gerarID(),



        aluno:

        dados.aluno,



        idAluno:

        dados.idAluno || "",



        disciplina:

        dados.disciplina,



        nota:

        dados.nota,



        professor:

        usuario.nome,



        idProfessor:

        usuario.id,



        data:

        new Date()

        .toISOString()



    };








    await adicionarDados(

        "cpa",

        avaliacao

    );







    APP_STATE.cpa.push(

        avaliacao

    );







    salvarEstado();








    mensagem(

        "Avaliação adicionada",

        "sucesso"

    );








    mostrarCPA();







    return true;



}









// =====================================
// EDITAR NOTA
// =====================================



async function editarCPA(

    id,

    novaNota

){



    const avaliacao =

    APP_STATE.cpa.find(

        item=>

        item.id === id

    );








    if(!avaliacao){



        return false;



    }








    avaliacao.nota =

    novaNota;







    await guardarDados(

        "cpa",

        id,

        avaliacao

    );








    salvarEstado();



    mostrarCPA();



    return true;



}









// =====================================
// CALCULAR MÉDIA
// =====================================



function calcularMediaAluno(

    idAluno

){



    const notas =

    APP_STATE.cpa.filter(

        item=>

        item.idAluno === idAluno

    );








    if(

        notas.length === 0

    ){



        return 0;



    }








    const soma =

    notas.reduce(

        (

            total,

            item

        )=>



        total +

        Number(

            item.nota

        ),



        0

    );








    return (

        soma /

        notas.length

    )

    .toFixed(

        2

    );



}









// =====================================
// INICIALIZAÇÃO
// =====================================



function iniciarCPA(){



    carregarCPA();



}








document.addEventListener(

    "DOMContentLoaded",

    ()=>{


        iniciarCPA();



    }

);









// =====================================
// EXPORTAÇÕES
// =====================================



export {



    iniciarCPA,


    carregarCPA,


    mostrarCPA,


    adicionarCPA,


    editarCPA,


    calcularMediaAluno


};
