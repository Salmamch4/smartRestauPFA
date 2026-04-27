using MenuDotNetMS.Repositories.achat;
using MenuDotNetMS.Repositories.article;
using MenuDotNetMS.Repositories.categorie;
using MenuDotNetMS.Repositories.fournisseur;

using MenuDotNetMS.Services;

using MenuDotNetMS.Repositories.produit;

using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Configuration des Services
builder.Services.AddControllers();
//builder.Services.AddHostedService<KafkaConsumerService>();

// Injection des Repositories
builder.Services.AddScoped<IFournisseurRepository, fournisseurRepository>();
builder.Services.AddScoped<IAchatsRepository, AchatsRepository>();
builder.Services.AddScoped<IArticleRepository, ArticleRepository>();
builder.Services.AddScoped<ICategorieRepository, CategorieRepository>();
builder.Services.AddScoped<IProduitRepository, ProduitRepository>();

builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Création du dossier images s'il n'existe pas
var webRootPath = app.Environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
if (!Directory.Exists(Path.Combine(webRootPath, "images")))
{
    Directory.CreateDirectory(Path.Combine(webRootPath, "images"));
}

app.UseCors("AllowAngular");

// IMPORTANT : Pour afficher les photos dans Angular
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseAuthorization();
app.MapControllers();

app.Run();