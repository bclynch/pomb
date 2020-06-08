import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Post } from '../../../models/Post.model';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: 'dashboardCard.component.html',
  styleUrls: ['./dashboardCard.component.scss']
})
export class DashboardCardComponent {
  @Input() data: Post;
  @Input() isActive: boolean;
  @Output() changeActive: EventEmitter<void> = new EventEmitter<void>();
  @Output() editPost: EventEmitter<void> = new EventEmitter<void>();
  @Output() deletePost: EventEmitter<void> = new EventEmitter<void>();
  @Output() previewPost: EventEmitter<void> = new EventEmitter<void>();

  constructor(

  ) { }

  selectActive() {
    this.changeActive.emit();
  }

  editItem() {
    this.editPost.emit();
  }

  deleteItem() {
    this.deletePost.emit();
  }

  previewItem() {
    this.previewPost.emit();
  }
}
