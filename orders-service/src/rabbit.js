const amqp = require('amqplib');

const EXCHANGE = 'orders_exchange';
const EXCHANGE_TYPE = 'direct';

async function connect(rabbitUrl) {
    try {
        const conn = await amqp.connect(rabbitUrl);
        const channel = await conn.createChannel();
        await channel.assertExchange(EXCHANGE, EXCHANGE_TYPE, { durable: true });
        return { channel, conn, EXCHANGE };
    } catch (error) {
        console.error('Erro ao conectar ao RabbitMQ:', error);
        throw error;
    }
}

async function publish(channel, exchange, routingKey, message) {
    try {
        const ok = channel.publish(
            exchange,
            routingKey,
            Buffer.from(JSON.stringify(message)),
            { persistent: true }
        );

        if (ok) {
            console.log(`Mensagem publicada na exchange ${exchange} com routingKey: ${routingKey}`);
        } else {
            console.log('Buffer cheio, mensagem não enviada imediatamente');
        }
    } catch (err) {
        console.error('Erro ao publicar mensagem:', err);
    }
}
// Exports
module.exports = { connect, publish, EXCHANGE };