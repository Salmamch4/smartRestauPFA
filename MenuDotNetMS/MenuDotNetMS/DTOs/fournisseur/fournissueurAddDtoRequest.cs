using System.ComponentModel.DataAnnotations;

namespace MenuDotNetMS.DTOs.fournisseur
{
    public class fournissueurAddDtoRequest
    {
        [StringLength(20)]
        public string? RaisonSocial { get; set; }

        [Required]
        [StringLength(10, MinimumLength = 10)]
        public string Telephone { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string ICE { get; set; } = string.Empty;

        [StringLength(200)]
        public string? Adresse { get; set; }
    }
}
