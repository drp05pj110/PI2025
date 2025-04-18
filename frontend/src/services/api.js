import axios from 'axios';

// Certifique-se de usar o IP da máquina onde o backend está rodando
export const api = axios.create({
    baseURL: 'http://192.168.0.18:5000', // Substitua pelo IP correto
    timeout: 10000, // Tempo limite de 10 segundos para requisições
    headers: {
        'Content-Type': 'application/json',
    },
});
