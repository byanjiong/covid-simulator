import { Injectable } from "@angular/core";
import { Person } from "../models/person.model";
import { regionColorPicker, SymbolColor } from "../models/symbol.model";
import { ConfigService } from "./config.service";
import { PersonService } from "./person.service";
import { RegionService } from "./region.service";



@Injectable({
    providedIn: 'root'
})
export class DrawService {
    constructor(
        private cfg: ConfigService
    ) {}

    ctxSymbol1: CanvasRenderingContext2D;
    ctxSymbol2: CanvasRenderingContext2D;
    ctxSymbol3: CanvasRenderingContext2D;
    ctxSymbol4: CanvasRenderingContext2D;

    initCanvas(ctx: CanvasRenderingContext2D) {
        ctx.canvas.width = this.cfg.column * this.cfg.symbolSize;
        ctx.canvas.height = this.cfg.row * this.cfg.symbolSize;
        
        this.prepareCtxSymbol1();
        this.prepareCtxSymbol2();
        this.prepareCtxSymbol3();
        this.prepareCtxSymbol4();
    }

    clearRegion(ctx: CanvasRenderingContext2D, x: number, y: number) {
        ctx.clearRect(x * this.cfg.symbolSize, y * this.cfg.symbolSize, this.cfg.symbolSize, this.cfg.symbolSize);
    }
    
    clearAll(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, this.cfg.column * this.cfg.symbolSize, this.cfg.row * this.cfg.symbolSize);
    }

    private prepareCtxSymbol1() {
        const canvas = document.createElement('canvas');
        this.ctxSymbol1 = canvas.getContext('2d') as CanvasRenderingContext2D;

        canvas.height = this.cfg.symbolSize;
        canvas.width = this.cfg.symbolSize;

        const x = Math.floor(this.cfg.symbolSize / 2);
        const r = this.cfg.symbolSize - this.cfg.padding;

        this.ctxSymbol1.lineWidth = Math.floor(this.cfg.padding / 2);

        const offset = this.cfg.padding;
        const w = this.cfg.symbolSize - 2 * offset;
        this.ctxSymbol1.strokeStyle = SymbolColor.Quarantine;
        this.ctxSymbol1.strokeRect(offset, offset, w, w);
    }

    private prepareCtxSymbol2() {
        const canvas = document.createElement('canvas');
        this.ctxSymbol2 = canvas.getContext('2d') as CanvasRenderingContext2D;

        canvas.height = this.cfg.symbolSize;
        canvas.width = this.cfg.symbolSize;

        const x = Math.floor(this.cfg.symbolSize / 2);
        let r = Math.floor(this.cfg.symbolSize / 2 - 2 * this.cfg.padding);
        r = r > 2 ? r : 2;
        this.ctxSymbol2.lineWidth = Math.floor(this.cfg.padding / 2);
        this.ctxSymbol2.strokeStyle = SymbolColor.Vaccine;
        this.ctxSymbol2.beginPath();
        this.ctxSymbol2.arc(x, x, r, 0, 2 * Math.PI);
        this.ctxSymbol2.stroke();
    }


    private prepareCtxSymbol3() {
        const canvas = document.createElement('canvas');
        this.ctxSymbol3 = canvas.getContext('2d') as CanvasRenderingContext2D;

        const ctx = this.ctxSymbol3;

        canvas.height = this.cfg.symbolSize;
        canvas.width = this.cfg.symbolSize;

        ctx.beginPath();
        ctx.moveTo(this.cfg.padding, this.cfg.symbolSize - this.cfg.padding);
        ctx.lineTo(this.cfg.symbolSize - this.cfg.padding, this.cfg.symbolSize - this.cfg.padding);
        ctx.lineTo(Math.floor(this.cfg.symbolSize / 2), this.cfg.padding);
        ctx.closePath();

        // outline
        ctx.lineWidth = Math.floor(this.cfg.padding / 2);;
        ctx.strokeStyle = SymbolColor.Testing;
        ctx.stroke();
    }

    private prepareCtxSymbol4() {
        const canvas = document.createElement('canvas');
        this.ctxSymbol4 = canvas.getContext('2d') as CanvasRenderingContext2D;

        canvas.height = this.cfg.symbolSize;
        canvas.width = this.cfg.symbolSize;

        const x = Math.floor(this.cfg.symbolSize / 2);
        let r = Math.floor(this.cfg.symbolSize / 2 - 2 * this.cfg.padding);
        let r0 = r - 2 * this.cfg.padding > 0 ? r - 2 * this.cfg.padding : 0;
        this.drawStar(this.ctxSymbol4, x, x, 5, r, r0);
    }

      

    private drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;
    
        ctx.strokeStyle = "#000";
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius)
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y)
            rot += step
    
            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y)
            rot += step
        }
        ctx.lineTo(cx, cy - outerRadius)
        ctx.closePath();
        ctx.lineWidth = Math.floor(this.cfg.padding / 2);
        // ctx.strokeStyle = 'blue';
        ctx.stroke();
        // ctx.fillStyle = 'skyblue';
        // ctx.fill();
    }
}
