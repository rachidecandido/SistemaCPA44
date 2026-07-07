// =====================================
// PDF.JS - SISTEMA CPA4
// Geração de PDFs usando jsPDF
// =====================================

const { jsPDF } = window.jspdf;

function cabecalho(doc,titulo){
  doc.setFontSize(18);
  doc.text("CPA4 - Sistema de Gestão Escolar",20,20);
  doc.setFontSize(14);
  doc.text(titulo,20,30);
  doc.setLineWidth(0.5);
  doc.line(20,34,190,34);
}

function rodape(doc){
  const p=doc.getNumberOfPages();
  const h=doc.internal.pageSize.height;
  doc.setFontSize(9);
  doc.text("Emitido: "+new Date().toLocaleString("pt-PT"),20,h-10);
  doc.text("Página "+p,170,h-10);
}

export function gerarBoletimPDF(boletim){
  const doc=new jsPDF();
  cabecalho(doc,"Boletim Escolar");
  let y=45;
  doc.setFontSize(12);
  doc.text("Aluno: "+(boletim.aluno||""),20,y); y+=8;
  doc.text("Classe: "+(boletim.classe||""),20,y); y+=8;
  doc.text("Média: "+(boletim.media??""),20,y); y+=12;
  doc.text("Disciplinas:",20,y); y+=8;
  (boletim.disciplinas||[]).forEach(d=>{
    doc.text(`${d.nome||d.disciplina}: ${d.nota}`,25,y);
    y+=7;
    if(y>270){rodape(doc);doc.addPage();cabecalho(doc,"Boletim Escolar");y=45;}
  });
  rodape(doc);
  doc.save(`Boletim_${(boletim.aluno||"Aluno").replace(/\s+/g,"_")}.pdf`);
}

export function gerarListaPDF(titulo,lista,colunas){
  const doc=new jsPDF();
  cabecalho(doc,titulo);
  let y=45;
  doc.setFontSize(11);
  lista.forEach((item,i)=>{
    const linha=colunas.map(c=>`${c}: ${item[c]??""}`).join(" | ");
    doc.text((i+1)+". "+linha,20,y);
    y+=7;
    if(y>275){rodape(doc);doc.addPage();cabecalho(doc,titulo);y=45;}
  });
  rodape(doc);
  doc.save(titulo.replace(/\s+/g,"_")+".pdf");
}

export function gerarRelatorioAlunos(alunos=[]){
  gerarListaPDF("Relatório de Alunos",alunos,["nome","numero","classe","turma"]);
}

export function gerarRelatorioEscolas(escolas=[]){
  gerarListaPDF("Relatório de Escolas",escolas,["nome","local","diretor"]);
}

export function gerarRelatorioCPA(avaliacoes=[]){
  gerarListaPDF("Relatório CPA",avaliacoes,["aluno","disciplina","nota","professor"]);
}

window.gerarBoletimPDF=gerarBoletimPDF;
