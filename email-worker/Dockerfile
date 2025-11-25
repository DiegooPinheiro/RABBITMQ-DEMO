# Usar a imagem oficial do Node.js como base
FROM node:18

# Definir diretório de trabalho dentro do container
WORKDIR /app

# Copiar arquivos de dependências para instalação
COPY package.json package-lock.json ./

# Instalar apenas dependências de produção
RUN npm install --production

# Copiar o código fonte
COPY src ./src

# Definir variável de ambiente para produção
ENV NODE_ENV=production

# Comando padrão para rodar a aplicação
CMD ["node", "src/index.js"]
