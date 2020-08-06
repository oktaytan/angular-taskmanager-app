import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { List } from './../../models/list.model';
import { Task } from './../../models/task.model';
import { TaskService } from './../../task.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
})
export class TaskViewComponent implements OnInit {
  lists: List[];
  tasks: Task[];
  selectedListId: string;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllTasks();

    this.taskService.getLists().subscribe((lists: List[]) => {
      this.lists = lists;
    });
  }

  getAllTasks() {
    if (this.route.snapshot.params.listId) {
      this.route.params.subscribe((params: Params) => {
        this.selectedListId = params.listId;
        this.taskService.getTasks(params.listId).subscribe((tasks: Task[]) => {
          this.tasks = tasks;
        });
      });
    }
  }

  onTaskClick(task: Task) {
    // We want to set the task to completed
    this.taskService.complete(task).subscribe(() => {
      task.completed = !task.completed;
    });
  }

  onDeleteLists() {
    this.taskService.deleteList(this.selectedListId).subscribe((res: any) => {
      if (res) {
        this.router.navigate(['lists']);
      }
    });
  }

  onTaskDelete(taskId: string) {
    this.taskService
      .deleteTask(this.selectedListId, taskId)
      .subscribe((res: any) => {
        if (res) {
          this.tasks = this.tasks.filter((task) => task._id !== taskId);
        }
      });
  }
}
