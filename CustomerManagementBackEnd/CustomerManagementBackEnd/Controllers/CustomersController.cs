using CustomerManagementBackEnd.Data;
using CustomerManagementBackEnd.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CustomerManagementBackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : Controller
    {
        
        private readonly AppDbContext _context;
        public CustomersController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetAll()
        {
            return await _context.Customers.OrderBy(c => c.Id).ToListAsync();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> Get(int id)
        {
            var customer=await _context.Customers.FindAsync(id);
            if (customer == null) return NotFound();
            return Ok(customer);
        }
        [HttpPost]
        public async Task<ActionResult<Customer>>Create(Customer customer)
        {
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            return Ok(customer);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Customer>> Edit(int id, Customer customer)
        {
            

            var existingCustomer = await _context.Customers.FindAsync(id);
            if (existingCustomer == null)
                return NotFound("Customer not found.");

            existingCustomer.Name = customer.Name;
            existingCustomer.Email = customer.Email;
            existingCustomer.Phone = customer.Phone;
            existingCustomer.Address = customer.Address;
            existingCustomer.Balance = customer.Balance;
            existingCustomer.Status = customer.Status;

            await _context.SaveChangesAsync();

            return Ok(existingCustomer);
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult>Delete(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return NotFound();
            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();
            return Ok(customer);
        }

    }
}
