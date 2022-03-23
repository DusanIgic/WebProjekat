using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    [Table("Drzava")]
    public class Drzava
    {
        [Key]
        public int ID { get; set; }
        [MaxLength(40)]
        public string Naziv{get;set;}

        public List<Dokument> PodrzaniDokumenti {get;set;} //lista dokumenata koji su dozvoljeni da udju u konkretnu drzavu
        
        public List<Poternica> TrazeniLjudi{get;set;} //lista ljudi koji ne smeju da udju
        
    }
    
}