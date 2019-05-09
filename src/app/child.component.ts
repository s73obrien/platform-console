import { Component, OnInit } from '@angular/core';
// import { readdir } from 'fs';

@Component({
  selector: 'app-child',
  template: '{{statement}}'
})
export class ChildComponent implements OnInit {
  statement = 'I am child component';
  files = [];
  constructor() {
  }

  ngOnInit() {
    // readdir(__dirname, (err, files) => this.files = files);
  }
}
