import { List } from "./../../models/list.model";
import { Router, ActivatedRoute } from "@angular/router";
import { TaskService } from "./../../task.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-new-list",
  templateUrl: "./new-list.component.html",
  styleUrls: ["./new-list.component.scss"],
})
export class NewListComponent implements OnInit {
  title: string;

  constructor(
    private taskService: TaskService,
    private router: Router,
  ) {}

  ngOnInit(): void {
  }

  createList() {
    this.taskService.createList(this.title).subscribe((list: List) => {
      if (list) {
        // Now we navigate to /lists/list._id
        this.router.navigate(["/lists", list._id]);
        this.title = "";
      }
    });
  }
}
