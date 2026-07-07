// =====================================
// NAV.JS - SISTEMA CPA4
// Navegação e controle de menus
// =====================================



import {


    usuarioAtual,


    temPermissao


} from "./auth.js";









// =====================================
// ELEMENTOS
// =====================================



const menuBtn =

document.getElementById(

    "menuBtn"

);





const sidebar =

document.getElementById(

    "sidebar"

);









// =====================================
// MENU MOBILE
// =====================================



function abrirMenu(){



    if(sidebar){



        sidebar.classList.toggle(

            "open"

        );



    }



}









// =====================================
// MOSTRAR PÁGINAS
// =====================================



function abrirPagina(

    idPagina

){



    const paginas =

    document.querySelectorAll(

        ".page"

    );







    paginas.forEach(

        pagina=>{



            pagina.classList.remove(

                "active"

            );



        }

    );








    const paginaSelecionada =

    document.getElementById(

        idPagina

    );







    if(

        paginaSelecionada

    ){



        paginaSelecionada.classList.add(

            "active"

        );



    }







    fecharMenu();



}









// =====================================
// FECHAR MENU
// =====================================



function fecharMenu(){



    if(sidebar){



        sidebar.classList.remove(

            "open"

        );



    }



}


// =====================================
// EVENTOS DE NAVEGAÇÃO
// =====================================



function iniciarNavegacao(){



    if(menuBtn){



        menuBtn.addEventListener(

            "click",

            ()=>{


                abrirMenu();



            }

        );



    }








    const botoes =

    document.querySelectorAll(

        "[data-page]"

    );








    botoes.forEach(

        botao=>{



            botao.addEventListener(

                "click",

                ()=>{



                    const pagina =

                    botao.dataset.page;







                    abrirPagina(

                        pagina

                    );



                }

            );



        }

    );





}









// =====================================
// CONTROLE DE ACESSO
// =====================================



function verificarAcessosMenu(){



    const usuario =

    usuarioAtual();







    const botoes =

    document.querySelectorAll(

        "[data-page]"

    );







    botoes.forEach(

        botao=>{



            const pagina =

            botao.dataset.page;








            let permitido = false;








            // Sem login

            if(!usuario){



                permitido =

                pagina === "dashboard";



            }







            // Administrador

            else if(

                usuario.perfil ===

                "admin"

            ){



                permitido = true;



            }







            // Professor

            else if(

                usuario.perfil ===

                "professor"

            ){



                permitido =



                [

                    "dashboard",

                    "cpa",

                    "boletim",

                    "materiais"

                ]

                .

                includes(

                    pagina

                );



            }







            // Aluno

            else if(

                usuario.perfil ===

                "aluno"

            ){



                permitido =



                [

                    "dashboard",

                    "aluno"

                ]

                .

                includes(

                    pagina

                );



            }







            // Outros perfis

            else{



                permitido = true;



            }









            if(

                permitido

            ){



                botao.style.display =

                "block";



            }

            else{



                botao.style.display =

                "none";



            }



        }

    );



}









// =====================================
// ALTERAR PÁGINA PELO LINK
// =====================================



function carregarPaginaInicial(){



    abrirPagina(

        "dashboard"

    );



}

// =====================================
// ATUALIZAR MENU
// =====================================



function atualizarMenu(){



    verificarAcessosMenu();



}









// =====================================
// INICIALIZAÇÃO
// =====================================



function iniciarNav(){



    iniciarNavegacao();



    carregarPaginaInicial();



    atualizarMenu();



}









// Atualizar menu quando a página carregar


document.addEventListener(

    "DOMContentLoaded",

    ()=>{



        iniciarNav();



    }

);









// =====================================
// EXPORTAÇÕES
// =====================================



export {



    iniciarNav,


    abrirPagina,


    fecharMenu,


    atualizarMenu,


    verificarAcessosMenu


};
