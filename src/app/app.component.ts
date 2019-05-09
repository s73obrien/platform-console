import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '{{title}}<app-child></app-child>',
  styles: [':host {display: block;}']
})
export class AppComponent {
  title = 'custom-renderer';
}
