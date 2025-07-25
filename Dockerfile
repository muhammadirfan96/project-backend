# Gunakan image Node.js terbaru
FROM node:18

# Set direktori kerja dalam container
WORKDIR /app

# Copy package.json, pac dan install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy seluruh kode sumber
COPY . .

# Jalankan aplikasi
CMD ["node", "src/index.js"]

# Gunakan port 5000
EXPOSE 5000

