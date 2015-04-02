game.PlayerBaseEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "tower",
                width: 100,
                height: 100,
                spritewidth: "100",
                spriteheight: "100",
                getShape: function() {
                    return (new me.Rect(0, 0, 100, 70)).toPolygon();
                }
            }]);
        this.broken = false;
        this.health = 10;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);
        this.type = "PlayerBaseEntity";
    },
    
    
    update: function(delta) {
        if (this.health <= 0) {
            this.broken = true;
        }
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    
    onCollision: function() {

    }
});
