using Microsoft.EntityFrameworkCore;

namespace Models
{
    public class TravelContext : DbContext
    {
        public DbSet<Drzava> Drzave { get; set; }
        public DbSet<Dokument> Dokumenti { get; set; }
        public DbSet<Poternica> Poternice { get; set; }
        public TravelContext(DbContextOptions options) : base(options)
        {

        }
    }
}