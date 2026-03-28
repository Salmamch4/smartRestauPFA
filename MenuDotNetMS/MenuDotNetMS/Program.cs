using MenuDotNetMS.Repositories.achat;//
using MenuDotNetMS.Repositories.article;
<<<<<<< HEAD
using MenuDotNetMS.Repositories.fournisseur;
=======

>>>>>>> 321485ffab7c0fed0c786ee255ebb2c92f1a53c0
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// 🔹 Controllers
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
<<<<<<< HEAD
builder.Services.AddOpenApi();

builder.Services.AddScoped<IFournisseurRepository, fournisseurRepository>();

builder.Services.AddScoped<IAchatsRepository, AchatsRepository>();
=======

builder.Services.AddOpenApi();//
builder.Services.AddScoped<IAchatsRepository, AchatsRepository>();//




>>>>>>> 321485ffab7c0fed0c786ee255ebb2c92f1a53c0
builder.Services.AddScoped<IArticleRepository, ArticleRepository>();

// 🔥🔥 CORS (هذا هو الحل)
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

// 🔹 Dev tools
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();//
    app.MapScalarApiReference();//

}

app.UseHttpsRedirection();

// 🔥 مهم بزاف (خاصو يكون هنا)
app.UseCors("AllowAngular");

app.UseAuthorization();

app.MapControllers();

app.Run();