import { Task } from "./../../models/task.model";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { TaskService } from "./../../task.service";

@Component({
  selector: "app-new-task",
  templateUrl: "./new-task.component.html",
  styleUrls: ["./new-task.component.scss"],
})
export class NewTaskComponent implements OnInit {
  title: string;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {}

  createTask() {
    this.taskService.createTask(this.title, this.route.snapshot.params.listId)
      .subscribe((task: Task) => {
        if (task) {
          // Now we navigate to /lists/list._id
          this.router.navigate(["/lists", this.route.snapshot.params.listId]);
          this.title = "";
        }
      });
  }
}
