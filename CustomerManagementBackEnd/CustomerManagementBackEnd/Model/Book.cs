namespace CustomerManagementBackEnd.Model
{


    public class Book
    {
        public int BookId { get; set; }
        public string BookName { get; set; } = string.Empty;
        public string BookDetails { get; set; } = string.Empty;
        public string BookImg { get; set; } = string.Empty;
        public DateOnly PublishedDate { get; set; }
    }
}
