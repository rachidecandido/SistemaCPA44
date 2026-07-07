// =====================================
// AUTH.JS - SISTEMA CPA4
// Autenticação por PIN
// Controle de permissões
// =====================================



import {


    APP_STATE,


    salvarEstado


} from "./state.js";





import {


    gerarID,


    mensagem


} from "./utils.js";









// Configurações de segurança


const CONFIG_AUTH = {



    maxTentativas:

    3,



    tempoBloqueio:

    20000



};









// Utilizador administrador inicial


function criarAdminInicial(){



    if(

        !APP_STATE.usuarios

    ){



        APP_STATE.usuarios=[];



    }







    const existe =

    APP_STATE.usuarios.find(

        usuario =>

        usuario.perfil === "admin"

    );








    if(!existe){



        APP_STATE.usuarios.push({



            id:

            gerarID(),



            nome:

            "Administrador",



            username:

            "admin",



            pin:

            "1234",



            perfil:

            "admin",



            ativo:

            true,



            tentativas:

            0,



            bloqueadoAte:

            null,



            ultimoAcesso:

            null



        });






        salvarEstado();



    }



}









// Obter utilizadores


function obterUsuarios(){



    return APP_STATE.usuarios || [];



}









// Guardar utilizadores


function salvarUsuarios(

    usuarios

){



    APP_STATE.usuarios =

    usuarios;



    salvarEstado();



}









// Adicionar utilizador


function adicionarUsuario(

    dados

){



    const usuario = {



        id:

        gerarID(),



        nome:

        dados.nome,



        username:

        dados.username,



        pin:

        dados.pin,



        perfil:

        dados.perfil || "aluno",



        ativo:

        true,



        tentativas:

        0,



        bloqueadoAte:

        null,



        ultimoAcesso:

        null



    };







    APP_STATE.usuarios.push(

        usuario

    );






    salvarEstado();






    return usuario;



}









// Verificar administrador


function ehAdministrador(){



    return (



        APP_STATE.usuario &&



        APP_STATE.usuario.perfil === "admin"



    );



}









// Procurar utilizador


function procurarUsuario(

    username

){



    return APP_STATE.usuarios.find(

        usuario =>



        usuario.username === username



    );



}

// =====================================
// LOGIN E CONTROLE DE PIN
// =====================================



function verificarBloqueio(usuario){



    if(

        !usuario.bloqueadoAte

    ){



        return false;



    }








    const agora =

    Date.now();







    if(

        agora < usuario.bloqueadoAte

    ){



        return true;



    }








    // remover bloqueio depois do tempo


    usuario.bloqueadoAte =

    null;



    usuario.tentativas =

    0;







    salvarEstado();






    return false;



}









// Tempo restante do bloqueio


function tempoBloqueioRestante(

    usuario

){



    if(

        !usuario.bloqueadoAte

    ){



        return 0;



    }








    const restante =



    usuario.bloqueadoAte

    -

    Date.now();








    return Math.ceil(

        restante / 1000

    );



}









// Fazer login


function login(

    username,

    pin

){



    const usuario =

    procurarUsuario(

        username

    );








    if(!usuario){



        mensagem(

            "Utilizador não encontrado",

            "erro"

        );



        return false;



    }








    if(

        !usuario.ativo

    ){



        mensagem(

            "Conta bloqueada pelo administrador",

            "erro"

        );



        return false;



    }








    if(

        verificarBloqueio(

            usuario

        )

    ){



        mensagem(

            "Aguarde "

            +

            tempoBloqueioRestante(

                usuario

            )

            +

            " segundos",

            "erro"

        );



        return false;



    }








    if(

        usuario.pin !== pin

    ){



        usuario.tentativas++;








        if(

            usuario.tentativas >=

            CONFIG_AUTH.maxTentativas

        ){



            usuario.bloqueadoAte =

            Date.now()

            +

            CONFIG_AUTH.tempoBloqueio;







            usuario.tentativas =

            0;







            mensagem(

                "Muitas tentativas. Aguarde 20 segundos",

                "erro"

            );



        }

        else{



            mensagem(

                "PIN incorreto. Tentativa "

                +

                usuario.tentativas

                +

                "/3",

                "erro"

            );



        }







        salvarEstado();



        return false;



    }









    // Login correto


    usuario.tentativas =

    0;



    usuario.bloqueadoAte =

    null;



    usuario.ultimoAcesso =

    new Date()

    .toISOString();








    APP_STATE.usuario =

    usuario;








    salvarEstado();







    mensagem(

        "Bem-vindo "

        +

        usuario.nome,

        "sucesso"

    );








    return true;



}









// Terminar sessão


function logout(){



    APP_STATE.usuario =

    null;



    salvarEstado();







    mensagem(

        "Sessão terminada",

        "info"

    );



}









// Ver utilizador atual


function usuarioAtual(){



    return APP_STATE.usuario || null;



}

// =====================================
// FUNÇÕES ADMINISTRATIVAS
// =====================================





// Alterar PIN de utilizador


function alterarPIN(

    idUsuario,

    novoPIN

){



    if(

        !ehAdministrador()

    ){



        mensagem(

            "Sem permissão",

            "erro"

        );



        return false;



    }








    const usuario =

    APP_STATE.usuarios.find(

        u =>

        u.id === idUsuario

    );








    if(!usuario){



        return false;



    }








    usuario.pin =

    novoPIN;



    usuario.tentativas =

    0;



    usuario.bloqueadoAte =

    null;







    salvarEstado();








    mensagem(

        "PIN alterado com sucesso",

        "sucesso"

    );








    return true;



}









// Remover utilizador


function removerUsuario(

    idUsuario

){



    if(

        !ehAdministrador()

    ){



        mensagem(

            "Sem permissão",

            "erro"

        );



        return false;



    }








    APP_STATE.usuarios =

    APP_STATE.usuarios.filter(

        usuario =>

        usuario.id !== idUsuario

    );








    salvarEstado();







    mensagem(

        "Utilizador removido",

        "sucesso"

    );







    return true;



}









// Ativar ou desativar conta


function alterarEstadoUsuario(

    idUsuario

){



    if(

        !ehAdministrador()

    ){



        return false;



    }








    const usuario =

    APP_STATE.usuarios.find(

        u=>

        u.id===idUsuario

    );








    if(usuario){



        usuario.ativo =

        !usuario.ativo;





        salvarEstado();





        return usuario.ativo;



    }







    return false;



}









// Verificar permissão


function temPermissao(

    permissao

){



    const usuario =

    usuarioAtual();







    if(!usuario){



        return false;



    }








    const permissoes = {



        admin:[

            "tudo"

        ],



        diretor:[

            "dashboard",

            "escola",

            "boletim",

            "cpa"

        ],



        professor:[

            "materiais",

            "cpa",

            "boletim"

        ],



        secretario:[

            "alunos",

            "boletim"

        ],



        aluno:[

            "portal"

        ]



    };









    if(

        permissoes[usuario.perfil]

        .

        includes(

            "tudo"

        )

    ){



        return true;



    }








    return permissoes[usuario.perfil]

    ?

    permissoes[usuario.perfil]

    .

    includes(

        permissao

    )

    :

    false;



}









// Iniciar sistema de autenticação


function iniciarAuth(){



    criarAdminInicial();



}









export {



    iniciarAuth,


    login,


    logout,


    usuarioAtual,


    adicionarUsuario,


    obterUsuarios,


    alterarPIN,


    removerUsuario,


    alterarEstadoUsuario,


    temPermissao,


    ehAdministrador,


    verificarBloqueio,


    tempoBloqueioRestante


};
