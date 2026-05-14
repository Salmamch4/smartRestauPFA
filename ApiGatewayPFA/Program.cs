using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ============================================================
// 1. Configuration Ocelot
// ============================================================
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);
builder.Services.AddOcelot(builder.Configuration);

// ============================================================
// 2. Configuration JWT (même clé que Laravel)
// ============================================================
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"] ?? "PR37v8XGht4M3wBzstK614kIYlDSPJJjdhtDnBAaGaSYfs85GjhLk524iUe7fYRM");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(secretKey),
            ClockSkew = TimeSpan.Zero
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
                if (!string.IsNullOrEmpty(token))
                {
                    context.Token = token;
                    Console.WriteLine($"? Token reçu: {token[..Math.Min(50, token.Length)]}...");
                }
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                var claims = context.Principal?.Claims;
                var userId = claims?.FirstOrDefault(c => c.Type == "id" || c.Type == "sub")?.Value;
                var role = claims?.FirstOrDefault(c => c.Type == "role")?.Value;

                Console.WriteLine($"? Utilisateur authentifié: ID={userId}, Rôle={role}");

                if (!string.IsNullOrEmpty(userId))
                {
                    context.Request.Headers.Add("X-User-Id", userId);
                    context.Request.Headers.Add("X-User-Role", role ?? "");
                }

                return Task.CompletedTask;
            },
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"? Authentification échouée: {context.Exception.Message}");
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// ============================================================
// 3. Configuration CORS
// ============================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// ============================================================
// 4. Services additionnels
// ============================================================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ============================================================
// Middleware Pipeline
// ============================================================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware pour logger les requêtes
app.Use(async (context, next) =>
{
    Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] ?? {context.Request.Method} {context.Request.Path}");
    await next();
    Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] ?? Status: {context.Response.StatusCode}");
});

app.UseCors("AllowAngular");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// ============================================================
// 5. Démarrer Ocelot
// ============================================================
await app.UseOcelot();

Console.WriteLine("?? API Gateway démarré sur http://localhost:5000");
Console.WriteLine("?? Swagger: http://localhost:5000/swagger");

app.Run();