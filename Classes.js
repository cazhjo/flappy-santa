class Obstacle{
    Top = class Top{
        constructor(x, y, width, height){
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
    }

    Bottom = class Bottom{
        constructor(x, y, width, height){
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
    }

    constructor(x, width, gap){
        this.x = x;
        this.width = width;
        this.gap = gap
        this.y = 0;

        this.Top = new this.Top(this.x, this.y, this.width, Math.random() * (canv.height - 150 - 150) + 150);
        this.gap = this.Top.height + this.gap;
        this.Bottom = new this.Bottom(this.x, this.gap, this.width, canv.height - this.gap);
    }
    
    move(amount){
        this.x -= amount;
        this.Top.x -= amount;
        this.Bottom.x -= amount;
    }

    draw(){
        drawRect(this.x, this.Top.y, this.width, this.Top.height, "black", true);
        drawRect(this.x, this.Bottom.y, this.width, this.Bottom.height, "black", true);
    }
}