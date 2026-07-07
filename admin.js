// =====================================
// ADMIN.JS - SISTEMA CPA4
// Painel administrativo
// =====================================


import {


    APP_STATE,


    salvarEstado


} from "./state.js";





import {


    usuarioAtual,


    ehAdministrador,


    obterUsuarios,


    adicionarUsuario,


    alterarPIN,


    removerUsuario,


    alterarEstadoUsuario


} from "./auth.js";






import {


    gerarID,


    mensagem


} from "./utils.js";









// =====================================
// VERIFICAR ACESSO ADMIN
// =====================================



function verificarAdmin(){



    if(

        !ehAdministrador()

    ){



        mensagem(

            "Acesso permitido apenas ao administrador",

            "erro"

        );



        return false;



    }






    return true;



}









// =====================================
// LISTAR UTILIZADORES
// =====================================



function listarUsuarios(){



    if(

        !verificarAdmin()

    ){



        return [];



    }








    return obterUsuarios();



}









// =====================================
// MOSTRAR UTILIZADORES
// =====================================



function mostrarUsuarios(){



    const area =

    document.getElementById(

        "adminContent"

    );







    if(!area){



        return;



    }








    const usuarios =

    listarUsuarios();








    let html =



    `

    <div class="table-container">


    <table>


    <thead>

    <tr>


        <th>

        Nome

        </th>



        <th>

        Utilizador

        </th>



        <th>

        Perfil

        </th>



        <th>

        Estado

        </th>



        <th>

        Ações

        </th>


    </tr>

    </thead>


    <tbody>


    `;







    usuarios.forEach(

        usuario=>{



            html +=



            `

            <tr>


            <td>

            ${usuario.nome}

            </td>



            <td>

            ${usuario.username}

            </td>




            <td>

            ${usuario.perfil}

            </td>





            <td>

            ${usuario.ativo

            ?

            "Ativo"

            :

            "Bloqueado"

            }

            </td>




            <td>


            <button

            class="btn btn-primary"

            onclick="alterarPINCPA4('${usuario.id}')">


            PIN


            </button>





            <button

            class="btn btn-danger"

            onclick="removerUsuarioCPA4('${usuario.id}')">


            Remover


            </button>



            </td>


            </tr>


            `;



        }

    );








    html +=



    `

    </tbody>


    </table>


    </div>


    `;








    area.innerHTML =

    html;



}









// =====================================
// CRIAR UTILIZADOR
// =====================================



function criarNovoUsuario(

    dados

){



    if(

        !verificarAdmin()

    ){



        return false;



    }








    if(

        !dados.nome

        ||

        !dados.username

        ||

        !dados.pin

    ){



        mensagem(

            "Preencha todos os campos",

            "erro"

        );



        return false;



    }









    const novo =

    adicionarUsuario(

        dados

    );








    mensagem(

        "Utilizador criado com sucesso",

        "sucesso"

    );







    mostrarUsuarios();






    return novo;



}









// =====================================
// ALTERAR PIN
// =====================================



function alterarPINUsuario(

    id

){



    if(

        !verificarAdmin()

    ){



        return false;



    }








    const novoPIN =

    prompt(

        "Digite o novo PIN"

    );







    if(

        !novoPIN

    ){



        return false;



    }








    return alterarPIN(

        id,

        novoPIN

    );



}









// =====================================
// REMOVER UTILIZADOR
// =====================================



function removerUsuarioAdmin(

    id

){



    if(

        !verificarAdmin()

    ){



        return false;



    }








    const usuario =

    obterUsuarios()

    .

    find(

        u=>

        u.id===id

    );








    if(

        usuario.username ===

        "admin"

    ){



        mensagem(

            "O administrador principal não pode ser removido",

            "erro"

        );



        return false;



    }









    const confirmar =

    confirm(

        "Deseja remover este utilizador?"

    );








    if(

        !confirmar

    ){



        return false;



    }









    removerUsuario(

        id

    );








    mostrarUsuarios();



    return true;



}









// =====================================
// BLOQUEAR / DESBLOQUEAR CONTA
// =====================================



function alternarEstadoConta(

    id

){



    if(

        !verificarAdmin()

    ){



        return false;



    }








    const resultado =

    alterarEstadoUsuario(

        id

    );








    mostrarUsuarios();








    return resultado;



}









// =====================================
// FORMULÁRIO ADMIN
// =====================================



function criarFormularioAdmin(){



    const area =

    document.getElementById(

        "adminContent"

    );








    if(!area){



        return;



    }









    const formulario =



    `

    <div class="card">


    <h3>

    Novo Utilizador

    </h3>



    <input

    id="adminNome"

    placeholder="Nome completo"

    >




    <input

    id="adminUsername"

    placeholder="Nome de utilizador"

    >




    <input

    id="adminPIN"

    placeholder="PIN"

    >





    <select id="adminPerfil">


        <option value="professor">

        Professor

        </option>



        <option value="aluno">

        Aluno

        </option>



        <option value="secretario">

        Secretário

        </option>



        <option value="diretor">

        Diretor

        </option>



        <option value="encarregado">

        Encarregado

        </option>



    </select>




    <button

    id="btnCriarUsuario"

    class="btn btn-primary">


    Criar Utilizador


    </button>


    </div>


    `;







    area.insertAdjacentHTML(

        "afterbegin",

        formulario

    );







    document

    .getElementById(

        "btnCriarUsuario"

    )

    ?.addEventListener(

        "click",

        ()=>{


            criarNovoUsuario({



                nome:

                document.getElementById(

                    "adminNome"

                ).value,



                username:

                document.getElementById(

                    "adminUsername"

                ).value,



                pin:

                document.getElementById(

                    "adminPIN"

                ).value,



                perfil:

                document.getElementById(

                    "adminPerfil"

                ).value



            });



        }

    );



}









// =====================================
// LOG DE ATIVIDADES
// =====================================



function registrarAtividade(

    acao

){



    if(

        !APP_STATE.logs

    ){



        APP_STATE.logs = [];



    }








    const usuario =

    usuarioAtual();








    APP_STATE.logs.push({



        id:

        gerarID(),



        usuario:

        usuario

        ?

        usuario.nome

        :

        "Sistema",



        acao:

        acao,



        data:

        new Date()

        .toISOString()



    });








    salvarEstado();



}









// =====================================
// MOSTRAR ESTATÍSTICAS ADMIN
// =====================================



function mostrarResumoAdmin(){



    const area =

    document.getElementById(

        "adminContent"

    );








    if(!area){



        return;



    }







    const usuarios =

    obterUsuarios();








    const professores =

    usuarios.filter(

        u=>

        u.perfil === "professor"

    );








    const alunos =

    usuarios.filter(

        u=>

        u.perfil === "aluno"

    );








    const ativos =

    usuarios.filter(

        u=>

        u.ativo

    );








    area.insertAdjacentHTML(



        "afterbegin",



        `


        <div class="cards">


            <div class="card">

                <h3>

                Total Utilizadores

                </h3>


                <p>

                ${usuarios.length}

                </p>


            </div>



            <div class="card">

                <h3>

                Professores

                </h3>


                <p>

                ${professores.length}

                </p>


            </div>




            <div class="card">

                <h3>

                Alunos

                </h3>


                <p>

                ${alunos.length}

                </p>


            </div>




            <div class="card">

                <h3>

                Contas Ativas

                </h3>


                <p>

                ${ativos.length}

                </p>


            </div>


        </div>



        `



    );



}









// =====================================
// MOSTRAR LOGS
// =====================================



function mostrarLogs(){



    const logs =

    APP_STATE.logs || [];








    return logs;



}









// =====================================
// INICIALIZAÇÃO
// =====================================



function iniciarAdmin(){



    if(

        !ehAdministrador()

    ){



        return;



    }








    criarFormularioAdmin();



    mostrarResumoAdmin();



    mostrarUsuarios();



}









// =====================================
// FUNÇÕES GLOBAIS DOS BOTÕES
// =====================================



window.alterarPINCPA4 =

alterarPINUsuario;



window.removerUsuarioCPA4 =

removerUsuarioAdmin;



window.alternarEstadoCPA4 =

alternarEstadoConta;









document.addEventListener(

    "DOMContentLoaded",

    ()=>{


        iniciarAdmin();



    }

);









// =====================================
// EXPORTAÇÕES
// =====================================



export {



    iniciarAdmin,


    criarNovoUsuario,


    alterarPINUsuario,


    removerUsuarioAdmin,


    alternarEstadoConta,


    listarUsuarios,


    mostrarLogs,


    registrarAtividade


};
