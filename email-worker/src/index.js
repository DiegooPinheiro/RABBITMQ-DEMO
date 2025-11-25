const { connect } = require('./rabbit');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
const EXCHANGE = 'emails_exchange';  // Use a dedicated exchange for emails
const QUEUE = 'email_queue';
const ROUTING_KEY = 'order.created';  // Assuming we listen for order created events to send emails

let channelRef;

(async () => {
    try {
        const { channel, conn } = await connect(RABBITMQ_URL, EXCHANGE);
        channelRef = channel;

        await channel.assertQueue(QUEUE, { durable: true });
        await channel.bindQueue(QUEUE, EXCHANGE, ROUTING_KEY);

        console.log('Email worker conectado ao RabbitMQ e aguardando mensagens...');

        channel.consume(QUEUE, async (msg) => {
            if (msg !== null) {
                const content = JSON.parse(msg.content.toString());
                console.log('Mensagem recebida:', content);

                // Simulating sending email
                console.log(`Enviando email para: ${content.customerEmail} sobre o pedido: ${content.id}`);

                // Acknowledge the message after processing
                channel.ack(msg);
            }
        });

    } catch (error) {
        console.error('Erro ao conectar ao RabbitMQ:', error);
        process.exit(1);
    }
})();
