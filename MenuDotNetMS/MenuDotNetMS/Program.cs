using MenuDotNetMS.Repositories.achat;
using MenuDotNetMS.Repositories.article;
using MenuDotNetMS.Repositories.categorie;
using MenuDotNetMS.Repositories.fournisseur;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// 🔹 Controllers
builder.Services.AddControllers();

// 🔹 Repositories
builder.Services.AddScoped<IFournisseurRepository, fournisseurRepository>();
builder.Services.AddScoped<IAchatsRepository, AchatsRepository>();
builder.Services.AddScoped<IArticleRepository, ArticleRepository>();
builder.Services.AddScoped<ICategorieRepository, CategorieRepository>();

// 🔹 Scalar (بدل Swagger)
builder.Services.AddOpenApi();

// 🔥 CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();

// 🔹 Scalar UI
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();             // ✔ API docs
    app.MapScalarApiReference();  // ✔ Scalar UI
}

// 🔹 HTTPS

// 🔥 CORS (مهم بزاف)
app.UseCors("AllowAngular"); // ✔ نفس الاسم

app.UseAuthorization();

// 🔹 Controllers
app.MapControllers();

app.Run();