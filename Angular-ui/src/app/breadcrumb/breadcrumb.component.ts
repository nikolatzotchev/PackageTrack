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
    this.activatedRoute.snapshot.url.forEach(m => console.log(m.path));
    if (this.router.url === '/devices-display') {
      this.breadcrumb.push({label: 'Devices'});
    } else {
      this.breadcrumb.push({label: 'Devices', routerLink: '/devices-display'});
    }
  }

}
