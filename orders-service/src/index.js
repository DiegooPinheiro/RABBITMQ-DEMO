//index.js - API simople que cria pedidos e publica eventos no RabbitMQ
const express = require('express');
const bodyParser = require('body-parser');
const {v4: uuidv4} = require('uuid');
const { connect, publish, EXCHANGE } = require('./rabbit');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';

let channelRef;
(async () => {
    try {
        const { channel, conn, EXCHANGE } = await connect(RABBITMQ_URL);
        channelRef = channel;
        console.log('Conectado ao RabbitMQ');
    } catch (error) {
        console.error('Erro ao conectar ao RabbitMQ:', error);
        process.exit(1);
    }
})();

app.post('/orders', async (req, res) => {
    const { item, quantity } = req.body;
    if (!item || !quantity) {
        return res.status(400).json({ error: 'Item e quantidade são obrigatórios' });
    }
    
    const order = {
        id: uuidv4(),
        customerEmail,
        item,
        createdAt: new Date().toISOString()
    };

    try { 
        const routingKey = 'order.created';
        await publish(channelRef, EXCHANGE, routingKey, order);
        console.log('Pedido criado:', order.id);
    }catch (error) {
        console.error('Erro ao publicar evento de pedido criado:', error);
        return res.status(500).json({ error: 'Erro ao criar pedido' });
    }
});
app.get('/' , (req, res) => {
    res.send('Orders Service is running');
});

app.listen(PORT, () => {
    console.log(`Orders Service rodando na porta ${PORT}`);
});

module.exports = app;