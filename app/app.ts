import {Component} from '@angular/core';
import {Platform, ionicBootstrap, Storage, SqlStorage} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';


@Component({
    templateUrl: 'build/app.html'
})
export class MyApp {

    private rootPage: any;
    private storage: any;

    constructor(private platform: Platform) {
        this.rootPage = HomePage;

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();

            let options = {
                name: 'todo.db',
                iosDatabaseLocation: 'default'
            }
            this.storage = new Storage(SqlStorage, options);
            this.storage.query('CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, done TEXT)').then((data) => {
                console.log("TABLE CREATED -> " + JSON.stringify(data.res));
            }, (error) => {
                console.log("ERROR -> " + JSON.stringify(error.err));
            });
        });
    }
}

ionicBootstrap(MyApp);
