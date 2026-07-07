// =====================================
// UTILS.JS - SISTEMA CPA4
// Funções auxiliares do sistema
// =====================================







// =====================================
// GERAR ID ÚNICO
// =====================================



function gerarID(){



    return (

        "CPA4_"

        +

        Date.now()

        +

        "_"

        +

        Math.floor(

            Math.random() * 10000

        )



    );



}









// =====================================
// MENSAGENS DO SISTEMA
// =====================================



function mensagem(

    texto,

    tipo = "info"

){



    let area =

    document.getElementById(

        "mensagemSistema"

    );







    if(!area){



        area =

        document.createElement(

            "div"

        );



        area.id =

        "mensagemSistema";







        document.body.appendChild(

            area

        );



    }








    area.className =

    "mensagem "

    +

    tipo;








    area.innerText =

    texto;







    area.style.display =

    "block";








    setTimeout(

        ()=>{



            area.style.display =

            "none";



        },

        3000

    );



}









// =====================================
// VALIDAR CAMPOS
// =====================================



function validarCampos(

    objeto

){



    for(

        const campo in objeto

    ){



        if(

            objeto[campo] ===

            ""

            ||

            objeto[campo] ===

            null

            ||

            objeto[campo] ===

            undefined

        ){



            return false;



        }



    }







    return true;



}









// =====================================
// FORMATAR DATA
// =====================================



function formatarData(

    data

){



    if(!data){



        return "-";



    }








    return new Date(

        data

    )

    .toLocaleDateString(

        "pt-PT"

    );



}









// =====================================
// FORMATAR DATA E HORA
// =====================================



function formatarDataHora(

    data

){



    if(!data){



        return "-";



    }








    return new Date(

        data

    )

    .toLocaleString(

        "pt-PT"

    );



}









// =====================================
// LIMPAR FORMULÁRIO
// =====================================



function limparFormulario(

    id

){



    const formulario =

    document.getElementById(

        id

    );








    if(formulario){



        formulario.reset();



    }



}









// =====================================
// CONFIRMAÇÃO
// =====================================



function confirmar(

    texto

){



    return window.confirm(

        texto

    );



}









// =====================================
// ESCAPAR TEXTO HTML
// =====================================



function escaparHTML(

    texto

){



    if(!texto){



        return "";



    }








    return texto

    .replace(

        /&/g,

        "&amp;"

    )

    .replace(

        /</g,

        "&lt;"

    )

    .replace(

        />/g,

        "&gt;"

    )

    .replace(

        /"/g,

        "&quot;"

    );



}









// =====================================
// EXPORTAÇÕES
// =====================================



export {



    gerarID,


    mensagem,


    validarCampos,


    formatarData,


    formatarDataHora,


    limparFormulario,


    confirmar,


    escaparHTML



};
