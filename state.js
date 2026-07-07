// =====================================
// STATE.JS - SISTEMA CPA4
// Estado global, cache e armazenamento local
// =====================================



const CHAVE_ESTADO = "CPA4_STATE";





// =====================================
// ESTADO PRINCIPAL DO SISTEMA
// =====================================


let APP_STATE = {


    usuario: null,


    alunos: [],


    professores: [],


    usuarios: [],


    escolas: [],


    turmas: [],


    materiais: [],


    boletins: [],


    cpa: [],


    logs: [],


    dashboard: {


        alunos: 0,


        professores: 0,


        materiais: 0,


        escolas: 0


    },



    configuracoes: {


        sistema: "CPA4",


        versao: "1.0.0",


        offline: true


    }



};









// =====================================
// CARREGAR ESTADO LOCAL
// =====================================



function carregarEstado(){



    const dados =

    localStorage.getItem(

        CHAVE_ESTADO

    );






    if(dados){



        try{



            const estadoSalvo =

            JSON.parse(

                dados

            );







            APP_STATE = {


                ...APP_STATE,


                ...estadoSalvo



            };



        }

        catch(erro){



            console.error(

                "Erro ao carregar estado:",

                erro

            );



        }



    }








    return APP_STATE;



}









// =====================================
// GUARDAR ESTADO LOCAL
// =====================================



function salvarEstado(){



    try{



        localStorage.setItem(

            CHAVE_ESTADO,

            JSON.stringify(

                APP_STATE

            )

        );



    }

    catch(erro){



        console.error(

            "Erro ao salvar estado:",

            erro

        );



    }



}









// =====================================
// LIMPAR ESTADO
// =====================================



function limparEstado(){



    localStorage.removeItem(

        CHAVE_ESTADO

    );







    APP_STATE = {


        usuario:null,


        alunos:[],


        professores:[],


        usuarios:[],


        escolas:[],


        turmas:[],


        materiais:[],


        boletins:[],


        cpa:[],


        logs:[]



    };



}









// =====================================
// ATUALIZAR DADOS
// =====================================



function atualizarEstado(

    campo,

    valor

){



    APP_STATE[campo] =

    valor;







    salvarEstado();



}









// =====================================
// ADICIONAR ITEM
// =====================================



function adicionarAoEstado(

    campo,

    item

){



    if(

        !Array.isArray(

            APP_STATE[campo]

        )

    ){



        APP_STATE[campo] = [];



    }








    APP_STATE[campo].push(

        item

    );







    salvarEstado();



}









// =====================================
// REMOVER ITEM
// =====================================



function removerDoEstado(

    campo,

    id

){



    if(

        Array.isArray(

            APP_STATE[campo]

        )

    ){



        APP_STATE[campo] =

        APP_STATE[campo].filter(

            item =>

            item.id !== id

        );



    }







    salvarEstado();



}









// =====================================
// OBTER DADOS
// =====================================



function obterEstado(){



    return APP_STATE;



}









// =====================================
// INICIALIZAÇÃO
// =====================================



carregarEstado();









// =====================================
// EXPORTAÇÕES
// =====================================



export {



    APP_STATE,


    carregarEstado,


    salvarEstado,


    limparEstado,


    atualizarEstado,


    adicionarAoEstado,


    removerDoEstado,


    obterEstado


};
