import { Component, inject, OnInit } from '@angular/core';
import { LoadingService } from '@core/services/loading.service';

@Component({
    selector: 'app-profile',
    templateUrl: 'profile.component.html'
})

export class ProfileComponent implements OnInit {
    private loading = inject(LoadingService);
    test() {
        console.log("test")
        this.loading.show()

        setTimeout(() => {
            console.log('Triggered after 2 seconds');
            // your logic here
            this.loading.hide()
        }, 10000);
    }
    ngOnInit() { }
}

