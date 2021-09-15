class Tile{
    constructor(x,y,grid) {
        this.x = x;
        this.y = y;
        this.color = 'transparent';
        this.grid = grid;
        this.img = null;
        this.dblw = 1;
        this.dblt = 1;
        this.whichframe = 0;
    }
    draw_box(color=this.color) {
        // if(!this.img) return;
        let sx = this.grid.sx;
        let sy = this.grid.sy;
        let offsetX = this.grid.offsetX;
        let offsetY = this.grid.offsetY;
        this.grid.ctx.beginPath();
        this.grid.ctx.strokeStyle = 'black';
        this.grid.ctx.fillStyle =  color;
        this.grid.ctx.rect(offsetX+this.x*sx,offsetY+this.y*sy,sx*this.dblw,sy*this.dblt);
        this.grid.ctx.fill();
        if(lines) this.grid.ctx.stroke();
        if(this.img){
            let temp_canvas = create('canvas');
            let temp_ctx = temp_canvas.getContext('2d');
            temp_canvas.width = sx*this.dblw;
            temp_canvas.height = sy*this.dblt;
            let frame = new Path2D;
            if(this.whichframe===1) frame.ellipse((sx*this.dblw)/2,(sy*this.dblt)/2,sx*this.dblw/2,sy*this.dblt/2,0,0,Math.PI*2);
            if(this.whichframe > 0) temp_ctx.clip(frame);
            temp_ctx.drawImage(this.img,0,0,sx*this.dblw,sy*this.dblt);
            // obj('left').appendChild(temp_canvas)
            this.grid.ctx.drawImage(temp_canvas,offsetX+this.x*sx+5,offsetY+this.y*sy+5,sx*this.dblw-10,sy*this.dblt-10);
        }
    }
    hasPoint(x,y) {
        let sx = this.grid.sx;
        let sy = this.grid.sy;
        let offsetX = this.grid.offsetX;
        let offsetY = this.grid.offsetY;
        return x >= this.x * sx + offsetX &&
            x < this.x * sx + offsetX + sx &&
            y >= this.y * sy + offsetY &&
            y < this.y * sy + offsetY + sy;
    }
    getCenter(){
        let sx = this.grid.sx;
        let sy = this.grid.sy;
        let offsetX = this.grid.offsetX;
        let offsetY = this.grid.offsetY;
        let x = offsetX + this.x * sx + sx / 2;
        let y = offsetY + this.y * sy + sy / 2;
        return {x,y};
    }
}
class Grid{
    constructor(w,h,scaleX,scaleY) {
        this.tiles = [];
        this.width = w;
        this.height = h;
        this.sx = scaleX;
        this.sy = scaleY;
        this.offsetX = 0;
        this.offsetY = 0;
        if(window.ctx){
            this.ctx = ctx;
        }
        for (let x = 0; x < w; x++) {
            let row = [];
            for (let y = 0; y < h; y++) {
                row.push(new Tile(x,y,this));
            }
            this.tiles.push(row);
        }
    }
    inBounds(x,y){
        return x>=0&&x<this.width&&y>=0&&y<this.height;
    }
    getTileAt(x,y){
        if(this.inBounds(x,y)){
            return this.tiles[x][y];
        }
    }
    forEach(callback) {
        for (let row of this.tiles) {
            for (let tile of row) {
                let stop = callback(tile);
                if (stop) return;
            }
        }
    }
    draw_boxes() {
        let stack = []
        this.forEach(tile => {
            stack.push(tile);
        });
        while(stack.length > 0){
            stack.pop().draw_box();
        }
    }
    getActiveTile(x,y) {
        let result;
        this.forEach(tile => {
            if (tile.hasPoint(x?x:mouse.pos.x,y?y:mouse.pos.y)) {
                result = tile;
                return true;
            }
        });
        return result;
    }
}