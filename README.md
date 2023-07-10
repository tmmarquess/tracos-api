# **Tracos-API**

![GitHub repo size](https://img.shields.io/github/repo-size/tmmarquess/tracos-api?style=for-the-badge)
![GitHub top language](https://img.shields.io/github/languages/top/tmmarquess/tracos-api?style=for-the-badge)
![GitHub](https://img.shields.io/github/license/tmmarquess/tracos-api?style=for-the-badge)

## Sobre 📚

API backend da aplicação Tracos desenvolvida para a disciplina de sistemas paralelos e distribuídos

## Executando a aplicação 🚀

### Pré-requisitos 💻

Antes de começar, você precisa ter instalado no seu computador as ferramentas:

* [Git](https://git-scm.com/)
* [NodeJS](https://nodejs.org/en)

### instalando a **API** 📲

```
# Clone o repositório para o seu computador
$ https://github.com/tmmarquess/tracos-api.git

# Navegue para a pasta do código
$ cd tracos-api

# Instale as dependências
$ npm i
```

### Configurando o ambiente ⚙️

 Renomeie  o arquivo `.env.example` para `development.env` e prencha os campos vazios conforme o exemplo:

 ```
JWT_SECRET_KEY=<key_secreta>

TYPEORM_CONNECTION=<SDGB_utilizado>
TYPEORM_HOST=<host_do_SDGB>
PORT=<porta_do_SDGB>
TYPEORM_USERNAME=<username_de_autenticacao_SGBD>
TYPEORM_PASSWORD=<senha_de_autenticacao_SGBD>
TYPEORM_DATABASE=<nome_do_Banco_de_dados>

apiKey=<Parametro_do_firebase>
authDomain=<Parametro_do_firebase>
projectId=<Parametro_do_firebase>
storageBucket=<Parametro_do_firebase>
messagingSenderId=<Parametro_do_firebase>
appId=<Parametro_do_firebase>
measurementId=<Parametro_do_firebase>
 ```

### Iniciando o projeto 🤓

Após instalar as dependências e configurar o arquivo `development.env`, basta digitar em seu terminal o comando:

``` shell
npm start
```

Caso você tenha um database separado para Desenvolvimento & produção, crie o arquivo `production.env` nos mesmos parâmetros do `.env.example` e para utilizar estas configurações, digite no terminal:

``` shell
npm run start:prod
```

## Equipe 🤝🏼

<table>
  <tr>
    <td align="center">
      <a href="#">
        <img src="https://github.com/tmmarquess.png" width="100px;" alt="Foto"/><br>
        <sub>
          <a href="https://github.com/tmmarquess">Thiago Marques</a>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="#">
        <img src="https://github.com/beatrizdamascenof.png" width="100px;" alt="Foto"/><br>
        <sub>
          <a href="https://github.com/beatrizdamascenof">Beatriz Damasceno</a>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="#">
        <img src="https://github.com/Debby-Barros.png" width="100px;" alt="Foto"/><br>
        <sub>
            <a href="https://github.com/Debby-Barros"> Debora Barros</a>
        </sub>
      </a>
    </td>
  </tr>
</table>

[⬆ Voltar ao topo](#tracos-api)<br>
