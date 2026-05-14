// DTOs/stock/StockDeductionRequest.cs
namespace MenuDotNetMS.DTOs.stock
{
    public class StockDeductionRequest
    {
        public string ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
    }
}