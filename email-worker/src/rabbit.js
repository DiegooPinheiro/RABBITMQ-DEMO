const amqp = require('amqplib');

async function connect(rabbitUrl, exchangeName) {
    try {
        const conn = await amqp.connect(rabbitUrl);
        const channel = await conn.createChannel();
        await channel.assertExchange(exchangeName, 'direct', { durable: true });
        return { channel, conn };
    } catch (error) {
        console.error('Erro ao conectar ao RabbitMQ:', error);
        throw error;
    }
}

module.exports = { connect };
