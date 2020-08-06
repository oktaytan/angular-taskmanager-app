import { List } from './../../models/list.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TaskService } from './../../task.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.scss'],
})
export class EditListComponent implements OnInit {
  title: string;
  selectedListId: string;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.params.listId) {
      this.route.params.subscribe((params: Params) => {
        this.selectedListId = params.listId;
        this.taskService
          .getListById(this.selectedListId)
          .subscribe((list: List) => {
            this.title = list.title;
          });
      });
    }
  }

  editList() {
    this.taskService.editList(this.selectedListId, this.title).subscribe(() => {
      // Now we navigate to /lists/list._id
      this.router.navigate(['/lists', this.selectedListId]);
      this.title = '';
    });
  }
}
