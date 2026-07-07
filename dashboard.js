// =====================================
// DASHBOARD.JS - SISTEMA CPA4
// Painel principal
// =====================================



import {


    APP_STATE,


    salvarEstado


} from "./state.js";






import {


    buscarDados,


    estadoFirebase


} from "./firebase.js";









// =====================================
// CARREGAR DADOS
// =====================================



async function carregarDashboard(){



    try{



        const alunos =

        await buscarDados(

            "alunos"

        );






        const professores =

        await buscarDados(

            "usuarios"

        );







        const materiais =

        await buscarDados(

            "materiais"

        );







        const escolas =

        await buscarDados(

            "escolas"

        );








        APP_STATE.dashboard = {



            alunos:

            alunos.length,



            professores:

            professores.filter(

                u=>

                u.perfil === "professor"

            )

            .length,



            materiais:

            materiais.length,



            escolas:

            escolas.length



        };








        salvarEstado();







        atualizarCards();



        atualizarEstadoFirebase();



        atualizarDataHora();



        gerarRanking();



        gerarAlertas();





    }

    catch(erro){



        console.error(

            "Erro dashboard:",

            erro

        );



    }



}









// =====================================
// ATUALIZAR CARTÕES
// =====================================



function atualizarCards(){



    const dados =

    APP_STATE.dashboard || {};







    const alunos =

    document.getElementById(

        "totalAlunos"

    );







    const escolas =

    document.getElementById(

        "totalEscolas"

    );







    const turmas =

    document.getElementById(

        "totalTurmas"

    );








    if(alunos){



        alunos.innerText =

        dados.alunos || 0;



    }








    if(escolas){



        escolas.innerText =

        dados.escolas || 0;



    }








    if(turmas){



        turmas.innerText =

        APP_STATE.turmas

        ?

        APP_STATE.turmas.length

        :

        0;



    }



}

// =====================================
// ESTADO FIREBASE
// =====================================



function atualizarEstadoFirebase(){



    const elemento =

    document.getElementById(

        "estadoFirebase"

    );








    if(!elemento){



        return;



    }








    if(

        estadoFirebase()

    ){



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
// DATA E HORA
// =====================================



function atualizarDataHora(){



    const elemento =

    document.getElementById(

        "dataHoraSistema"

    );








    if(elemento){



        elemento.innerText =



        new Date()

        .toLocaleString(

            "pt-PT"

        );



    }



}









// =====================================
// RANKING DE ALUNOS
// =====================================



async function gerarRanking(){



    const area =

    document.getElementById(

        "ranking"

    );








    if(!area){



        return;



    }








    const alunos =

    await buscarDados(

        "alunos"

    );








    alunos.sort(

        (

            a,

            b

        )=>



        (

            b.media || 0

        )

        -

        (

            a.media || 0

        )

    );








    let html =



    `

    <div class="card">


    <h3>

    Ranking dos Alunos

    </h3>


    <ul class="ranking-list">


    `;








    alunos

    .slice(

        0,

        5

    )

    .forEach(

        (

            aluno,

            index

        )=>{



            html +=



            `

            <li>


                <span class="posicao">

                ${index + 1}

                </span>



                <span>

                ${aluno.nome || "Aluno"}

                </span>



                <strong>

                ${aluno.media || 0}

                valores

                </strong>



            </li>


            `;



        }

    );







    html +=



    `

    </ul>

    </div>

    `;







    area.innerHTML =

    html;



}









// =====================================
// ALERTAS DO SISTEMA
// =====================================



function gerarAlertas(){



    const area =

    document.getElementById(

        "alertasSistema"

    );








    if(!area){



        return;



    }








    let alertas=[];







    if(

        !APP_STATE.dashboard

        ||

        APP_STATE.dashboard.alunos === 0

    ){



        alertas.push(

            "Ainda não existem alunos cadastrados"

        );



    }







    if(

        !estadoFirebase()

    ){



        alertas.push(

            "Sem ligação com Firebase"

        );



    }








    let html =



    `

    <div class="card">


    <h3>

    Alertas

    </h3>


    <div class="alertas-container">


    `;







    if(

        alertas.length === 0

    ){



        html +=



        `

        <div class="alerta-item">

        Sistema funcionando normalmente

        </div>

        `;



    }

    else{



        alertas.forEach(

            alerta=>{



                html +=



                `

                <div class="alerta-item">

                ${alerta}

                </div>

                `;



            }

        );



    }







    html +=



    `

    </div>

    </div>

    `;







    area.innerHTML =

    html;



}

// =====================================
// GRÁFICO DO DASHBOARD
// =====================================



function criarGrafico(){



    const canvas =

    document.getElementById(

        "graficoDashboard"

    );








    if(

        !canvas

    ){



        return;



    }








    const dados =

    APP_STATE.dashboard || {};








    new Chart(

        canvas,

        {


        type:

        "bar",



        data:

        {


            labels:

            [

                "Alunos",

                "Professores",

                "Materiais",

                "Escolas"

            ],




            datasets:

            [


                {


                label:

                "Quantidade",




                data:

                [


                    dados.alunos || 0,


                    dados.professores || 0,


                    dados.materiais || 0,


                    dados.escolas || 0


                ]



                }


            ]



        }



        }

    );



}









// =====================================
// ATUALIZAÇÃO AUTOMÁTICA
// =====================================



function iniciarAtualizacao(){



    setInterval(

        ()=>{


            atualizarDataHora();



        },

        1000

    );








    setInterval(

        ()=>{


            carregarDashboard();



        },

        60000

    );



}









// =====================================
// INICIAR DASHBOARD
// =====================================



async function iniciarDashboard(){



    await carregarDashboard();



    criarGrafico();



    iniciarAtualizacao();



}









// =====================================
// EVENTOS
// =====================================



document.addEventListener(

    "DOMContentLoaded",

    ()=>{



        iniciarDashboard();



    }

);









// =====================================
// EXPORTAÇÕES
// =====================================



export {



    iniciarDashboard,


    carregarDashboard,


    atualizarCards,


    atualizarEstadoFirebase,


    gerarRanking,


    gerarAlertas,


    criarGrafico


};
