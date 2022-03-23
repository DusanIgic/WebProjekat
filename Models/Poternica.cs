using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    [Table("Poternica")]
    public class Poternica
    {
        [Key]
        public int ID { get; set; }
        [MaxLength(50)]

        public bool Stroga {get; set;}
        public string JMBG {get;set;}
        public List<Drzava> ZabranjenUlazUDrzave{get;set;} //zabranjene ulaz u drzave

    }
}