import { Component, OnInit, Inject , ViewContainerRef} from "@angular/core";
import { Dish } from "../Shared/Dish";
import { DishService } from '../services/dish.service';
import { Toasty } from "nativescript-toasty";
import { FavoriteService } from "../services/favorite.service"; 
import { TNSFontIconService } from "nativescript-ngx-fonticon";
import { Comment } from '../shared/comment';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';
import { CommentComponent } from '../comment/comment.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { action } from 'ui/dialogs';
import { Page } from 'ui/page';
import { View } from 'ui/core/view';
import { SwipeGestureEventData, SwipeDirection } from 'ui/gestures';
import { Animation, AnimationDefinition } from 'ui/animation';
import * as enums from 'ui/enums';
import { Color } from 'color';

@Component({
    selector: 'app-dishdetail',
    moduleId: module.id,
    templateUrl: './dishdetail.component.html'
})

export class DishdetailComponent implements OnInit {

    dish: Dish;
    comment: Comment;
    errMess: string;
    favorite: boolean = false;
    numcomment: number;
    avgstars: string;
    showComments : boolean= false;

    cardImage: View;
    commentList: View;
    cardLayout: View;

    constructor(private dishservice: DishService, private route: ActivatedRoute,
    private routerExtensions: RouterExtensions, private fonticon:TNSFontIconService,
    private vcRef: ViewContainerRef, private modalService: ModalDialogService,
    private favoriteservice: FavoriteService, private page: Page,
    @Inject('BaseURL') private BaseURL){ 

    }

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => this.dishservice.getDish(+params['id']))
            .subscribe(dish=> {
                this.dish = dish, 
                this.favorite = this.favoriteservice.isFavorite(this.dish.id);
                this.numcomment = this.dish.comments.length;
                let total = 0;
                this.dish.comments.forEach(comment => total += comment.rating);
                this.avgstars = (total/this.numcomment).toFixed(2);
            },
            errmess=> {this.dish=null; this.errMess = <any>errmess; });
    }

    addToFavorites(){
        if(!this.favorite){
            console.log("Adding to Favorite :" + this.dish.id);
            this.favorite = this.favoriteservice.addFavorite(this.dish.id);
            const toast = new Toasty("Added Dish " + this.dish.id + " to Favorite");
            toast.show();
        }
    }

    goBack(): void {
        this.routerExtensions.back();
    }
    
    actionOptions() {

        let options = {
            title: "More Options",
            message: "Choose an Option " ,
            cancelButtonText: "Cancel",
            actions: ["Add To Favorites", "Add Comments"]
        }

        action(options).then((result) => {
            if(result === "Add To Favorites") {
                this.addToFavorites();
            }
            else if(result === "Add Comments"){
                this.createModalView();
            }
            else{
                console.log('No Action Taken');
            }
        });
    }
   
    
    createModalView(){
        
        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            fullscreen: false
        };

        this.modalService.showModal(CommentComponent, options)
        .then((result: any) =>{
            this.dish.comments.push(result);
            this.dish.comments.forEach(comment => console.log(JSON.stringify(comment)));
            const toast = new Toasty('Thanks for the feedback');
            toast.show();
            });             
    }


    onSwipe(args: SwipeGestureEventData){
        if(this.dish){
            this.cardImage = <View>this.page.getViewById<View>("cardImage");
            this.cardLayout = <View>this.page.getViewById<View>("cardLayout");
            this.commentList = <View>this.page.getViewById<View>("commentList");
            
            if (args.direction === SwipeDirection.up && !this.showComments ) {
                this.animateUp();
              }
            else if (args.direction === SwipeDirection.down && this.showComments ) {
                this.showComments = false;
                this.animateDown();
            }    
        }
    }


    showAndHideComments(){
        this.cardImage = <View>this.page.getViewById<View>("cardImage");
        this.cardLayout = <View>this.page.getViewById<View>("cardLayout");
        this.commentList = <View>this.page.getViewById<View>("commentList");
        
        if (!this.showComments ) {
            this.animateUp();
        }
        else if (this.showComments ) {
        this.showComments = false;
        this.animateDown();
        }
    }

    animateUp(){
        let definitions = new Array<AnimationDefinition>();
        let a1: AnimationDefinition = {
            target: this.cardImage,
            scale: { x:1, y: 0 },
            translate: { x:0, y: -200 },
            opacity: 0,
            duration: 500,
            curve: enums.AnimationCurve.easeIn
        };
        definitions.push(a1);
        let a2: AnimationDefinition = {
            target: this.cardLayout,
            backgroundColor: new Color("#ffc107"),
            duration: 500,
            curve: enums.AnimationCurve.easeIn
        };
        definitions.push(a2);
        let animationSet = new Animation(definitions)
        animationSet.play().then(() => {
            this.showComments=true;
        })
        .catch((e)=> {
            console.log(e.message);
        });

    }


    animateDown() {
        let definitions = new Array<AnimationDefinition>();
        let a1: AnimationDefinition = {
            target: this.cardImage,
            scale: { x: 1, y: 1 },
            translate: { x: 0, y: 0 },
            opacity: 1,
            duration: 500,
            curve: enums.AnimationCurve.easeIn
        };
        definitions.push(a1);
    
        let a2: AnimationDefinition = {
            target: this.cardLayout,
            backgroundColor: new Color("#ffffff"),
            duration: 500,
            curve: enums.AnimationCurve.easeIn
        };
        definitions.push(a2);
    
        let animationSet = new Animation(definitions);
    
        animationSet.play().then(() => {
        })
        .catch((e) => {
            console.log(e.message);
        });
       
    }
}