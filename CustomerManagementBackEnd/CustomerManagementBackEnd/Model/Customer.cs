using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
//using System.ComponentModel.DataAnnotations.Schema;


namespace CustomerManagementBackEnd.Model
{
    public class Customer
    {
        [Key]
       // [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required,EmailAddress]
        public string Email {  get; set; }
        [Required]
        public string Phone { get; set; }
        public string Address { get; set; }
        public Decimal Balance { get; set; }
        public string Status { get; set; }
    }
}
