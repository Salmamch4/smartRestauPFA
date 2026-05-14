using MenuDotNetMS.DTOs.kafka;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Threading;
using System.Threading.Tasks;
namespace MenuDotNetMS.Services
{
    /*public class KafkaConsumerService : BackgroundService
    {
        private readonly ILogger<KafkaConsumerService> _logger;
        private readonly string _topic = "order-validation";
        private readonly string _bootstrapServers = "localhost:9092";

        public KafkaConsumerService(ILogger<KafkaConsumerService> logger)
        {
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var config = new ConsumerConfig
            {
                BootstrapServers = _bootstrapServers,
                GroupId = "menu-validation-group",
                AutoOffsetReset = AutoOffsetReset.Earliest
            };

            using var consumer = new ConsumerBuilder<Ignore, string>(config).Build();
            consumer.Subscribe(_topic);

            _logger.LogInformation("🚀 Kafka Consumer démarré - En attente de messages sur le topic: {Topic}", _topic);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var result = consumer.Consume(stoppingToken);
                    _logger.LogInformation(" Message reçu de Kafka: {Message}", result.Message.Value);

                    // Traiter le message
                    await ProcessOrder(result.Message.Value);

                    consumer.Commit(result);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Erreur lors du traitement du message Kafka");
                }
            }

            consumer.Close();
        }

        private async Task ProcessOrder(string message)
        {
            try
            {
                var order = JsonConvert.DeserializeObject<OrderValidationEvent>(message);
                _logger.LogInformation("📦 Traitement de la commande: {OrderNumber} pour client: {NomClient}",
                    order?.OrderNumber, order?.NomClient);

                // Ici tu ajouteras la logique de vérification des stocks
                // Vérifier chaque produit dans order.Items
                foreach (var item in order?.Items ?? new List<OrderItemEvent>())
                {
                    _logger.LogInformation("  - Produit: {ProduitLibelle}, Quantité: {Quantite}",
                        item.ProduitLibelle, item.Quantite);

                    // TODO: Vérifier le stock dans la base de données
                    // TODO: Vérifier les articles nécessaires pour ce produit
                }

                // TODO: Envoyer le résultat de validation
                // TODO: Envoyer une réponse à Kafka ou OrderService

                await Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors du traitement du message");
            }
        }
    }*/
}