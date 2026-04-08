using System.ComponentModel.DataAnnotations;

namespace MenuDotNetMS.models
{


    public class Article
    {
        public Guid Id { get; set; }

        public string Libelle { get; set; }

        public int QuantiteEnStock { get; set; }

        public int SeuilAlerte { get; set; }
        public string Unite { get; set; }


        public DateTime DateCreation { get; set; }
    }
}
