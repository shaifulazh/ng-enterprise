import { Routes } from "@angular/router";
import { ProfileComponent } from "./components/profile.component";

export const profileRoutes: Routes = [
  {
    path: '',
    providers: [

    ],
    component: ProfileComponent,
    title: 'Profile',
  },
];
