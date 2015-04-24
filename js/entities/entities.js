game.PlayerEntity = me.Entity.extend({
    
    init: function(x, y, settings) {
        this.setSuper(x, y);
        this.setPlayerTimers();
        this.setAttributes();
        this.type = "PlayerEntity";
        this.setFlags();


        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        this.addAnimation();


        this.renderable.setCurrentAnimation("idle");
    },
    
    setSuper: function(x, y) {
        this._super(me.Entity, 'init', [x, y, {
                image: "kirbyplayer",
                width: 110,
                height: 70,
                spritewidth: "110",
                spriteheight: "70",
                getShape: function() {
                    return(new me.Rect(0, 0, 70, 110)).toPolygon();
                }
            }]);
    },
    
    setPlayerTimers: function() {
        this.now = new Date().getTime();
        this.lastHit = this.now;
        this.lastAttak = new Date().getTime();
    },
    
    setAttributes: function() {
        this.health = game.data.playerHealth;
        this.body.setVelocity(game.data.playerMoveSpeed, 20);
        this.attack = game.data.playerAttack;
    },
    
    addAnimation: function() {
        this.renderable.addAnimation("jump", [0]);
        this.renderable.addAnimation("idle", [1]);
        this.renderable.addAnimation("walk", [4, 5, 6, 7], 80);
        this.renderable.addAnimation("attack", [8, 9, 10, 11], 80);
    },
    
    setFlags: function() {
        this.facing = "right";
        this.dead = false;
        this.attacking = false;
    },
    
    update: function(delta) {
        this.now = new Date().getTime();


        this.dead = this.checkIfDead();
        this.checkKeyPressesAndMove();





        if (me.input.isKeyPressed("attack")) {
            if (!this.renderable.isCurrentAnimation("attack")) {
                this.renderable.setCurrentAnimation("attack", "idle");

                this.renderable.setAnimationFrame();
            }
        }
        else if (this.body.vel.x !== 0) {
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else {
            this.renderable.setCurrentAnimation("idle");
        }

        me.collision.check(this, true, this.collideHandler.bind(this), true);    

        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    checkIfDead: function() {
        if (this.health <= 0) {
            return true;
        }
        return false;
    },
    
    checkKeyPressesAndMove: function() {
        if (me.input.isKeyPressed("right")) {
            this.moveRight();
        } else if (me.input.isKeyPressed("left")) {
            this.moveLeft();
        } else {
            this.body.vel.x = 0;
        }

        if (me.input.isKeyPressed("jump") && !this.body.jumping && !this.body.falling) {
            this.jump();
            this.renderable.setCurrentAnimation("jump");
        }
    },
    
    moveRight: function() {
        this.body.vel.x += this.body.accel.x * me.timer.tick;
        this.facing = "right";
        this.flipX(false);
    },
    
    moveLeft: function() {
        this.body.vel.x -= this.body.accel.x * me.timer.tick;
        this.facing = "left";
        this.flipX(true);
    },
    
    jump: function() {
        this.body.jumping = true;
        this.body.vel.y -= this.body.accel.y * me.timer.tick;
    },
    
    loseHealth: function(damage) {
        this.health = this.health - damage;
    },
    
    collideHandler: function(response) {
        
        if (response.b.type === 'EnemyBaseEntity') {
            this.collideWithEnemyBase(response);
        } else if (response.b.type === 'EnemyCreep') {
            this.collideWithEnemyCreep(response);
        }
    },
    
    collideWithEnemyBase: function(response) {
        var ydif = this.pos.y - response.b.pos.y;
        var xdif = this.pos.x - response.b.pos.x;


        if (xdif > -35 && this.facing === 'right' && (xdif < 0)) {
            this.body.vel.x = 0;
            this.pos.x = this.pos.x - 1;
        } else if (xdif < 60 && this.facing === 'left' && xdif < 0) {
            this.body.vel.x = 0;
            this.pos.x = this.pos.x + 1;
        } else if (ydif < -40 && xdif < 70 && xdif > -35) {
            this.body.falling = false;
            this.body.vel.y = -1;
        }
    },
    
    collideWithEnemyCreep: function(response) {
        var xdif = this.pos.x - response.b.pos.x;
        var ydif = this.pos.y - response.b.pos.y;

        this.stopMovement(xdif);

        if (this.checkAttack(xdif, ydif)) {
            this.hitCreep(response);
//            if (response.b.health <= game.data.playerAttack) {
//                game.data.gold += 1;
//                console.log("Current gold: " + game.data.gold);
//            }
         
        }
    },
    
    stopMovement: function(xdif) {
        if (xdif > 0) {
            this.pos.x = this.pos.x + 1;
            if (this.facing === "left") {
                this.vel.x = 0;
            }
        } else {
            this.pos.x = this.pos.x - 1;
            if (this.facing === "right") {
                this.body.vel.x = 0;
            }
        }
    },
    
    checkAttack: function(xdif, ydif) {
       if (this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= 1000
                    && (Math.abs(ydif) <= 40) &&
                    (((xdif > 0) && this.facing === "left") || ((xdif < 0) && this.facing === "right"))
                    ){
                this.lastHit = this.now;
                // if the creeps' health is less than our attack, execute code in if statement
              return true;
            }
            return false;


    },
    
    hitCreep: function(response) {
         if (response.b.health <= game.data.playerAttack) {
                    // adds one gold for a creep kill
                    game.data.gold += 1;
                }

                response.b.loseHealth(game.data.playerAttack);
    
     response.b.loseHealth(game.data.playerAttack);
        }
        


});