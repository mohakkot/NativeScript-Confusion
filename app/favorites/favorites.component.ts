import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FavoriteService } from '../services/favorite.service';
import { Dish } from '../shared/dish';
import { View } from 'ui/core/view';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { ListViewEventData,  RadListView } from 'nativescript-telerik-ui/listview';
import { RadListViewComponent } from 'nativescript-telerik-ui/listview/angular';
import { DrawerPage } from '../shared/drawer/drawer.page';
import { Toasty } from 'nativescript-toasty';
import { confirm } from 'ui/dialogs';

@Component ({
    selector: 'app-favorite',
    moduleId: module.id,
    templateUrl: './favorites.component.html',
    styleUrls: [ './favorites.component.css']
})

export class FavoritesComponent extends DrawerPage implements OnInit {
    
    favorites: ObservableArray<Dish>;
    errMess: string;

    @ViewChild('myListView') listViewComponent: RadListViewComponent;

    constructor(private favoriteservice: FavoriteService,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject('BaseURL') private BaseURL) {
        super(changeDetectorRef);
    }

    ngOnInit() {
        this.favoriteservice.getFavorites()
            .subscribe(favorite => this.favorites = new ObservableArray(favorite),
        errmess => this.errMess = errmess);
    }

    deleteFavorite(id: number) {
        console.log('delete ' + id);

        let options = {
            title: "Confirm Delete",
            message: "Do you want to Delete Dish " + id,
            okButtonText: 'YES',
            cancelButtonText: "NO",
            neutralButtonText: 'Cancel'
        }

        confirm(options).then((result:boolean) => {
            if(result) {
                this.favorites = null;
                this.favoriteservice.deleteFavorite(id)
                    .subscribe(favorite => {
                        const toast = new Toasty('Deleted Dish ' + id, 'short', 'bottom');
                        toast.show();
                        this.favorites = new ObservableArray(favorite);
                    },
                errmess =>  this.errMess = errmess);
            }
            else {
                console.log('Deletion Cancelled');
            }
        });
    }

    public onCellSwiping(args: ListViewEventData){
        var swipeLimits = args.data.swipeLimits;
        var currentItemView = args.object;
        var currentView;

        if(args.data.x > 200) {

        }
        else if(args.data.x < -200){

        }
    }

    public onSwipeCellStarted(args: ListViewEventData){
        var swipeLimits = args.data.swipeLimits;
        var swipeView = args['object'];

        var leftItem = swipeView.getViewById<View>('mark-view');
        var rightItem = swipeView.getViewById<View>('delete-view');
        swipeLimits.left = leftItem.getMeasuredWidth();
        swipeLimits.right = rightItem.getMeasuredWidth();
        swipeLimits.threshold = leftItem.getMeasuredWidth()/2;
    }

    public onSwipeCellFinished(args: ListViewEventData) {
        
    }

    public onLeftSwipeClick(args: ListViewEventData) {
        console.log('Left swipe click');
        this.listViewComponent.listView.notifySwipeToExecuteFinished();
    }

    public onRightSwipeClick(args: ListViewEventData) {
        this.deleteFavorite(args.object.bindingContext.id);
        this.listViewComponent.listView.notifySwipeToExecuteFinished();
    }
}