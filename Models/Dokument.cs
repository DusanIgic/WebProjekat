using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;

namespace Models
{
    public enum TipDokumenta
    {
        Licna,
        Pasos,
        Viza

    }
    [Table("Dokument")]
    public class Dokument
    {
        [Key]
        public int ID { get; set; }
        public TipDokumenta Tip{get;set;}

        public DateTime DatumIzdavanja {get;set;} //starost dokumenta izrazena u mesecima
        
        public int Drzavljanstvo {get; set;}
    
        public List<Drzava> PodrzaneDrzave{get;set;}//za koje drzave vazi
    }
}