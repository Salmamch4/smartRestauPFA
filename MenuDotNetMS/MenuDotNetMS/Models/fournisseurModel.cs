namespace MenuDotNetMS.Models
{
    public class fournisseurModel
    {
        public string id { get; set; } = string.Empty;
        public string? raison_social { get; set; }
        public string telephone { get; set; } = string.Empty;
        public string ice { get; set; } = string.Empty;
        public string? adresse { get; set; }
        public DateTime date_creation { get; set; }
    }
}
