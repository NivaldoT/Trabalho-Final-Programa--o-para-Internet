import express from "express";
import session from "express-session"
import cookieParser from "cookie-parser";

const host = "0.0.0.0";
const port = 5000;
const app = express();
var listaEquipes = [];

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "S3GR3D0",
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 1000*60*30,      //tempo de vida útil de 30 minutos
        httpOnly: true,
        secure: false           //true se for https
    }   
}));

app.use(cookieParser());

app.get("/", verificarAutenticacao, (requisicao, resposta) => {
    const ultimoLogin = requisicao.cookies.ultimoLogin;
    resposta.send(`
            <html lang="pt-br">
                <head>
                    <meta charset="UTF-8">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
                    <title>Vôlei Master</title>
                </head>
                <body>
                   <nav class="navbar navbar-expand-lg navbar-light bg-light" style="margin: 10px 30px;">
                    <div class="container-fluid">
                        <a class="navbar-brand" href="/">Vôlei Master</a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarNav">
                            <ul class="navbar-nav">
                                <li class="nav-item">
                                    <a class="nav-link" href="/">Início</a>
                                </li>
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Cadastro
                                    </a>
                                    <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                        <li><a class="dropdown-item" href="/cadastroEquipes">Cadastrar Equipes</a></li>
                                        <li><hr class="dropdown-divider"></li>
                                        <li><a class="dropdown-item" href="/cadastroJogadores">Cadastrar Jogadores</a></li>
                                    </ul>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="/listaEquipes">Lista de Equipes</a>
                                </li>
                            </ul>
                            <span class="navbar-text ms-auto">${ultimoLogin ? `Último login: ${ultimoLogin}` : ''}</span>
                            <ul class="navbar-nav" style="color: black; text-decoration: underline;">
                                <li class="nav-item">
                                    <a class="nav-link" href="/logout">Sair</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    </nav>
                    <div class="container">
                        <img src="https://www.unoeste.br/fipp/Content/imagens/logo-fipp-512x200.png" alt="Vôlei" style="width: 600px; display: block; margin: 0 auto;">
                        <br>
                        <h1 style="text-align: center;">Bem-vindo ao Vôlei Master</h1>
                        <p style="text-align: center;">Gerencie suas equipes e jogadores de vôlei com facilidade.</p>
                        <div class="text-center">
                            <a class="btn btn-primary btn-lg" href="/cadastroEquipes">Cadastrar Equipes</a>
                            <a class="btn btn-secondary btn-lg" href="/cadastroJogadores">Cadastrar Jogadores</a>
                            <a class="btn btn-success btn-lg" href="/listaEquipes">Ver Lista de Equipes</a>
                        </div>
                </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
            </html>
        `);
    resposta.end();
});

app.get("/cadastroEquipes",verificarAutenticacao, (requisicao,resposta) => {
    const ultimoLogin = requisicao.cookies.ultimoLogin;
    resposta.send(
    `<html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
            <title>Vôlei Master</title>
        </head>
        <body>
            <nav class="navbar navbar-expand-lg navbar-light bg-light" style="margin: 10px 30px;">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">Vôlei Master</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="/">Início</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Cadastro
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                <li><a class="dropdown-item" href="/cadastroEquipes">Cadastrar Equipes</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="/cadastroJogadores">Cadastrar Jogadores</a></li>
                            </ul>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/listaEquipes">Lista de Equipes</a>
                        </li>
                    </ul>
                    <span class="navbar-text ms-auto">${ultimoLogin ? `Último login: ${ultimoLogin}` : ''}</span>
                    <ul class="navbar-nav" style="color: black; text-decoration: underline;">
                        <li class="nav-item">
                            <a class="nav-link" href="/logout">Sair</a>
                        </li>
                    </ul>
                </div>
            </div>
            </nav>

            <div class="container">
                <h1 style ="text-align: center"> Cadastro de Equipes </h1>
                <form name="formulario" id="formulario" method="post" action="/cadastroEquipes" >
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="inputGroup-sizing-default">Nome da Equipe</span>
                        <input id="nomeEquipe" name="nomeEquipe" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="inputGroup-sizing-default">Nome do Técnico</span>
                        <input id="nomeTecnico" name="nomeTecnico" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="inputGroup-sizing-default">Telefone do Técnico</span>
                        <input id="telTecnico" name="telTecnico" type="tel" maxlength="11" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
                    </div>

                    <button type="submit" class="btn btn-primary btn-lg">Cadastrar</button>
                    <a class="btn btn-secondary btn-lg" href="/">Cancelar</a>
                </form>
            </div>

        </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
    </html>
        `);
    resposta.end();
});

app.post("/cadastroEquipes",verificarAutenticacao, (requisicao, resposta) => {
    const nomeEquipe = requisicao.body.nomeEquipe;
    const nomeTecnico = requisicao.body.nomeTecnico;
    const telTecnico = requisicao.body.telTecnico;
    if(nomeEquipe && nomeTecnico && !isNaN(telTecnico) && telTecnico.length ==11){
        listaEquipes.push({
            nomeEquipe: nomeEquipe,
            nomeTecnico: nomeTecnico,
            telTecnico: telTecnico
        });
        resposta.redirect("/listaEquipes");
    }
    else{
        const ultimoLogin = requisicao.cookies.ultimoLogin;
        let conteudo = `
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
            <title>Vôlei Master</title>
        </head>
        <body>
            <nav class="navbar navbar-expand-lg navbar-light bg-light" style="margin: 10px 30px;">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">Vôlei Master</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="/">Início</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="/" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Cadastro
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                <li><a class="dropdown-item" href="/cadastroEquipes">Cadastrar Equipes</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="/cadastroJogadores">Cadastrar Jogadores</a></li>
                            </ul>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/listaEquipes">Lista de Equipes</a>
                        </li>
                    </ul>
                    <span class="navbar-text ms-auto">${ultimoLogin ? `Último login: ${ultimoLogin}` : ''}</span>
                    <ul class="navbar-nav" style="color: black; text-decoration: underline;">
                        <li class="nav-item">
                            <a class="nav-link" href="/logout">Sair</a>
                        </li>
                    </ul>
                </div>
            </div>
            </nav>
        <div class="container">
            <form name="formulario" id="formulario" method="post" action="/cadastroEquipes" novalidate>
                <h1 style ="text-align: center"> Cadastro de Equipes </h1>
                `;
    if(!nomeEquipe){
        conteudo +=`
                    <div>
                    <div class="input-group mb-0">
                        <span class="input-group-text" id="inputGroup-sizing-default" >Nome da Equipe</span>
                        <input id="nomeEquipe" name="nomeEquipe" required type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
                    </div>
                    <span class="text-danger">Por favor informe o nome da equipe!</span></div>` ;
                }
    else{
        conteudo+=`
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="inputGroup-sizing-default" >Nome da Equipe</span>
                        <input id="nomeEquipe" name="nomeEquipe" value="${nomeEquipe}" required type="text" class="form-control" aria-label="Sizing example input"         aria-describedby="inputGroup-sizing-default">
                    </div>`
                    ;
    
        }
    if(!nomeTecnico){
        conteudo+=`
                <div>
                <div class="input-group mb-0">
                    <span class="input-group-text" id="inputGroup-sizing-default">Nome do Técnico</span>
                    <input id="nomeTecnico" name="nomeTecnico" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
                </div>
                <span class="text-danger">Por favor informe o nome do técnico!</span></div>`;
    }
    else{
        conteudo+=`
                <div class="input-group mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-default">Nome do Técnico</span>
                    <input id="nomeTecnico" name="nomeTecnico" value="${nomeTecnico}" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
                </div>`;
    }
    if(telTecnico.length!=11){
        conteudo+=`
                <div>
                <div class="input-group mb-0">
                    <span class="input-group-text" id="inputGroup-sizing-default">Telefone do Técnico</span>
                    <input id="telTecnico" name="telTecnico" maxlength="11" value="${telTecnico}" type="tel" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
                </div>
                <span class="text-danger">Por favor informe o telefone do técnico!</span></div>`;
    }
    else{
        conteudo+=`
                <div class="input-group mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-default">Telefone do Técnico</span>
                    <input id="telTecnico" name="telTecnico" maxlength="11 value="${telTecnico}" type="tel" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
                </div>`;
    }
        conteudo+=`
                <button type="submit" class="btn btn-primary btn-lg">Cadastrar</button>
                <a class="btn btn-secondary btn-lg" href="/">Cancelar</a>
            </form>
        </div>

        </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
    </html>
        `;
    resposta.send(conteudo);
    resposta.end;
    };
});

app.get("/listaEquipes",verificarAutenticacao, (requisicao, resposta) => {
        const ultimoLogin = requisicao.cookies.ultimoLogin;
    let conteudo=
    `<html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
            <title>Vôlei Master</title>
        </head>
        <body>
            <nav class="navbar navbar-expand-lg navbar-light bg-light" style="margin: 10px 30px;">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">Vôlei Master</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="/">Início</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Cadastro
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                <li><a class="dropdown-item" href="/cadastroEquipes">Cadastrar Equipes</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="/cadastroJogadores">Cadastrar Jogadores</a></li>
                            </ul>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/listaEquipes">Lista de Equipes</a>
                        </li>
                    </ul>
                    <span class="navbar-text ms-auto">${ultimoLogin ? `Último login: ${ultimoLogin}` : ''}</span>
                    <ul class="navbar-nav" style="color: black; text-decoration: underline;">
                        <li class="nav-item">
                            <a class="nav-link" href="/logout">Sair</a>
                        </li>
                    </ul>
                </div>
            </div>
            </nav>
                <h1 style="margin-top: 20px;text-align: center;">Lista de Equipes</h1>
                <div class="container">`;
            if(listaEquipes.length > 0 ){
                for(let i=0;i<listaEquipes.length;i++)
                {
                    conteudo+=`
                        <table class="table table-striped table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th colspan="2"> Equipe: ${listaEquipes[i].nomeEquipe} </th>
                                    <th colspan="2"> Técnico: ${listaEquipes[i].nomeTecnico} </th>
                                    <th colspan="2"> Telefone: ${listaEquipes[i].telTecnico} </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td> Jogador </td>
                                    <td> N° Camisa </td>
                                    <td> Data de Nascimento </td>
                                    <td> Altura </td>
                                    <td> Gênero </td>
                                    <td> Posição </td>
                                </tr>`
                            if(listaEquipes[i].jogadores !== undefined)
                            for(let j=0;j<listaEquipes[i].jogadores.length;j++)
                                conteudo+=`
                                <tr>
                                    <td> ${listaEquipes[i].jogadores[j].nome} </td>
                                    <td> ${listaEquipes[i].jogadores[j].camisa} </td>
                                    <td> ${listaEquipes[i].jogadores[j].data} </td>
                                    <td> ${listaEquipes[i].jogadores[j].altura}cm </td>
                                    <td> ${listaEquipes[i].jogadores[j].genero} </td>
                                    <td> ${listaEquipes[i].jogadores[j].posicao} </td>
                                </tr>`;
                                conteudo+=`
                            </tbody>
                        </table>`
                }
            }
            else{
                conteudo+=`
                    <div class="alert alert-warning" role="alert">
                        Nenhuma equipe cadastrada!
                    </div>`;
            }
            conteudo+=`
            <a class="btn btn-primary btn-lg" href="/cadastroEquipes">Cadastrar Nova Equipe</a>
            <a class="btn btn-primary btn-lg" href="/cadastroJogadores">Cadastrar Novo Jogador</a>
            <a class="btn btn-secondary btn-lg" href="/">Voltar ao Menu</a>
            </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
        </html>`;
    resposta.send(conteudo);
    resposta.end();
})

app.get("/cadastroJogadores",verificarAutenticacao, (requisicao,resposta) => {
    const ultimoLogin = requisicao.cookies.ultimoLogin;
    let conteudo =
    `<html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
            <title>Vôlei Master</title>
        </head>
        <body>
            <nav class="navbar navbar-expand-lg navbar-light bg-light" style="margin: 10px 30px;">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">Vôlei Master</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="/">Início</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Cadastro
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                <li><a class="dropdown-item" href="/cadastroEquipes">Cadastrar Equipes</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="/cadastroJogadores">Cadastrar Jogadores</a></li>
                            </ul>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/listaEquipes">Lista de Equipes</a>
                        </li>
                    </ul>
                    <span class="navbar-text ms-auto">${ultimoLogin ? `Último login: ${ultimoLogin}` : ''}</span>
                    <ul class="navbar-nav" style="color: black; text-decoration: underline;">
                        <li class="nav-item">
                            <a class="nav-link" href="/logout">Sair</a>
                        </li>
                    </ul>
                </div>
            </div>
            </nav>
            <div class="container">
                <h1 style ="text-align: center"> Cadastro de Jogadores </h1>
                <form name="formulario" id="formulario" method="post" action="/cadastroJogadores" novalidate>
                    <div class="input-group mb-3">
                        <label class="input-group-text" for="equipeSel">Equipe</label>
                        <select class="form-select" id="equipeSel" name="equipeSel">
                            <option selected value ="">...</option>`;
                            if(listaEquipes.length>0)
                                for(let i=0;i<listaEquipes.length;i++)
                                    conteudo+=`
                                    <option> ${listaEquipes[i].nomeEquipe} </option>`;
                            conteudo+=`
                        </select>
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="inputGroup-sizing-default">Nome</span>
                        <input id="nome" name="nome" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="inputGroup-sizing-default">N° Camisa</span>
                        <input id="camisa" name="camisa" type="number" maxlength="11" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="inputGroup-sizing-default">Data de Nascimento</span>
                        <input id="data" name="data" type="date" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="inputGroup-sizing-default">Altura em CM</span>
                        <input id="altura" name="altura" type="number" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
                    </div>
                    <div class="input-group mb-3">
                        <label class="input-group-text" for="genero">Genero</label>
                        <select class="form-select" id="genero" name="genero">
                            <option selected value ="">...</option>
                            <option> Masculino </option>
                            <option> Feminino </option>
                        </select>
                    </div>
                    <div class="input-group mb-3">
                        <label class="input-group-text" for="posicao">Posição</label>
                        <select class="form-select" id="posicao" name="posicao">
                            <option selected value ="">...</option>
                            <option> Levantador </option>
                            <option> Oposto </option>
                            <option> Ponteiro </option>
                            <option> Central </option>
                            <option> Líbero </option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary btn-lg">Cadastrar</button>
                    <a class="btn btn-secondary btn-lg" href="/">Cancelar</a>
                </form>
            </div>
        </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
    </html>
        `;
        resposta.send(conteudo);
    resposta.end();
});

app.post("/cadastroJogadores",verificarAutenticacao,(requisicao, resposta) =>{
    const equipeSel = requisicao.body.equipeSel;
    const nome = requisicao.body.nome;
    const camisa = requisicao.body.camisa;
    const data = requisicao.body.data;
    const [ano,mes,dia] = data.split("-");
    const dataBR = `${dia}/${mes}/${ano}`;
    const altura = requisicao.body.altura;
    const genero = requisicao.body.genero;
    const posicao = requisicao.body.posicao;
    var equipe = -1;
    var invalido = false;

    for(let i=0;i<listaEquipes.length;i++)
        if(listaEquipes[i].nomeEquipe == equipeSel)
            equipe = i;

    if(equipe === -1) {
        invalido = true;
    } 
    else {
        if(listaEquipes[equipe].jogadores === undefined)
            listaEquipes[equipe].jogadores = [];
    }
    if(equipe !== -1) 
        if(listaEquipes[equipe].jogadores.length==6)
            var maxEquipe = true;
    

    if(altura < 140 || altura > 250)
        invalido = true;
    if(camisa < 1 || camisa > 99)
        invalido = true;

    const dataNascimento = new Date(data);
    const hoje = new Date();
    const idade = hoje.getFullYear() - dataNascimento.getFullYear();
    if (idade < 15 || idade > 100) 
        invalido = true;

    if(equipeSel && nome && camisa && data && altura && genero && posicao && !maxEquipe && !invalido)
    {
        listaEquipes[equipe].jogadores.push({
            nome: nome,
            camisa: camisa,
            data: dataBR,
            altura: altura,
            genero: genero,
            posicao: posicao
        });
        resposta.redirect("/listaEquipes");
    }
    else
    {
        const ultimoLogin = requisicao.cookies.ultimoLogin;
        let conteudo =
    `<html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
            <title>Vôlei Master</title>
        </head>
        <body>
            <nav class="navbar navbar-expand-lg navbar-light bg-light" style="margin: 10px 30px;">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">Vôlei Master</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="/">Início</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Cadastro
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                <li><a class="dropdown-item" href="/cadastroEquipes">Cadastrar Equipes</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="/cadastroJogadores">Cadastrar Jogadores</a></li>
                            </ul>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/listaEquipes">Lista de Equipes</a>
                        </li>
                    </ul>
                    <span class="navbar-text ms-auto">${ultimoLogin ? `Último login: ${ultimoLogin}` : ''}</span>
                    <ul class="navbar-nav" style="color: black; text-decoration: underline;">
                        <li class="nav-item">
                            <a class="nav-link" href="/logout">Sair</a>
                        </li>
                    </ul>
                </div>
            </div>
            </nav>
            <div class="container">
                <h1 style ="text-align: center"> Cadastro de Jogadores </h1>
                <form name="formulario" id="formulario" method="post" action="/cadastroJogadores" novalidate >`;
                if(maxEquipe || equipeSel === "")
                    conteudo+=`<div>
                    <div class="input-group mb-0">`;
                else
                conteudo+=`<div class="input-group mb-3">`;
                conteudo+=`
                        <label class="input-group-text" for="equipeSel">Equipe</label>
                        <select class="form-select" id="equipeSel" name="equipeSel">
                            <option value="">...</option>`;
                            if(listaEquipes.length>0)
                                for(let i=0;i<listaEquipes.length;i++)
                                    conteudo+=`
                                    <option ${equipeSel==listaEquipes[i].nomeEquipe ? 'selected' : ''}> ${listaEquipes[i].nomeEquipe} </option>`;
                            conteudo+=`</select>`;
                        if(maxEquipe)
                            conteudo+=`</div><span class="text-danger">Equipe já possui 6 jogadores!</span>`;
                        if(equipeSel === "")
                            conteudo+=`</div><span class="text-danger">Por favor selecione a equipe do jogador!</span>`;
                    conteudo+=`</div>`;
                        if(!nome){
                            conteudo+=`<div>
                            <div class="input-group mb-0">
                                <span class="input-group-text" id="inputGroup-sizing-default">Nome</span>
                                <input id="nome" name="nome" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
                            </div>
                            <span class="text-danger">Por favor informe o nome do jogador!</span></div>`;
                        }
                        else{
                            conteudo+=`
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="inputGroup-sizing-default">Nome</span>
                                <input id="nome" name="nome" type="text" value="${nome}" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
                            </div>`;
                        }
                        if(!camisa || camisa < 1 || camisa > 99){
                            conteudo+=`<div>
                            <div class="input-group mb-0">
                                <span class="input-group-text" id="inputGroup-sizing-default">N° Camisa</span>
                                <input id="camisa" name="camisa" type="number" value="${camisa}" maxlength="11" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
                            </div>
                            <span class="text-danger">Por favor informe a camisa do jogador!(Entre 1 e 99)</span></div>`;
                        }
                        else{
                            conteudo+=`
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="inputGroup-sizing-default">N° Camisa</span>
                                <input id="camisa" name="camisa" value="${camisa}" type="number" maxlength="11" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
                            </div>`;
                        }
                        if(!data || idade < 15 || idade > 100){
                            conteudo+=`<div>
                            <div class="input-group mb-0">
                                <span class="input-group-text" id="inputGroup-sizing-default">Data de Nascimento</span>
                                <input id="data" name="data" value="${data}" type="date" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
                            </div>
                            <span class="text-danger">Por favor informe a data de nascimento do jogador!(Entre 15 e 100 anos)</span></div>`
                        }
                        else{
                            conteudo+=`
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="inputGroup-sizing-default">Data de Nascimento</span>
                                <input id="data" name="data" type="date" value="${data}" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
                            </div>`;
                        }
                        if(!altura || altura < 140 || altura > 250){
                            conteudo+=`<div>
                            <div class="input-group mb-0">
                                <span class="input-group-text" id="inputGroup-sizing-default">Altura em CM</span>
                                <input id="altura" name="altura" value="${altura}" type="number" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
                            </div>
                            <span class="text-danger">Por favor informe a altura do jogador!(Entre 140 e 250 CM)</span></div>`;
                        }
                        else{
                            conteudo+=`
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="inputGroup-sizing-default">Altura em CM</span>
                                <input id="altura" name="altura" value="${altura}" type="number" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
                            </div>`;
                        }
                        if(!genero){
                            conteudo+=`<div>
                            <div class="input-group mb-0">
                                <label class="input-group-text" for="genero">Genero</label>
                                <select class="form-select" id="genero" name="genero">
                                    <option selected value="">...</option>
                                    <option> Masculino </option>
                                    <option> Feminino </option>
                                </select>
                            </div>
                            <span class="text-danger">Por favor informe o gênero do jogador!</span></div>`;
                        }
                        else{
                            conteudo+=`
                            <div class="input-group mb-3">
                                <label class="input-group-text" for="genero">Genero</label>
                                <select class="form-select" id="genero" name="genero">
                                    <option value="">...</option>
                                    <option ${genero=="Masculino"? 'selected' : ''}> Masculino </option>
                                    <option ${genero=="Feminino"? 'selected' : ''}> Feminino </option>
                                </select>
                            </div>
                            `;
                        }
                        if(!posicao){
                            conteudo+=`<div>
                            <div class="input-group mb-0">
                                <label class="input-group-text" for="posicao">Posição</label>
                                <select class="form-select" id="posicao" name="posicao">
                                    <option selected value="">...</option>
                                    <option> Levantador </option>
                                    <option> Oposto </option>
                                    <option> Ponteiro </option>
                                    <option> Central </option>
                                    <option> Líbero </option>
                                </select>
                            </div>
                            <span class="text-danger">Por favor informe o gênero do jogador!</span></div>`;
                        }
                        else{
                            conteudo+=`
                            <div class="input-group mb-3">
                                <label class="input-group-text" for="posicao">Posição</label>
                                <select class="form-select" id="posicao" name="posicao">
                                    <option selected value="">...</option>
                                    <option ${posicao=="Levantador"? 'selected' : ''}> Levantador </option>
                                    <option ${posicao=="Oposto"? 'selected' : ''}> Oposto </option>
                                    <option ${posicao=="Ponteiro"? 'selected' : ''}> Ponteiro </option>
                                    <option ${posicao=="Central"? 'selected' : ''}> Central </option>
                                    <option ${posicao=="Líbero"? 'selected' : ''}> Líbero </option>
                                </select>
                            </div>`;
                        }
                    conteudo+=`
                    <button type="submit" class="btn btn-primary btn-lg">Cadastrar</button>
                    <a class="btn btn-secondary btn-lg" href="/">Cancelar</a>
                </form>
            </div>
        </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
    </html>`;
        resposta.send(conteudo);
    resposta.end();
    }
});

app.get("/login", (requisicao, resposta) => {
    resposta.send(`
    <!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Vôlei Master</title>
    <style>
        body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f4f4f9;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }

    .container {
      background-color: #fff;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
      
    }

    h2 {
      text-align: center;
      margin-bottom: 24px;
      color: #333;
    }

    form label {
      display: block;
      text-align: left;
      margin-top: 15px;
      margin-bottom: 5px;
      font-weight: 600;
      color: #444;
    }

    form input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 14px;
      transition: border 0.3s ease;
    }

    form input:focus {
      border-color: #5c6bc0;
      outline: none;
    }

    button {
      margin-top: 20px;
      width: 100%;
      padding: 12px;
      background-color: #261c7e;
      color: white;
      font-size: 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    button:hover {
      background-color: rgb(73, 88, 172);
    }
    
    </style>
</head>
<body>
    <div class="container">
        <h2>Login Admin:</h2>
        <form method="post" action="" name="formulario" id="formulario">

            <label for="usuario">Usuário</label>
            <input type="text" id="usuario" name="usuario" required><br>

            <label for="senha">Senha</label>
            <input type="password" id="senha" name="senha" required><br>

            <button type="submit">Entrar</button>
        </form>
    </div>
        <script></script>
</body>
</html>`);
});

app.post("/login", (requisicao, resposta) => {
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;
    if(usuario == 'admin' && senha == '123'){
        requisicao.session.logado = true;
        const dataHoraAtual = new Date();
        resposta.cookie('ultimoLogin',dataHoraAtual.toLocaleString('pt-BR'),{ maxAge: 1000*60*60*24});
        resposta.redirect("/");
    }
    else{
        resposta.send(`
            <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login - Vôlei Master</title>
            <style>
                body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f4f4f9;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            }
            .container {
            background-color: #fff;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
            }
            h2 {
            text-align: center;
            margin-bottom: 24px;
            color: #333;
            }
            form label {
            display: block;
            text-align: left;
            margin-top: 15px;
            margin-bottom: 5px;
            font-weight: 600;
            color: #444;
            }
            form input {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 14px;
            transition: border 0.3s ease;
            }
            form input:focus {
            border-color: #5c6bc0;
            outline: none;
            }
            button {
            margin-top: 20px;
            width: 100%;
            padding: 12px;
            background-color: #261c7e;
            color: white;
            font-size: 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            }
            button:hover {
            background-color: rgb(73, 88, 172);
            }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Login Admin:</h2>
                <form method="post" action="" name="formulario" id="formulario">

                    <label for="usuario">Usuário</label>
                    <input type="text" id="usuario" name="usuario" required><br>

                    <label for="senha">Senha</label>
                    <input type="password" id="senha" name="senha" required><br>
                    <span style="color: red">Usuário ou senha inválidos!</span>  
                    <button type="submit">Entrar</button>
                </form>
            </div>
                <script></script>
        </body>
        </html>`);
    }
});

function verificarAutenticacao(requisicao, resposta, next) {
    if (requisicao.session.logado)
        next();
    else
        resposta.redirect("/login");
}

app.get("/logout", (requisicao, resposta) => {
    requisicao.session.destroy();
    resposta.redirect("/login");
});

app.listen(port, host, () => {
    console.log(`Servidor em execução em http://${host}:${port}/`);
});