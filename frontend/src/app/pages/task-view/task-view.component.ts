import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { List } from "./../../models/list.model";
import { Task } from "./../../models/task.model";
import { TaskService } from "./../../task.service";

@Component({
  selector: "app-task-view",
  templateUrl: "./task-view.component.html",
  styleUrls: ["./task-view.component.scss"],
})
export class TaskViewComponent implements OnInit {
  lists: List[];
  tasks: Task[];

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
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
}
