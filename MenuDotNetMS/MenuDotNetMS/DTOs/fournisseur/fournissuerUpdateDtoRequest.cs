using System.ComponentModel.DataAnnotations;

namespace MenuDotNetMS.DTOs.fournisseur
{
    public class fournissuerUpdateDtoRequest
    {
        [Required]
        public string Id { get; set; } = string.Empty;

        [StringLength(20)]
        public string? RaisonSocial { get; set; }

        [Required]
        [StringLength(10, MinimumLength = 10)]
        [RegularExpression(@"^[0-9]*$")]
        public string Telephone { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string ICE { get; set; } = string.Empty;

        [StringLength(200)]
        public string? Adresse { get; set; }
    }
}
