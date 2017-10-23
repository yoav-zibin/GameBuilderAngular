import { 
	Component,
	ElementRef,
	Input,
	Output,
	HostListener,
	EventEmitter
} from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import constants from '../../constants.js'

@Component({
  selector: 'app-build-spec',
  templateUrl: './build-spec.component.html',
  styleUrls: ['./build-spec.component.css']
})
export class BuildSpecComponent{
	@Input() selectedBoard: object;
	@Output() onPiecesSet2 = new EventEmitter<object>();
	images: FirebaseListObservable<any[]>;

  constructor(
		public afAuth: AngularFireAuth, 
		public db: AngularFireDatabase,
		private el: ElementRef
	) {
		this.images = db.list(constants.IMAGES_PATH, {
			query: {
				orderByChild: 'isBoardImage',
				equalTo: false,
			}
		});

	}

	onPiecesSet(piece: object) {
		let img_key = piece['img_key'];
		let matched = false;

		this.db.list(constants.ELEMENTS_PATH, { preserveSnapshot: true})
		  .subscribe(snapshots => {
		    snapshots.forEach(snapshot => {
		      let data = snapshot.val();
		      for(let image of data['images']) {
	            if(image['imageId']=== img_key && !matched) {
	              matched = true;
	              console.log('found match');
		          piece['el_key'] = snapshot.key;
		          this.onPiecesSet2.emit(piece);
		        }
		      }
		    });
    	})
  	}

}
