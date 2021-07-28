import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { SimulatorV1Component } from './simulator-v1/simulator-v1.component';

const routes: Routes = [
    {
        path: 'simulator',
        component: SimulatorV1Component,
        data: {
            title: 'Simulator'
        }
    },
    {
        path: 'about',
        component: AboutComponent
    },
    // otherwise redirect to home
    {
        path: '**',
        redirectTo: 'simulator'
    }
    
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
