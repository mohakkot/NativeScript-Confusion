import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { CouchbaseService } from '../services/couchbase.service';
import 'rxjs/add/operator/map';
import * as LocalNotifications from 'nativescript-local-notifications';

@Injectable()
export class FavoriteService{

    favorites: Array<number>;
    docId: string = "favorites";

    constructor(private dishservice: DishService,
    private couchbaseservice: CouchbaseService){
        this.favorites = [];

        let doc = this.couchbaseservice.getDocument(this.docId);
        if (doc==null){
            this.couchbaseservice.createDocument({"favorite":[]}, this.docId);
        }
        else{
            this.favorites = doc.favorites;
        }
    }

    isFavorite(id: number) {
        return this.favorites.some(el => el === id);
    }

    addFavorite(id: number) {
        if(!this.isFavorite(id)){
            this.favorites.push(id);
            this.couchbaseservice.updateDocument(this.docId, {"favorites":this.favorites});
            LocalNotifications.schedule([{
                id: id,
                title: "ConFusion Favorites",
                body: "Dish " + id + " Added Successfully"
            }])
            .then(()=> console.log("Dish added successfully"),
        (error)=> console.log("Error showing Notifications" + error ));
        }
        return true;
    }

    getFavorites(): Observable<Dish[]>{
        return this.dishservice.getDishes()
        .map(dishes => dishes.filter(dish => this.favorites.some(el => el===dish.id)));
    }

    deleteFavorite(id: number): Observable<Dish[]>{
        let index = this.favorites.indexOf(id);
        if (index >=0 ){
            this.favorites.splice(index, 1);
            this.couchbaseservice.updateDocument(this.docId, {"favorites":this.favorites});
            return this.getFavorites();
        }
        else{
            return Observable.throw("Deleting non-existant Favorite");
        }
    }
}