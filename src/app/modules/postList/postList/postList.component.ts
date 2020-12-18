import { Component, Input } from '@angular/core';

import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './postList.component.html',
  styleUrls: ['./postList.component.scss']
})
export class PostListComponent {
  @Input() data;
  @Input() displayDescription = false;

  constructor(
    public userService: UserService
  ) { }

}
