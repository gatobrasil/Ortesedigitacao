// -----------------------------
// Configuração da ElevenLabs
// -----------------------------
const ELEVEN_API_KEY = "de86bcd53ff04668aee9b2c2744fb3900ffe08318436fe35dd4877fcf6065745"; // Substitua pela sua chave real da ElevenLabs
const VOICE_ID = "e8qJTcD4moOCryGTpvbP"; // ID da voz do paciente

// -----------------------------
// Frases pré-definidas
// -----------------------------
const frasesPorCategoria = {
  higiene: ["Quero me trocar", "Quero escovar os dentes", "Preciso ir ao banheiro"],
  alimentacao: ["Quero comer", "Almoço", "Suco", "Fruta"],
  atividades: ["Quero ver TV", "Vamos passear", "Estou cansado"],
  emocoes: ["Estou com dor", "Estou feliz", "Chame o médico"],
  remedios: ["Tenho remédio para tomar?", "Qual remédio é agora?", "Já tomei o remédio?", "Estou com dor, preciso de remédio."]
};

let categoriaAtual = null;
let bloqueadoCategoria = false;

// -----------------------------
// Funções de exibição
// -----------------------------
function abrirFrases(categoria) {
  categoriaAtual = categoria;
  bloqueadoCategoria = true;
  const frasesDiv = document.getElementById("frases");
  frasesDiv.innerHTML = '';
  frasesPorCategoria[categoria].forEach((frase, index) => {
    const botao = document.createElement("button");
    botao.innerText = `${index + 1}. ${frase}`;
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

// -----------------------------
// Fala com ElevenLabs
// -----------------------------
async function falar(texto) {
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: texto,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.6,
          similarity_boost: 0.85
        }
      })
    });

    if (!response.ok) throw new Error("Erro na geração de áudio");
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
  } catch (error) {
    console.error(error);
    alert("⚠️ Não foi possível gerar a voz agora. Verifique sua conexão ou chave da ElevenLabs.");
  }
}

// -----------------------------
// Falar texto digitado
// -----------------------------
function falarTextoDigitado() {
  const texto = document.getElementById("campoFrase").value.trim();
  if (texto !== "") {
    falar(texto);
  }
}

// -----------------------------
// Sugestões de palavras
// -----------------------------
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

// -----------------------------
// Teclas de atalho
// -----------------------------
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
    if (!bloqueadoCategoria && key >= 1 && key <= 5) {
      abrirFrases(categoriaKeys[key - 1]);
      return;
    }

    if (categoriaAtual && key >= 1 && key <= 9) {
      const botoes = document.querySelectorAll("#frases button");
      if (botoes.length >= key) {
        botoes[key - 1].click();
      }
    }
  }
});
