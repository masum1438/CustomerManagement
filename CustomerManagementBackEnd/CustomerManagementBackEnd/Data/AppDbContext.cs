using CustomerManagementBackEnd.Model;
using Microsoft.EntityFrameworkCore;

namespace CustomerManagementBackEnd.Data
{
    public class AppDbContext:DbContext
    {
     public AppDbContext(DbContextOptions<AppDbContext> options): base(options) { }
     public DbSet<Customer>Customers { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Customer>()
                .Property(c => c.Id).UseIdentityAlwaysColumn(); // Auto-increment in PostgreSQL
        }
    }
}
