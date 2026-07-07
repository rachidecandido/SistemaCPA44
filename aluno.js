// =====================================
// ALUNO.JS - SISTEMA CPA4
// Gestão de alunos e portal do aluno
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
// CARREGAR ALUNOS
// =====================================



async function carregarAlunos(){



    const alunos =

    await buscarDados(

        "alunos"

    );







    APP_STATE.alunos =

    alunos;







    salvarEstado();







    mostrarAlunos();



    return alunos;



}









// =====================================
// MOSTRAR ALUNOS
// =====================================



function mostrarAlunos(){



    const area =

    document.getElementById(

        "alunoContent"

    );








    if(!area){



        return;



    }








    if(

        APP_STATE.alunos.length === 0

    ){



        area.innerHTML =



        `

        <div class="card">


        <h3>

        Nenhum aluno cadastrado

        </h3>


        </div>

        `;



        return;



    }








    let html =



    `

    <div class="cards">

    `;








    APP_STATE.alunos.forEach(

        aluno=>{



            html +=



            `

            <div class="card">


            <h3>

            ${aluno.nome}

            </h3>



            <p>

            Classe:

            ${aluno.classe || "-"}

            </p>



            <p>

            Número:

            ${aluno.numero || "-"}

            </p>



            <p>

            Média:

            ${aluno.media || 0}

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
// ADICIONAR ALUNO
// =====================================



async function adicionarAluno(

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

        usuario.perfil !== "admin"

        &&

        usuario.perfil !== "secretario"

    ){



        mensagem(

            "Sem permissão para cadastrar aluno",

            "erro"

        );



        return false;



    }








    const aluno = {



        id:

        gerarID(),



        nome:

        dados.nome,



        numero:

        dados.numero || "",



        classe:

        dados.classe || "",



        turma:

        dados.turma || "",



        encarregado:

        dados.encarregado || "",



        telefone:

        dados.telefone || "",



        media:

        0,



        data:

        new Date()

        .toISOString()



    };








    await adicionarDados(

        "alunos",

        aluno

    );







    APP_STATE.alunos.push(

        aluno

    );







    salvarEstado();







    mensagem(

        "Aluno cadastrado",

        "sucesso"

    );







    mostrarAlunos();



    return true;



}









// =====================================
// EDITAR ALUNO
// =====================================



async function editarAluno(

    id,

    dados

){



    const aluno =

    APP_STATE.alunos.find(

        item=>

        item.id === id

    );








    if(!aluno){



        return false;



    }








    Object.assign(

        aluno,

        dados

    );








    await guardarDados(

        "alunos",

        id,

        aluno

    );








    salvarEstado();



    mostrarAlunos();



    return true;



}









// =====================================
// REMOVER ALUNO
// =====================================



async function removerAluno(

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

        "alunos",

        id

    );








    APP_STATE.alunos =

    APP_STATE.alunos.filter(

        aluno=>

        aluno.id !== id

    );








    salvarEstado();







    mostrarAlunos();



    return true;



}









// =====================================
// PORTAL DO ALUNO
// =====================================



function abrirPortalAluno(){



    const usuario =

    usuarioAtual();








    if(!usuario){



        return;



    }








    const area =

    document.getElementById(

        "alunoContent"

    );








    if(!area){



        return;



    }








    const aluno =

    APP_STATE.alunos.find(

        item=>

        item.id === usuario.idAluno

    );








    if(!aluno){



        area.innerHTML =



        `

        <div class="card">


        <h3>

        Dados não encontrados

        </h3>


        </div>

        `;



        return;



    }








    area.innerHTML =



    `

    <div class="card">


    <h3>

    ${aluno.nome}

    </h3>



    <p>

    Classe:

    ${aluno.classe}

    </p>



    <p>

    Média:

    ${aluno.media}

    </p>



    </div>

    `;



}









// =====================================
// PESQUISAR ALUNO
// =====================================



function pesquisarAluno(

    texto

){



    texto =

    texto.toLowerCase();








    return APP_STATE.alunos.filter(

        aluno=>



        aluno.nome

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



function iniciarAluno(){



    carregarAlunos();



}








document.addEventListener(

    "DOMContentLoaded",

    ()=>{


        iniciarAluno();



    }

);









// =====================================
// EXPORTAÇÕES
// =====================================



export {



    iniciarAluno,


    carregarAlunos,


    mostrarAlunos,


    adicionarAluno,


    editarAluno,


    removerAluno,


    abrirPortalAluno,


    pesquisarAluno


};
