import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/primeng';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  home: MenuItem = {icon: 'fa fa-home'};
  breadcrumb: MenuItem[] = [];

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    const path = this.activatedRoute.snapshot.url;
    if (path[0].path === 'devices-display') {
      this.breadcrumb.push({label: 'Devices'});
    }
    if (path[0].path === 'device-info') {
      this.breadcrumb.push(
        {label: 'Devices', routerLink: '/devices-display'},
        {label: path[1].path},
        {label: 'Info'}
      );
    }
  }
}
