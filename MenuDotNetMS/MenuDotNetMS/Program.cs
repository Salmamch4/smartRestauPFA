using MenuDotNetMS.Repositories.achat;//
using MenuDotNetMS.Repositories.article;
using MenuDotNetMS.Repositories.categorie;
using MenuDotNetMS.Repositories.fournisseur;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddScoped<IFournisseurRepository, fournisseurRepository>();


builder.Services.AddOpenApi();//
builder.Services.AddScoped<IAchatsRepository, AchatsRepository>();//
builder.Services.AddScoped<IArticleRepository, ArticleRepository>();
builder.Services.AddScoped<ICategorieRepository, CategorieRepository>();
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

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();//
    app.MapScalarApiReference();//

}

app.UseHttpsRedirection();

app.UseCors("AllowAngular");

app.UseAuthorization();

app.MapControllers();

app.Run();