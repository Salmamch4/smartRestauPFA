using MenuDotNetMS.Repositories.achat;//
using MenuDotNetMS.Repositories.article;

using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// 🔹 Controllers
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

builder.Services.AddOpenApi();//
builder.Services.AddScoped<IAchatsRepository, AchatsRepository>();//




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