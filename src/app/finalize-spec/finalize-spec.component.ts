import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-finalize-spec',
  templateUrl: './finalize-spec.component.html',
  styleUrls: ['./finalize-spec.component.css']
})
export class FinalizeSpecComponent{
	@Input() selectedBoard: object;
	@Input() pieces: object[];

  constructor() { }

}
