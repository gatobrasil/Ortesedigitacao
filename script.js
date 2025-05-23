const frasesPorCategoria = {
  higiene: ["Quero me trocar", "Quero escovar os dentes", "Preciso ir ao banheiro"],
  alimentacao: ["Quero comer", "Almoço", "Suco", "Fruta"],
  atividades: ["Quero ver TV", "Vamos passear", "Estou cansado"],
  emocoes: ["Estou com dor", "Estou feliz", "Chame o médico"],
  remedios: ["Tenho remédio para tomar?", "Qual remédio é agora?", "Já tomei o remédio?", "Estou com dor, preciso de remédio."]
};

let categoriaAtual = null;
let bloqueadoCategoria = false;

function abrirFrases(categoria) {
  categoriaAtual = categoria;
  bloqueadoCategoria = true;
  const frasesDiv = document.getElementById("frases");
  frasesDiv.innerHTML = '';
  frasesPorCategoria[categoria].forEach((frase, index) => {
    const botao = document.createElement("button");
    botao.innerText = `${index + 1}. ${frase}`;
    botao.dataset.index = index + 1;
    botao.onclick = () => {
      falar(frase);
      desbloquearCategoria();
    };
    frasesDiv.appendChild(botao);
  });
}

function desbloquearCategoria() {
  categoriaAtual = null;
  bloqueadoCategoria = false;
}

function falar(texto) {
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(texto);
  utter.lang = "pt-BR";
  synth.speak(utter);
}

function falarTextoDigitado() {
  const texto = document.getElementById("campoFrase").value;
  if (texto.trim() !== "") {
    falar(texto);
  }
}

function sugerir() {
  const input = document.getElementById("campoFrase").value.toLowerCase();
  const sugestoesDiv = document.getElementById("sugestoes");
  sugestoesDiv.innerHTML = '';

  const palavras = ["quero", "comer", "beber", "dormir", "ir", "ajuda", "dor", "cansado", "médico", "banheiro", "água", "passear"];
  const sugestoes = palavras.filter(p => p.startsWith(input.split(" ").pop())).slice(0, 5);

  sugestoes.forEach(palavra => {
    const span = document.createElement("span");
    span.innerText = palavra;
    span.onclick = () => {
      const campo = document.getElementById("campoFrase");
      const partes = campo.value.trim().split(" ");
      partes.pop();
      campo.value = [...partes, palavra].join(" ") + " ";
    };
    sugestoesDiv.appendChild(span);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const campo = document.getElementById("campoFrase");
  campo.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      falarTextoDigitado();
    }
  });
});

const categoriaKeys = ['higiene', 'alimentacao', 'atividades', 'emocoes', 'remedios'];

document.addEventListener("keydown", (e) => {
  const isInput = document.activeElement.tagName === "INPUT";
  const key = parseInt(e.key);

  if (!isInput) {
    // Abrir categoria se permitido
    if (!bloqueadoCategoria && key >= 1 && key <= 5) {
      abrirFrases(categoriaKeys[key - 1]);
      return;
    }

    // Selecionar frase da categoria atual
    if (categoriaAtual && key >= 1 && key <= 9) {
      const botoes = document.querySelectorAll("#frases button");
      if (botoes.length >= key) {
        botoes[key - 1].click();
      }
    }
  }
});
