// =====================================
// MATERIAIS.JS - SISTEMA CPA4
// Gestão de materiais de apoio
// Firebase Storage + Firestore
// =====================================


import {


    APP_STATE,


    salvarEstado


} from "./state.js";




import {


    usuarioAtual,


    temPermissao


} from "./auth.js";





import {


    adicionarDados,


    buscarDados,


    removerDados,


    enviarFicheiro,


    apagarFicheiro


} from "./firebase.js";





import {


    gerarID,


    mensagem


} from "./utils.js";









// =====================================
// CARREGAR MATERIAIS
// =====================================



async function carregarMateriais(){



    const materiais =

    await buscarDados(

        "materiais"

    );




    APP_STATE.materiais =

    materiais;



    salvarEstado();



    mostrarMateriais();



    return materiais;


}









// =====================================
// ADICIONAR MATERIAL
// =====================================



async function adicionarMaterial(

    arquivo,

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

            "materiais"

        )

    ){



        mensagem(

            "Sem permissão para adicionar materiais",

            "erro"

        );



        return false;



    }









    const upload =

    await enviarFicheiro(

        arquivo,

        "materiais"

    );







    if(!upload){



        mensagem(

            "Erro ao enviar ficheiro",

            "erro"

        );



        return false;



    }









    const material = {



        id:

        gerarID(),



        titulo:

        dados.titulo,



        disciplina:

        dados.disciplina,



        classe:

        dados.classe,



        tipo:

        arquivo.type,



        nomeArquivo:

        upload.nome,



        url:

        upload.url,



        caminho:

        upload.caminho,



        criadoPor:

        usuario.nome,



        idAutor:

        usuario.id,



        data:

        new Date()

        .toISOString()



    };








    await adicionarDados(

        "materiais",

        material

    );








    APP_STATE.materiais.push(

        material

    );






    salvarEstado();







    mensagem(

        "Material adicionado com sucesso",

        "sucesso"

    );







    mostrarMateriais();






    return true;



}
// =====================================
// MOSTRAR MATERIAIS
// =====================================



function mostrarMateriais(){



    const area =

    document.getElementById(

        "materiaisContent"

    );






    if(!area){



        return;



    }







    if(

        APP_STATE.materiais.length === 0

    ){



        area.innerHTML =



        `

        <div class="card">

            <h3>

            Nenhum material disponível

            </h3>


            <p>

            Ainda não existem materiais cadastrados.

            </p>


        </div>

        `;



        return;



    }









    let html =

    `

    <div class="cards">

    `;








    APP_STATE.materiais.forEach(

        material=>{





            html +=



            `

            <div class="card material-card">


                <div>


                    <h3>

                    ${material.titulo}

                    </h3>



                    <p>

                    Disciplina:

                    ${material.disciplina || "-"}

                    </p>



                    <p>

                    Classe:

                    ${material.classe || "-"}

                    </p>



                    <small>

                    Enviado por:

                    ${material.criadoPor}

                    </small>


                </div>





                <div>


                    <a

                    href="${material.url}"

                    target="_blank">

                    Abrir

                    </a>



                    <br>





                    <button

                    class="btn btn-danger"

                    onclick="removerMaterialCPA4('${material.id}')">


                    Remover

                    </button>



                </div>


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
// PESQUISAR MATERIAL
// =====================================



function pesquisarMaterial(

    texto

){



    texto =

    texto.toLowerCase();







    return APP_STATE.materiais.filter(

        material=>{



            return (

                material.titulo

                .toLowerCase()

                .includes(texto)



                ||

                material.disciplina

                ?.toLowerCase()

                .includes(texto)

            );



        }

    );



}









// =====================================
// REMOVER MATERIAL
// =====================================



async function removerMaterial(

    id

){



    const usuario =

    usuarioAtual();








    if(!usuario){



        return false;



    }








    const material =

    APP_STATE.materiais.find(

        item=>

        item.id === id

    );









    if(!material){



        return false;



    }








    // Administrador remove tudo

    // Professor remove apenas os seus materiais



    const podeRemover =



    usuario.perfil === "admin"

    ||

    (

        usuario.perfil === "professor"

        &&

        material.idAutor === usuario.id

    );








    if(!podeRemover){



        mensagem(

            "Você não pode remover este material",

            "erro"

        );



        return false;



    }









    await removerDados(

        "materiais",

        id

    );








    if(material.caminho){



        await apagarFicheiro(

            material.caminho

        );



    }








    APP_STATE.materiais =

    APP_STATE.materiais.filter(

        item=>

        item.id !== id

    );








    salvarEstado();








    mensagem(

        "Material removido",

        "sucesso"

    );








    mostrarMateriais();







    return true;



}








// Função global para botão HTML


window.removerMaterialCPA4 =

removerMaterial;

// =====================================
// FORMULÁRIO DE UPLOAD
// =====================================



function criarFormularioMaterial(){



    const area =

    document.getElementById(

        "materiaisContent"

    );






    if(!area){



        return;



    }









    const formulario =



    `



    <div class="formulario">


        <h3>

        Adicionar Material

        </h3>



        <input

        id="materialTitulo"

        placeholder="Título do material"

        >




        <input

        id="materialDisciplina"

        placeholder="Disciplina"

        >




        <input

        id="materialClasse"

        placeholder="Classe"

        >




        <input

        id="materialArquivo"

        type="file"

        >




        <button

        class="btn btn-primary"

        id="btnEnviarMaterial">


        Enviar Material


        </button>



    </div>



    `;







    area.insertAdjacentHTML(

        "afterbegin",

        formulario

    );








    const botao =

    document.getElementById(

        "btnEnviarMaterial"

    );








    if(botao){



        botao.addEventListener(

            "click",

            async ()=>{



                const arquivo =

                document.getElementById(

                    "materialArquivo"

                )

                .files[0];








                if(!arquivo){



                    mensagem(

                        "Selecione um ficheiro",

                        "erro"

                    );



                    return;



                }







                await adicionarMaterial(



                    arquivo,



                    {



                    titulo:

                    document.getElementById(

                        "materialTitulo"

                    ).value,




                    disciplina:

                    document.getElementById(

                        "materialDisciplina"

                    ).value,





                    classe:

                    document.getElementById(

                        "materialClasse"

                    ).value



                    }



                );



            }

        );



    }



}









// =====================================
// FILTRAR POR DISCIPLINA
// =====================================



function filtrarPorDisciplina(

    disciplina

){



    return APP_STATE.materiais.filter(

        material =>



        material.disciplina === disciplina



    );



}









// =====================================
// FILTRAR POR CLASSE
// =====================================



function filtrarPorClasse(

    classe

){



    return APP_STATE.materiais.filter(

        material =>



        material.classe === classe



    );



}









// =====================================
// INICIALIZAÇÃO
// =====================================



async function iniciarMateriais(){



    criarFormularioMaterial();



    await carregarMateriais();



}









// Inicializar quando página carregar


document.addEventListener(

    "DOMContentLoaded",

    ()=>{



        iniciarMateriais();



    }

);









// =====================================
// EXPORTAÇÕES
// =====================================



export {



    iniciarMateriais,


    carregarMateriais,


    adicionarMaterial,


    removerMaterial,


    pesquisarMaterial,


    filtrarPorDisciplina,


    filtrarPorClasse


};
