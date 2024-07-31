using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using RealTimeTasks.Data;
using RealTimeTasks.Web.ViewModels;

namespace RealTimeTasks.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly string _connectionString;
        private readonly IHubContext<TasksHub> _hub;

        public TasksController(IConfiguration configuration, IHubContext<TasksHub> hub)
        {
            _connectionString = configuration.GetConnectionString("ConStr");
            _hub = hub;
        }

        [HttpGet("getincomplete")]
        public List<TaskItem> GetIncompleteTasks()
        {
            var repo = new TaskRepository(_connectionString);
            return repo.GetIncompleteTasks();
        }

        [HttpPost("addtask")]
        public void AddTask(AddTaskViewModel vm)
        {
            var repo = new TaskRepository(_connectionString);
            var task = new TaskItem
            {
                Title = vm.Title,
                IsCompleted = false,
            };
            repo.AddTask(task);

            _hub.Clients.All.SendAsync("newTaskAdded", task);
        }

        [HttpPost("markCompleted")]
        public void MarkTaskCompleted(TaskItem task)
        {
            var repo = new TaskRepository(_connectionString);
            repo.MarkTaskCompleted(task.Id);

            SendTasks(repo.GetIncompleteTasks());
        }

        [HttpPost("assigntask")]
        public void AssignTask(AssignTaskViewModel vm)
        {
            var user = GetCurrentUser();
            var repo = new TaskRepository(_connectionString);
            repo.AssignTaskOwner(vm.TaskId, user.Id);
            SendTasks(repo.GetIncompleteTasks());
            //_hub.Clients.All.SendAsync("taskAssigned", user);
        }

        [HttpGet("getcurrentuser")]
        public User GetCurrentUser()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return null;
            }
            var repo = new UserRepository(_connectionString);
            return repo.GetUserByEmail(User.Identity.Name);
        }

        private void SendTasks(List<TaskItem> tasks)
        {
            _hub.Clients.All.SendAsync("reloadTasks", tasks);
        }
    }
}
