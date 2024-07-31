using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RealTimeTasks.Data
{
    public class TaskRepository
    {
        private readonly string _connectionString;

        public TaskRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public void AddTask(TaskItem task)
        {
            using var context = new RealTimeTasksDataContext(_connectionString);
            context.TaskItems.Add(task);
            context.SaveChanges();
        }

        public List<TaskItem> GetIncompleteTasks()
        {
            using var context = new RealTimeTasksDataContext(_connectionString);
            return context.TaskItems.Include(t => t.User).Where(t => !t.IsCompleted).ToList();
        }

        public void MarkTaskCompleted(int taskId)
        {
            using var context = new RealTimeTasksDataContext(_connectionString);
            context.Database.ExecuteSqlInterpolated($"UPDATE TaskItems SET IsCompleted = 1 WHERE Id = {taskId}");
        }

        public void AssignTaskOwner(int taskId, int userId)
        {
            using var context = new RealTimeTasksDataContext(_connectionString);
            context.Database.ExecuteSqlInterpolated($"UPDATE TaskItems SET TaskOwner = {userId} WHERE Id = {taskId}");
        }
    }
}
