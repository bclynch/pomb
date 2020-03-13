import { Component, Input } from '@angular/core';

import { Post } from '../../models/Post.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './postList.component.html',
  styleUrls: ['./postList.component.scss']
})
export class PostListComponent {
  @Input() data: Post[];
  @Input() displayDescription = false;

  constructor(
    public userService: UserService
  ) { }

}
