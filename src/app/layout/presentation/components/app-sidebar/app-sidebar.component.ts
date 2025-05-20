import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuItemComponent } from '../app-menu-item/app-menu-item.component';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, AppMenuItemComponent, RouterModule],
  template: `
    <div class="layout-sidebar">
      <ul class="layout-menu">
        <ng-container *ngFor="let item of menu(); let i = index">
          <li
            app-menuitem
            *ngIf="!item.separator"
            [item]="item"
            [index]="i"
            [root]="true"
          ></li>
          <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
      </ul>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSidebarComponent implements OnInit {
  menu = input.required<MenuItem[]>();

  ngOnInit() {
   
  }
}
