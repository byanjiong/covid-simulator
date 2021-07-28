import { CdkStep } from "@angular/cdk/stepper";
import { Injectable } from "@angular/core";
import { Person } from "../models/person.model";
import { regionColorPicker, SymbolColor } from "../models/symbol.model";
import { ConfigService } from "./config.service";
import { DrawService } from "./draw.service";



@Injectable({
    providedIn: 'root'
})
export class RegionService {
    constructor(
        private cfg: ConfigService,
        private ds: DrawService
    ) {}


    

    region:number[][] = [];

    init(ctx: CanvasRenderingContext2D) {
        this.drawBaseGrid(ctx);
        this.regionSet(ctx);
    }



    regionSet(ctx: CanvasRenderingContext2D) {
        this.region = new Array(this.cfg.row).fill(0).map(() => new Array(this.cfg.column).fill(0));

        // 12   123   1122   1122
        //            3344   3344
        //                   5555
        //

        const xIdxMax = this.cfg.column - 1;
        const yIdxMax = this.cfg.row - 1;
        switch (this.cfg.region) {
            case 1: {
                this.setupPortion(ctx, 0, 0, xIdxMax, yIdxMax, 1);
                break;
            }
            case 2: {
                const tempX = Math.floor(this.cfg.column / 2);
                this.setupPortion(ctx, 0, 0, tempX - 1, yIdxMax, 1);
                this.setupPortion(ctx, tempX, 0, xIdxMax, yIdxMax, 2);
                break;
            }
            case 3: {
                const tempX = Math.floor(this.cfg.column / 3);
                const tempX2 = tempX * 2;
                this.setupPortion(ctx, 0, 0, tempX - 1, yIdxMax, 1);
                this.setupPortion(ctx, tempX, 0, tempX2 - 1, yIdxMax, 2);
                this.setupPortion(ctx, tempX2, 0, xIdxMax, yIdxMax, 3);
                break;
            }
            case 4: {
                const tempX = Math.floor(this.cfg.column / 2);
                const tempY = Math.floor(this.cfg.row / 2);
                this.setupPortion(ctx, 0, 0, tempX - 1, tempY - 1, 1);
                this.setupPortion(ctx, tempX, 0, xIdxMax, tempY - 1, 2);
                this.setupPortion(ctx, 0, tempY, tempX - 1, yIdxMax, 3);
                this.setupPortion(ctx, tempX, tempY, xIdxMax, yIdxMax, 4);
                break;
            }
            case 5: {
                const tempX = Math.floor(this.cfg.column / 2);
                const tempY = Math.floor(this.cfg.row / 3);
                const tempY2 = tempY * 2;
                this.setupPortion(ctx, 0, 0, tempX - 1, tempY - 1, 1);
                this.setupPortion(ctx, tempX, 0, xIdxMax, tempY - 1, 2);
                this.setupPortion(ctx, 0, tempY, tempX - 1, tempY2 -1, 3);
                this.setupPortion(ctx, tempX, tempY, xIdxMax, tempY2 -1, 4);
                this.setupPortion(ctx, 0, tempY2, xIdxMax, yIdxMax, 5);
                break;
            }
            case 6: {
                const tempX = Math.floor(this.cfg.column / 2);
                const tempY = Math.floor(this.cfg.row / 3);
                const tempX2 = tempX * 2;
                const tempY2 = tempY * 2;
                this.setupPortion(ctx, 0, 0, tempX - 1, tempY - 1, 1);
                this.setupPortion(ctx, tempX, 0, xIdxMax, tempY - 1, 2);
                this.setupPortion(ctx, 0, tempY, tempX - 1, tempY2 -1, 3);
                this.setupPortion(ctx, tempX, tempY, xIdxMax, tempY2 -1, 4);
                this.setupPortion(ctx, 0, tempY2, tempX - 1, yIdxMax, 5);
                this.setupPortion(ctx, tempX, tempY2, xIdxMax, yIdxMax, 6);
                break;
            }

            default: {
                this.setupPortion(ctx, 0, 0, xIdxMax, yIdxMax, 1);
                break;
            }
        }

    }

    coordinateValid(x: number, y: number) {
        if (x < 0 || x >= this.cfg.column) {
            return false;
        }
        if (y < 0 || y >= this.cfg.row) {
            return false;
        }
        return true;
    }

    targetRegionValid(currentRegion: number, targetX: number, targetY: number) {
        if (! this.coordinateValid(targetX, targetY)) {
            return false;
        }

        if (currentRegion !== this.region[targetY][targetX]) {
            return false;
        }
        return true;
    }

    private drawBaseGrid(ctx: CanvasRenderingContext2D) {
        this.ds.clearAll(ctx);
        if (! this.cfg.displayGrid) {
            return;
        }
        // stroke
        ctx.lineWidth = this.cfg._gridStrokeWidth;
        ctx.strokeStyle = SymbolColor.BaseGrid;

        for (let j = 0; j < this.cfg.row; j++) {
            for (let i = 0; i < this.cfg.column; i++) {                
                ctx.strokeRect(i * this.cfg.symbolSize, j * this.cfg.symbolSize, this.cfg.symbolSize, this.cfg.symbolSize);
            }
        }

        // stroke reset
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000';        
    }

    private setupPortion(ctx: CanvasRenderingContext2D, xIdx0: number, yIdx0: number, xIdx1: number, yIdx1: number, region: number) {
        this.assignLabel(xIdx0, yIdx0, xIdx1, yIdx1, region);
        this.drawBorder(ctx, xIdx0, yIdx0, xIdx1, yIdx1, region);
    }

    private assignLabel(xMinIdx: number, yMinIdx: number, xMaxIdx: number, yMaxIdx: number, region: number) {
        // this.region
        for (let j = yMinIdx; j <= yMaxIdx; j++) {
            for (let i = xMinIdx; i <= xMaxIdx; i++) {
                this.region[j][i] = region;
            }
        }
    }

    private drawBorder(ctx: CanvasRenderingContext2D, xIdx0: number, yIdx0: number, xIdx1: number, yIdx1: number, region: number) {
        const startX = xIdx0 * this.cfg.symbolSize;
        const startY = yIdx0 * this.cfg.symbolSize;
        const endX = (xIdx1 - xIdx0 + 1) * this.cfg.symbolSize;
        const endY = (yIdx1 - yIdx0 + 1) * this.cfg.symbolSize;

        // stroke
        const segments = 3;
        ctx.setLineDash([segments, segments]);
        ctx.lineWidth = this.cfg._gridStrokeWidth;
        ctx.strokeStyle = SymbolColor.RegionBorder;
        ctx.strokeRect(startX, startY, endX, endY);

        // stroke reset
        ctx.setLineDash([]);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000';
    }
    

    

}
