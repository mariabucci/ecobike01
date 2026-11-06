
// EcoBike SP — funções e interações da página

const precos = {
  urbana: 12,
  eletrica: 20,
  cargo: 25
};

// Selecionando os elementos do HTML
const inputHoras = document.querySelector('#horas');
const selectTipo = document.querySelector('#tipo');
const btnCalcular = document.querySelector('#calcular');
const resultado = document.querySelector('#resultado');

const inputNome = document.querySelector('#nome');
const btnAdicionar = document.querySelector('#adicionar');
const lista = document.querySelector('#lista');
const total = document.querySelector('#total');

const btnTema = document.querySelector('#btnTema');

// Calcula o valor do aluguel
function calcularValor(horas, tipo) {
  let valor = horas * precos[tipo];

  if (horas > 5) {
    valor *= 0.9;
  }

  return valor;
}

// Formata o valor em reais
function formatarMoeda(valor) {
  return valor.toFixed(2).replace('.', ',').replace(/^/, 'R$ ');
}

// Mostra o resultado do simulador
function mostrarResultado() {
  const horas = Number(inputHoras.value);
  const tipo = selectTipo.value;

  if (!inputHoras.value || Number.isNaN(horas) || horas <= 0) {
    resultado.textContent = 'Informe horas válidas';
    return;
  }

  const valor = calcularValor(horas, tipo);
  resultado.textContent = formatarMoeda(valor);
}

// Atualiza o contador de reservas
function atualizarContador() {
  total.textContent = lista.querySelectorAll('li[data-reserva]').length;
}

// Salva as reservas no navegador
function salvarReservas() {
  const nomes = [...lista.querySelectorAll('li[data-reserva]')]
    .map(item => item.querySelector('span').textContent);

  localStorage.setItem('ecobike-reservas', JSON.stringify(nomes));
}

// Cria um item de reserva
function criarItemReserva(nome) {
  const item = document.createElement('li');
  item.dataset.reserva = 'true';

  const texto = document.createElement('span');
  texto.textContent = nome;

  const botaoRemover = document.createElement('button');
  botaoRemover.textContent = 'Remover';
  botaoRemover.classList.add('remove-button');
  botaoRemover.type = 'button';

  botaoRemover.addEventListener('click', function () {
    item.remove();
    mostrarListaVazia();
    atualizarContador();
    salvarReservas();
  });

  item.appendChild(texto);
  item.appendChild(botaoRemover);
  lista.appendChild(item);
}

// Adiciona uma reserva
function adicionarReserva() {
  const nome = inputNome.value.trim();

  if (nome === '') {
    inputNome.focus();
    return;
  }

  const mensagemVazia = lista.querySelector('.empty-state');

  if (mensagemVazia) {
    mensagemVazia.remove();
  }

  criarItemReserva(nome);
  inputNome.value = '';
  inputNome.focus();

  atualizarContador();
  salvarReservas();
}

// Mostra mensagem quando a lista está vazia
function mostrarListaVazia() {
  if (lista.querySelectorAll('li[data-reserva]').length === 0) {
    const vazio = document.createElement('li');
    vazio.classList.add('empty-state');
    vazio.textContent = 'Nenhuma pré-reserva por enquanto.';
    lista.appendChild(vazio);
  }
}

// Alterna entre tema claro e escuro
function alternarTema() {
  document.body.classList.toggle('light-mode');

  const modoClaro = document.body.classList.contains('light-mode');

  btnTema.innerHTML = modoClaro
    ? '☀ <span>Modo claro</span>'
    : '☾ <span>Modo noturno</span>';
}

// Recupera as reservas salvas
function carregarReservas() {
  const nomesSalvos = JSON.parse(
    localStorage.getItem('ecobike-reservas') || '[]'
  );

  nomesSalvos.forEach(nome => criarItemReserva(nome));

  mostrarListaVazia();
  atualizarContador();
}

// Eventos dos botões
btnCalcular.addEventListener('click', mostrarResultado);
btnAdicionar.addEventListener('click', adicionarReserva);
btnTema.addEventListener('click', alternarTema);

// Adiciona reserva ao apertar Enter
inputNome.addEventListener('keydown', function (evento) {
  if (evento.key === 'Enter') {
    adicionarReserva();
  }
});

// Seleciona o plano diretamente pelo card
document.querySelectorAll('.choose-plan').forEach(botao => {
  botao.addEventListener('click', function () {
    selectTipo.value = botao.dataset.plan;

    document.querySelector('#simulador')
      .scrollIntoView({ behavior: 'smooth' });
  });
});

// Carrega as reservas ao abrir a página
carregarReservas();

