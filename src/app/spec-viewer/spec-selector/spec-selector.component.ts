// import { Component, OnInit } from '@angular/core';
import { Component, EventEmitter, Output, ElementRef  } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth/auth.service';
import * as firebase from 'firebase/app';
import constants from '../../../constants.js'

@Component({
  selector: 'app-spec-selector',
  templateUrl: './spec-selector.component.html',
  styleUrls: ['./spec-selector.component.css']
})


export class SpecSelectorComponent {

  selectedBoardUrl: string;
	selectedBoardKey: string;
  selectedBoardName: string;
  
  specs: FirebaseListObservable<any[]>;
	spec: Object;
	currentSpec: string;

  imagesRef: FirebaseListObservable<any[]>;
	images: object[] = new Array();
  imageData = new Map<string, object>();
  
  piecesRef: FirebaseListObservable<any[]>;
	pieces: object[] = new Array();
	piecesData = new Map<string, object>();

  @Output() onSelected = new EventEmitter<object>();
  @Output() onPiecesSet = new EventEmitter<Map<string, object>>();
  @Output() onInfo = new EventEmitter<Map<string, string>>();

  constructor(
    private auth: AuthService,
    public db: AngularFireDatabase) { 
      this.specs = db.list(constants.SPECS_PATH);
      // console.log(this.specs)

      if (this.auth.authenticated) {
        console.log('got here');
  
        this.specs = db.list(constants.SPECS_PATH);
  
        let p = new Promise((resolve, reject) => {
  
          this.imagesRef = db.list(constants.IMAGES_PATH, {
            query: {
              // orderByChild: 'isBoardImage',
              // equalTo: true,
            },
            preserveSnapshot: true
          });
  
          this.imagesRef.subscribe(snapshot => {
            console.log('creating image array');
            snapshot.forEach(data => {
              this.images.push(data.val());
              // this.imageData.set(data.key, {
              // 	'downloadURL': data.val().downloadURL,
              // 	'name': data.val().name
              // });
              // console.log(data.val())
              this.imageData.set(data.key, {
                'downloadURL': data.val().downloadURL,
                'name': data.val().name
              });
              // this.map.set(data.key, data.val().downloadURL)
              if (this.imageData.size === snapshot.length)
                resolve("Got images!");
              // console.log(data.key)
            })
          })
        });

        let q = new Promise((resolve, reject) => {
          
                  this.piecesRef = db.list(constants.ELEMENTS_PATH, {
                    query: {
                      // orderByChild: 'isBoardImage',
                      // equalTo: false,
                    },
                    preserveSnapshot: true
                  });
          
                  this.piecesRef.subscribe(snapshot => {
                    console.log('creating pieces array');
                    snapshot.forEach(data => {
                      this.pieces.push(data.val());
                      this.piecesData.set(data.key, {
                        'downloadURL': data.val().downloadURL,
                        'name': data.val().name,
                        // 'id': data.val().images[0]['imageId']
                        'id': data.val().images
                      });
                      if (this.piecesData.size === snapshot.length)
                        resolve("Got images!");
                      // console.log(data.key)
                    })
                  })
                  // console.log(this.pieces)
                });

      }

  }

  ngOnInit() {
  }

  onChange(value) {
    // console.log(this.imageData.keys())
    // console.log(this.images[0]['downloadURL'])
    // console.log(this.map)
    this.currentSpec = value;
    // console.log(this.currentSpec);

    this.db.object(constants.SPECS_PATH + '/' + value, {
      preserveSnapshot: true
    })
      .subscribe(snap => {
        this.spec = snap.val();
      });

    console.log(this.spec)
    // console.log(this.piecesData)
    console.log("sending board...")
    // console.log(board)
    
    let imageId = this.spec['board']['imageId']
    let pieces = this.spec['pieces']
		this.onSelected.emit(
			{
				'key': this.spec['board']['imageId'],
				'name': this.spec['gameName'],
				'url': this.imageData.get(imageId)['downloadURL']
			}
    );
    

    let piecesMap = new Map<string, object>()
    
    console.log(pieces)
    let count = 0
    pieces.forEach(element => {
      let id = this.piecesData.get(element["pieceElementId"])['id']
      let urlArr: string[] = new Array();
      this.piecesData.get(element["pieceElementId"])['id'].forEach(e => {
        urlArr.push(this.imageData.get(e['imageId'])['downloadURL'])
      });
      let piece = {
        "el_key": element["pieceElementId"],
        "url": urlArr,
        "xPos": element["initialState"]["x"],
        "yPos": element["initialState"]["y"],
        "zPos": element["initialState"]["zDepth"],
        "index": element["initialState"]["currentImageIndex"],
        "deckIndex": element["deckPieceIndex"]
      }
      // console.log(piece)
      piecesMap.set("piece" + count + "copy" + count + "", piece);
      count++
    });
    console.log(count)
    this.onPiecesSet.emit(piecesMap);

    let info = new Map<string, string>()
    info.set('name', this.spec['gameName'])
    info.set('youtube', this.spec['tutorialYoutubeVideo'])
    info.set('wiki', this.spec['wikipediaUrl'])
    info.set('uid', this.spec['uploaderUid'])

    this.onInfo.emit(info)

    // let imageId = this.spec['board']['imageId']
    // this.imageURL = this.imageData.get(imageId)['downloadURL']

    
    // console.log(this.map.get(this.spec['board']['imageId']))
    // console.log(this.imageURL)

  }

}
