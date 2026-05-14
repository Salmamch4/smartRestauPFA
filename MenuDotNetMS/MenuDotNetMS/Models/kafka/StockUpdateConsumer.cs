
using MenuDotNetMS.Models.Kafka;
using MenuDotNetMS.Repositories.article;
using Newtonsoft.Json;
using Microsoft.Extensions.Hosting;

namespace MenuDotNetMS.Consumers
{/*
    public class StockUpdateConsumer : BackgroundService
    {
        private readonly IConsumer<string, string> _consumer;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<StockUpdateConsumer> _logger;
        private readonly string _topic = "stock-updates";

        public StockUpdateConsumer(IConfiguration config, IServiceProvider serviceProvider, ILogger<StockUpdateConsumer> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;

            var consumerConfig = new ConsumerConfig
            {
                BootstrapServers = config["Kafka:BootstrapServers"] ?? "localhost:9092",
                GroupId = "menu-stock-group",
                AutoOffsetReset = AutoOffsetReset.Earliest,
                EnableAutoCommit = false
            };

            _consumer = new ConsumerBuilder<string, string>(consumerConfig).Build();
            _consumer.Subscribe(_topic);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var consumeResult = _consumer.Consume(stoppingToken);

                    if (consumeResult != null)
                    {
                        await ProcessStockUpdate(consumeResult.Message.Value);
                        _consumer.Commit(consumeResult);
                    }

                    await Task.Delay(100, stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Erreur Kafka: {ex.Message}");
                    await Task.Delay(1000, stoppingToken);
                }
            }
        }

        private async Task ProcessStockUpdate(string message)
        {
            using var scope = _serviceProvider.CreateScope();
            var articleRepository = scope.ServiceProvider.GetRequiredService<IArticleRepository>();

            var stockEvent = JsonConvert.DeserializeObject<StockUpdateEvent>(message);

            if (stockEvent != null && stockEvent.Items != null)
            {
                _logger.LogInformation($"Reçu commande {stockEvent.OrderNumber} - {stockEvent.Items.Count} articles");

                foreach (var item in stockEvent.Items)
                {
                    if (item.ProductId != null)
                    {
                        var article = articleRepository.GetById(Guid.Parse(item.ProductId));
                        if (article != null)
                        {
                            article.QuantiteEnStock -= item.Quantity;
                            if (article.QuantiteEnStock < 0) article.QuantiteEnStock = 0;
                            articleRepository.Update(article);

                            _logger.LogInformation($"Stock mis à jour: {article.Libelle} = {article.QuantiteEnStock}");
                        }
                    }
                }

                _logger.LogInformation($"Mise à jour stock terminée pour commande {stockEvent.OrderNumber}");
            }
        }

        public override void Dispose()
        {
            _consumer?.Close();
            _consumer?.Dispose();
            base.Dispose();
        }
    }*/
}