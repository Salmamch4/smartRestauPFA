using MenuDotNetMS.Models;
using System;
using System.Collections.Generic;

namespace MenuDotNetMS.Repositories.produit
{
    public interface IProduitRepository
    {
        IEnumerable<Produit> GetAll();
        Produit? GetById(Guid id);
        void Add(Produit produit);
        void Update(Produit produit);
        void Delete(Guid id);
    }
}