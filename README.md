# Carometro-Turbinado
Software para gestão de alunos

# 📌 Projeto

Este projeto utiliza Node.js, Next.js e Firebase. Siga os passos abaixo para configurá-lo corretamente.

## 🚀 Instalação

1. **Clone o repositório:**
   ```sh
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
   ```

2. **Instale o Node.js e npm** (caso ainda não tenha):
   - [Download Node.js](https://nodejs.org/)
   - O npm já vem incluído com o Node.js

3. **Instale as dependências:**
   ```sh
   npm install
   ```

## 🔥 Configuração do Firebase

1. **Crie uma conta no Firebase:**
   - Acesse [Firebase Console](https://console.firebase.google.com/)
   - Crie um novo projeto

2. **Obtenha as credenciais do Firebase:**
   - No painel do Firebase, acesse "Configuração do projeto" > "Configuração do SDK do Firebase".
   - Copie suas credenciais.

3. **Configure as variáveis de ambiente:**
   - Crie um arquivo `.env` na raiz do projeto.
   - Use o arquivo `example.env` como base.
   - Adicione as credenciais do Firebase ao `.env`.

## 🏃 Executando o Projeto

Para rodar o projeto em ambiente de desenvolvimento:
```sh
npm run dev
```

Para gerar uma versão pronta para produção:
```sh
npm run build
npm start
```


