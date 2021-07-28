import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanvasViewerComponent } from './canvas-viewer/canvas-viewer.component';
import { ConfigDashboardComponent } from './config-dashboard/config-dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './shared/modules/material.module';
import { ChartComponent } from './chart/chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SimulatorV1Component } from './simulator-v1/simulator-v1.component';
import { AboutComponent } from './about/about.component';
import { StatisticWatcherComponent } from './statistic-watcher/statistic-watcher.component';
import { DialogHelpComponent } from './dialog-help/dialog-help.component';
import { SnackbarMessageComponent } from './shared/component/snackbar-message/snackbar-message.component';


@NgModule({
    declarations: [
        AppComponent,
        CanvasViewerComponent,
        ConfigDashboardComponent,
        ChartComponent,
        SimulatorV1Component,
        AboutComponent,
        StatisticWatcherComponent,
        DialogHelpComponent,
        SnackbarMessageComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        MaterialModule,
        NgxChartsModule,
        BrowserAnimationsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
