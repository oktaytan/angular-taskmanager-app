import { Task } from './../../models/task.model';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TaskService } from './../../task.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss'],
})
export class EditTaskComponent implements OnInit {
  title: string;
  taskId: string;
  listId: string;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.params.listId) {
      this.route.params.subscribe((params: Params) => {
        this.taskId = params.taskId;
        this.listId = params.listId;
        this.taskService
          .getTaskById(this.listId, this.taskId)
          .subscribe((task: Task) => {
            this.title = task.title;
          });
      });
    }
  }

  editTask() {
    this.taskService
      .editTask(this.listId, this.taskId, this.title)
      .subscribe((task: Task) => {
        // Now we navigate to /lists/:listId
        this.router.navigate(['/lists', this.listId]);
        this.title = '';
      });
  }
}
