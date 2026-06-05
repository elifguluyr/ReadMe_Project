const amqp = require('amqplib');

async function startWorker() {
    try {
        // RabbitMQ'ya bağlan
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        const channel = await connection.createChannel();
        const queueName = 'email_queue';

        await channel.assertQueue(queueName, { durable: true });
        console.log(`[RabbitMQ İşçisi] ${queueName} kuyruğu dinleniyor. Görevler bekleniyor... 👷‍♂️`);

        // Kuyruğu sürekli dinle
        channel.consume(queueName, (msg) => {
            if (msg !== null) {
                const data = JSON.parse(msg.content.toString());
                
                if (data.type === 'WELCOME_EMAIL') {
                    console.log(`\n=================================================`);
                    console.log(`📧 [MİKROSERVİS SİMÜLASYONU] MAİL GÖNDERİLDİ!`);
                    console.log(`Alıcı: ${data.email}`);
                    console.log(`Konu: ReadMe_Project Sistemine Hoş Geldin!`);
                    console.log(`İçerik: Merhaba ${data.name}, hesabın başarıyla oluşturuldu.`);
                    console.log(`=================================================\n`);
                }
                
                // Mesaj başarıyla işlendi, kuyruktan silebilirsin onayı veriyoruz
                channel.ack(msg); 
            }
        });
    } catch (error) {
        console.error('[RabbitMQ İşçisi] Bağlantı hatası:', error);
    }
}

startWorker();