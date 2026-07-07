// =====================================
// ESCOLA.JS - SISTEMA CPA4
// Gestão de escolas, turmas e informações
// =====================================



import {


    APP_STATE,


    salvarEstado


} from "./state.js";




import {


    buscarDados,


    adicionarDados,


    guardarDados,


    removerDados


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
// CARREGAR ESCOLAS
// =====================================



async function carregarEscolas(){



    const escolas =

    await buscarDados(

        "escolas"

    );







    APP_STATE.escolas =

    escolas;







    const turmas =

    await buscarDados(

        "turmas"

    );







    APP_STATE.turmas =

    turmas;







    salvarEstado();







    mostrarEscolas();



    return escolas;



}









// =====================================
// MOSTRAR ESCOLAS
// =====================================



function mostrarEscolas(){



    const area =

    document.getElementById(

        "escolaContent"

    );








    if(!area){



        return;



    }








    if(

        APP_STATE.escolas.length === 0

    ){



        area.innerHTML =



        `

        <div class="card">


        <h3>

        Nenhuma escola cadastrada

        </h3>


        </div>

        `;



        return;



    }








    let html =



    `

    <div class="cards">

    `;








    APP_STATE.escolas.forEach(

        escola=>{



            html +=



            `

            <div class="card">


            <h3>

            ${escola.nome}

            </h3>



            <p>

            Local:

            ${escola.local || "-"}

            </p>



            <p>

            Diretor:

            ${escola.diretor || "-"}

            </p>



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
// ADICIONAR ESCOLA
// =====================================



async function adicionarEscola(

    dados

){



    const usuario =

    usuarioAtual();








    if(!usuario){



        return false;



    }








    if(

        !temPermissao(

            "escola"

        )

        &&

        usuario.perfil !== "admin"

    ){



        mensagem(

            "Sem permissão",

            "erro"

        );



        return false;



    }








    const escola = {



        id:

        gerarID(),



        nome:

        dados.nome,



        local:

        dados.local || "",



        diretor:

        dados.diretor || "",



        telefone:

        dados.telefone || "",



        data:

        new Date()

        .toISOString()



    };








    await adicionarDados(

        "escolas",

        escola

    );








    APP_STATE.escolas.push(

        escola

    );







    salvarEstado();







    mensagem(

        "Escola adicionada",

        "sucesso"

    );







    mostrarEscolas();



    return true;



}









// =====================================
// ADICIONAR TURMA
// =====================================



async function adicionarTurma(

    dados

){



    const turma = {



        id:

        gerarID(),



        nome:

        dados.nome,



        classe:

        dados.classe,



        escola:

        dados.escola,



        ano:

        dados.ano || 

        new Date()

        .getFullYear()



    };








    await adicionarDados(

        "turmas",

        turma

    );







    APP_STATE.turmas.push(

        turma

    );







    salvarEstado();



    return true;



}









// =====================================
// REMOVER ESCOLA
// =====================================



async function removerEscola(

    id

){



    const usuario =

    usuarioAtual();








    if(

        !usuario

        ||

        usuario.perfil !== "admin"

    ){



        mensagem(

            "Apenas administrador pode remover",

            "erro"

        );



        return false;



    }








    await removerDados(

        "escolas",

        id

    );








    APP_STATE.escolas =

    APP_STATE.escolas.filter(

        escola=>

        escola.id !== id

    );







    salvarEstado();







    mostrarEscolas();



    return true;



}









// =====================================
// PESQUISAR ESCOLA
// =====================================



function pesquisarEscola(

    texto

){



    texto =

    texto.toLowerCase();








    return APP_STATE.escolas.filter(

        escola=>



        escola.nome

        .

        toLowerCase()

        .

        includes(

            texto

        )



    );



}









// =====================================
// INICIALIZAÇÃO
// =====================================



function iniciarEscola(){



    carregarEscolas();



}








document.addEventListener(

    "DOMContentLoaded",

    ()=>{


        iniciarEscola();



    }

);









// =====================================
// EXPORTAÇÕES
// =====================================



export {



    iniciarEscola,


    carregarEscolas,


    mostrarEscolas,


    adicionarEscola,


    adicionarTurma,


    removerEscola,


    pesquisarEscola


};
