using Microsoft.AspNetCore.Identity;
using TodoApi.Models;

namespace TodoApi.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAdminUserAsync(UserManager<ApplicationUser> userManager)
    {
        const string adminEmail = "admin@todoapp.com";
        const string adminPassword = "Admin123!";

        var existing = await userManager.FindByEmailAsync(adminEmail);
        if (existing != null) return;

        var adminUser = new ApplicationUser
        {
            UserName = adminEmail,
            Email = adminEmail,
            FirstName = "Admin",
            LastName = "User",
            EmailConfirmed = true
        };

        await userManager.CreateAsync(adminUser, adminPassword);
    }
}