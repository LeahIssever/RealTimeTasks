using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RealTimeTasks.Data
{
    public class UserRepository
    {
        private readonly string _connectionString;

        public UserRepository(string connectionString)
        {
            _connectionString = connectionString;
        }
        public void AddUser(User user, string password)
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
            using var context = new RealTimeTasksDataContext(_connectionString);
            context.Users.Add(user);
            context.SaveChanges();
        }

        public User Login(string email, string password)
        {
            var user = GetUserByEmail(email);
            if (user == null)
            {
                return null;
            }
            var passwordVerified = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            if (!passwordVerified)
            {
                return null;
            }
            return user;
        }

        public User GetUserByEmail(string email)
        {
            using var context = new RealTimeTasksDataContext(_connectionString);
            return context.Users.FirstOrDefault(u => u.Email == email);
        }

        public bool EmailExists(string email)
        {
            using var context = new RealTimeTasksDataContext(_connectionString);
            return context.Users.Any(u => u.Email == email);
        }
    }
}
