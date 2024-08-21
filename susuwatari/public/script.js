let x;
let width, height;
let balls = [];
let ball_num;
let ball_radius;

let predators = [];
let predator_num;
let predator_size;

let ball_sprite;


let plant_data;
let plant_sheet;

let plant_animation = [];

let plants = [];

class plant {
    constructor() {
        var a;
    }

}

class predator {
    constructor() {
        this.pos = createVector(400, 400);
        this.target = Math.floor(Math.random()*(ball_num-1));
        this.afraid = false;
        this.size = predator_size;
        
    }

    update() {
        var r_vec = balls[this.target].pos.copy().sub(this.pos);
        
        if(r_vec.mag() < 20) {
            balls[this.target].puff();
            this.target = Math.floor(Math.random()*(ball_num-1));
            //this.size+=1;
        }

        if(r_vec.mag() < 100) {
            r_vec.normalize();
            this.pos.add(r_vec.mult(10));
        }

        if(r_vec.mag() > 100) {
            r_vec.normalize();
            this.pos.add(r_vec.mult(5));
        }
        
        

        //walls
        if(this.pos.x < 0) {
            this.pos.x = 0;
        }

        if(this.pos.y < 0) {
            this.pos.y = 0;
        }

        if(this.pos.x > width) {
            this.pos.x = width;
        }

        if(this.pos.y > height) {
            this.pos.y = height;
        }
    }
}

class ball {
    constructor(index) {
        this.index = index;
        this.pos = createVector(400, 400);
        this.partner = Math.floor(Math.random()*(ball_num-1));
        
        this.existent = true;
        this.afraid = false;
        this.radius = ball_radius;
        this.happy = false;
        this.puffing = false;
        this.puffing_frames = 0;
    }

    update() {
        //this.pos.x += Math.floor(Math.random()*3)-1;
        //this.pos.y += Math.floor(Math.random()*3)-1;

        if (this.puffing) {
            this.puffing_frames+=1;
            if (this.puffing_frames > 50) {
                this.puffing = false;
                this.pos.x = Math.floor(Math.random()*width);
                this.pos.y = Math.floor(Math.random()*height);
                this.puffing_frames = 0;
            }
            return;
        }



        var mouse_pos = createVector(mouseX,mouseY);
        this.afraid = false;
        this.happy = false;
        //walls
        if(this.pos.x < 0+this.radius/2) {
            this.pos.x = 0+this.radius/2;
        }

        if(this.pos.y < 0+this.radius/2) {
            this.pos.y = 0+this.radius/2;
        }

        if(this.pos.x > width-this.radius/2) {
            this.pos.x = width-this.radius/2;
        }

        if(this.pos.y > height-this.radius/2) {
            this.pos.y = height-this.radius/2;
        }
        
        //Behaviour
        var r_vec = mouse_pos.sub(this.pos);
        if(r_vec.mag() < 200) {
            r_vec.normalize();
            this.pos.add(r_vec.mult(-3));
        } else {
            r_vec = balls[this.partner].pos.copy();
            r_vec.sub(this.pos);
            if (r_vec.mag() > 100) {
                r_vec.normalize();
                this.pos.add(r_vec);
            } else {
                //this.radius+=0.001;
                this.happy = true;
            }
        }
        
        for (let predator of predators) {
            r_vec = predator.pos.copy().sub(this.pos);
            if (r_vec.mag() < 200) {
                r_vec.normalize();
                this.pos.add(r_vec.mult(-4));
                this.afraid = true;
            }
        }

        for (let ball of balls) {
            r_vec = ball.pos.copy().sub(this.pos);
            if (r_vec.mag() < (this.radius/2)+(ball.radius/2)) {
                this.pos.add(r_vec.mult(-0.1));
                ball.pos.add(r_vec.mult(0.1));
            }
        }

            
       

   }

    puff() {
        if(!this.puffing) {
            this.puffing = true;
            ball_sprite_puff.reset();
        }
       
    }
}

function preload() {
    ball_sprite = loadImage('susuwatari.gif');
    ball_sprite_puff = loadImage('susuwatari_puff.gif');
    plant_data = loadJSON('pflanze_001.json');
    plant_sheet = loadImage('pflanze_001.png');
}

function setup() {
    x=0;
    width = displayWidth-20;
    height = displayHeight-20;
    //width = 800;
    //height = 800;
    ball_num = 200;
    ball_radius = 24;

    predator_num = 1;
    predator_size = 10

    createCanvas(width, height);

    for (let i = 0; i < ball_num; i++) {
        balls.push(new ball(i));
    }

    for (let i = 0; i < predator_num; i++) {
        predators.push(new predator());
    }

    let frames = plant_data.frames;
    console.log(plant_data.frames);
    for (let i = 0; i < 25; i++) {
        let pos = frames[i].frame;
        console.log(pos);
        let img = plant_sheet.get(pos.x, pos.y, pos.w, pos.h);
        img.resize(64,0);
        plant_animation.push(img);
     
    }

    for (let i = 0; i < 5; i++) {
        plants.push(new plant());
    }



}

function draw() {
    background(245,222,179);
    stroke(50);
    

    for (let ball of balls) {
        if (ball.existent) {
            fill(255,255,0);

         

            if (ball.afraid) {
                fill(0,0,100);
            } 
            ball.update();
            //ellipse(ball.pos.x,ball.pos.y,ball.radius,ball.radius);
            if(ball.puffing) {
                image(ball_sprite_puff,ball.pos.x,ball.pos.y);
            } else {
                image(ball_sprite,ball.pos.x,ball.pos.y);
            }
        }
    }

    fill(200,0,0);
    for (let predator of predators) {
        predator.update();
        triangle(predator.pos.x-predator.size,predator.pos.y-predator.size,predator.pos.x,predator.pos.y+predator.size,predator.pos.x+predator.size,predator.pos.y-predator.size);
    }


    for (let plant of plants) {
        image(plant_animation[Math.floor(frameCount/10) % 25],400,400)
      }

}


