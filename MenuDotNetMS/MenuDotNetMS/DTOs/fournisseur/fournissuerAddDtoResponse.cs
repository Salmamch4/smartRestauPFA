using System.ComponentModel.DataAnnotations;

namespace MenuDotNetMS.DTOs.fournisseur
{
    public class fournissuerAddDtoResponse
    {
        public string Id { get; set; } = string.Empty;
        public string? RaisonSocial { get; set; }
        public string Telephone { get; set; } = string.Empty;
        public string ICE { get; set; } = string.Empty;
        public string? Adresse { get; set; }
        public DateTime DateCreation { get; set; }
    }
}
