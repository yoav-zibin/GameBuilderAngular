import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-build-spec',
  templateUrl: './build-spec.component.html',
  styleUrls: ['./build-spec.component.css']
})
export class BuildSpecComponent implements OnInit {
	@Input() selectedBoard: string;

  constructor() { }

  ngOnInit() {
  }


}
