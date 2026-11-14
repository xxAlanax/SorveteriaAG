
// Carrinho

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// Mensagem de produto
function mostrarMensagem() {
    let mensagem = document.getElementById("mensagem-carrinho");

    mensagem.classList.add("mostrar");

    setTimeout(function() {
        mensagem.classList.remove("mostrar");
    }, 3000);
}

// Adicionar no carrinho
function adicionarCarrinho(id, nome, preco, quantidade, imagem) {
    let produtoExistente = carrinho.find (
        produto => produto.id === id
    );

    if (produtoExistente) {
        produtoExistente.quantidade += quantidade;
    } else {
        carrinho.push({
            id: id, nome: nome, preco: preco, quantidade: quantidade, imagem:imagem
        });
    }
    localStorage.setItem("carrinho", JSON.stringify(carrinho))

    mostrarMensagem();
}

// Botão

const botaoAdicionar = document.getElementById("adicionar-carrinho");

if (botaoAdicionar) {
    botaoAdicionar.addEventListener("click", function() {
        let imagem = botaoAdicionar.dataset.imagem;
        let id = botaoAdicionar.dataset.id;
        let nome = botaoAdicionar.dataset.nome;
        let preco = Number(botaoAdicionar.dataset.preco);

        let quantidade = Number(
            document.getElementById("quantidade").value
        );

        if (quantidade < 1 || quantidade > 100 || !Number.isInteger(quantidade)) {
            alert("Quantidade inválida!.");
            return;
        }

        adicionarCarrinho(id, nome, preco, quantidade, imagem);
    });
}

// Carrinho

function mostrarCarrinho() {
    let lista = document.getElementById("produtos");
    let totalElemento = document.getElementById("total");
    let mensagemVazio = document.getElementById("vazio");

    if (!lista || !totalElemento){
        return;
    }

    lista.innerHTML = "";

    let total = 0;

    if (carrinho.length === 0) {
        mensagemVazio.style.display = "block";
    } else {
        mensagemVazio.style.display = "none";
    }

     carrinho.forEach((produto, indice) => {

        let subtotal = produto.preco * produto.quantidade;

        total += subtotal;

        lista.innerHTML += `
        <div class="item-carrinho">
            <img src="${produto.imagem}" alt="${produto.nome}">

            <div class="info-produto">
                <h3>${produto.nome}</h3>
                <p>Quantidade: ${produto.quantidade}</p>
                <p>Preço: R$ ${produto.preco.toFixed(2)}</p>
            </div>

            <button type=button class=botao onclick="removerProduto(${indice})">Remover</button>
        </div>
        `;

    });

    let botaoContinuar = document.getElementById("continuar");

    if (carrinho.length === 0) {
        mensagemVazio.style.display = "block";

        botaoContinuar.classList.add("desabilitado");
        botaoContinuar.removeAttribute("href");

    } else {
        mensagemVazio.style.display = "none";

        botaoContinuar.classList.remove("desabilitado");
        botaoContinuar.href = "Pedido.html";
    }

    totalElemento.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

mostrarPedido();

// Remover produto

function removerProduto(indice) {
    carrinho.splice(indice, 1);

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    mostrarCarrinho();
}


mostrarCarrinho();

// Mostra pedido na página pedido
function mostrarPedido() {
    let lista = document.getElementById("itens_pedido");
    let totalElemento = document.getElementById("total");

    if (!lista || !totalElemento) {
        return;
    }

    lista.innerHTML = "";

    let total = 0;

    carrinho.forEach(produto => {
        let subtotal = produto.preco * produto.quantidade;

        total += subtotal;

        lista.innerHTML += `
            <div class="item-carrinho">
                <img src="${produto.imagem}" alt="${produto.nome}">

                <div class="info-produto">
                    <h3>${produto.nome}</h3>
                    <p>Quantidade: ${produto.quantidade}</p>
                    <p>Preço: ${subtotal.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})}</p>
                </div>
            </div>
        `;
    });

    totalElemento.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

const formulario = document.querySelector(".finalizar form");

if (formulario) {
    formulario.addEventListener("submit", function(event) {
        event.preventDefault();

        if (carrinho.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }
        carrinho = [];

        localStorage.setItem("carrinho", JSON.stringify(carrinho));

        document.getElementById("itens_pedido").style.display = "none";

        alert("Compra finalizada!");
    });
}

// Buscar

const busca = document.querySelector(".busca");

if (busca) {
    busca.addEventListener("submit", function(event) {
        event.preventDefault();

        let pesquisa = document.getElementById("pesquisa").value
            .trim()
            .toLowerCase();

        let produtos = document.querySelectorAll(".produto-card");

        produtos.forEach(function(produto) {
            let nome = produto.querySelector("h2").textContent.toLowerCase();

            if (nome.includes(pesquisa)) {
                produto.style.display = "";
            } else {
                produto.style.display = "none";
            }
        });
    });
}

// Cadastro e login

const cadastro = document.getElementById("form_cadastro");

if (cadastro) {
    cadastro.addEventListener("submit", function(event) {
        event.preventDefault();

        let nome = document.getElementById("nome").value.trim();
        let email = document.getElementById("email").value.trim();
        let senha = document.getElementById("senha").value;
        let confirma = document.getElementById("confirma").value;
        let mensagemErro = document.getElementById("erro");

        if (senha !== confirma) {
            mensagemErro.textContent = "As senhas estão diferentes";
            mensagemErro.classList.add("mostrar");
            return;
        }

        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        let usuarioExiste = usuarios.some(usuario => usuario.email === email);

        if (usuarioExiste) {
            mensagemErro.textContent = "Este email já está cadastrado!";
            mensagemErro.classList.add("mostrar");
            return;
        }

        mensagemErro.classList.remove("mostrar");

        let novoUsuario = {
            nome: nome,
            email: email,
            senha: senha
        };

        usuarios.push(novoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        window.location.href = "Login.html";
    });
}

const login = document.getElementById("form_login");
const mensagemErro = document.getElementById("erro");

if (login) {
    login.addEventListener("submit", function(event) {
        event.preventDefault();

        mensagemErro.textContent = "";
        mensagemErro.classList.remove("mostrar");

        let email = document.getElementById("email").value.trim();
        let senha = document.getElementById("senha").value;

        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        let usuarioEncontrado = usuarios.find(usuario =>
            usuario.email === email && usuario.senha === senha
        );

        if (usuarioEncontrado) {
            sessionStorage.setItem("usuarioLogado", JSON.stringify({
                nome: usuarioEncontrado.nome,
                email: usuarioEncontrado.email
            }));

            alert("Login realizado com sucesso!");

            window.location.href = "../index.html";

        } else {
            mensagemErro.textContent = "Email ou senha incorretos!";
            mensagemErro.classList.add("mostrar");
        }
    });
}

