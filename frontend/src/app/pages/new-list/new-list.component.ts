import { Router } from "@angular/router";
import { TaskService } from "./../../task.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-new-list",
  templateUrl: "./new-list.component.html",
  styleUrls: ["./new-list.component.scss"],
})
export class NewListComponent implements OnInit {
  title: string;

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
  }

  createList() {
    this.taskService.createList(this.title).subscribe((response: any) => {
      if (response) {
        // Now we navigate to /lists/response._id
        this.router.navigate("/");
        this.title = "";
      }
    });
  }
}
